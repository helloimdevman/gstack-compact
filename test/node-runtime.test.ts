import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dir, '..');
describe.skipIf(process.platform === 'win32')('Bun-free runtime', () => {
  let temp: string;
  let env: NodeJS.ProcessEnv;
  const run = (file: string, args: string[] = [], input?: string) => spawnSync(path.join(ROOT, file), args, {
    cwd: temp, env, input, encoding: 'utf8', timeout: 30_000,
  });
  beforeAll(() => {
    temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-node-'));
    const bin = path.join(temp, 'bin');
    fs.mkdirSync(bin);
    const node = Bun.which(process.env.GSTACK_NODE_BIN ?? 'node');
    if (!node) throw new Error('Node.js is required for runtime regressions');
    fs.symlinkSync(node, path.join(bin, 'node'));
    for (const command of ['open', 'xdg-open']) fs.writeFileSync(path.join(bin, command), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
    env = { ...process.env, PATH: `${bin}:/usr/bin:/bin`, HOME: temp, USERPROFILE: temp,
      GSTACK_HOME: path.join(temp, 'state'), GSTACK_STATE_ROOT: path.join(temp, 'state'),
      GSTACK_NODE_BIN: 'node', GSTACK_SESSION_KIND: 'spawned',
      GSTACK_MODEL_SOURCE: path.join(ROOT, 'scripts/models.ts'),
      DESIGN_DAEMON_STATE_FILE: path.join(temp, 'design-state.json') };
    const check = spawnSync('bash', ['-c', 'command -v bun'], { env, encoding: 'utf8', timeout: 5_000 });
    expect(check.status).not.toBe(0);
  });
  afterAll(() => fs.rmSync(temp, { recursive: true, force: true }));

  test('inline helpers preserve stdin, argv, async imports and failure status', () => {
    const ok = run('bin/gstack-js', ['-e', 'const fs=require("node:fs"); const { resolveModel }=await import(process.env.GSTACK_MODEL_SOURCE); console.log(JSON.stringify([JSON.parse(fs.readFileSync(0,"utf8")),process.argv[1],resolveModel("gpt-6-astra")]));', 'literal $(not-a-command)'], '{"value":3}');
    expect(ok.status, ok.stderr).toBe(0);
    expect(JSON.parse(ok.stdout)).toEqual([{ value: 3 }, 'literal $(not-a-command)', 'gpt-6-astra']);
    const failed = run('bin/gstack-js', ['-e', 'throw new Error("fixture failure")']);
    expect(failed.status).toBe(1);
    expect(failed.stderr).toContain('fixture failure');
  });

  for (const host of ['claude', 'codex']) {
    for (const profile of ['core', 'compat']) {
      test(`${host} ${profile} installs and starts without Bun`, () => {
        const home = path.join(temp, host, profile);
        const skills = path.join(home, 'skills');
        const state = path.join(home, 'render');
        fs.mkdirSync(path.join(skills, 'personal'), { recursive: true });
        fs.writeFileSync(path.join(skills, 'personal/SKILL.md'), 'my own skill');
        const installed = run('bin/gstack-js', ['scripts/install-core-profile.ts'].map(file => path.join(ROOT, file)).concat([
          '--host', host, '--profile', profile, '--source-root', ROOT, '--skills-dir', skills,
          '--state-root', state, '--model', host === 'codex' ? 'gpt-6-astra' : 'claude', '--prefix',
        ]));
        expect(installed.status, installed.stderr).toBe(0);
        const names = fs.readdirSync(skills).filter(name => name !== 'personal');
        if (profile === 'core') expect(names.length).toBe(11);
        else {
          expect(names.length).toBeGreaterThan(11);
          expect(names).toContain('gstack-plan-eng-review');
        }
        expect(fs.readFileSync(path.join(skills, 'personal/SKILL.md'), 'utf8')).toBe('my own skill');
        expect(fs.readFileSync(path.join(skills, 'gstack-plan/SKILL.md'), 'utf8')).toContain('gstack-skill-start');
        const started = spawnSync(path.join(skills, 'gstack/bin/gstack-skill-start'), ['--skill', 'plan'], {
          cwd: temp, env, encoding: 'utf8', timeout: 30_000,
        });
        expect(started.status, started.stderr).toBe(0);
        expect(started.stdout).toContain('SKILL_START_PROTO: 1');
        const design = spawnSync(path.join(skills, 'gstack/design/design'), [], { cwd: temp, env, encoding: 'utf8', timeout: 10_000 });
        expect(design.status, design.stderr).toBe(0);
        expect(design.stdout).toContain('gstack design');
        if (host === 'claude' && profile === 'core') {
          // Windows installs copy files instead of linking to source dependencies.
          const copied = path.join(home, 'copied-runtime');
          const runtime = path.join(skills, 'gstack');
          fs.cpSync(runtime, copied, { recursive: true, dereference: true, filter: file => {
            const parts = path.relative(runtime, file).split(path.sep);
            return !parts[0] || (['bin', 'lib', 'design', 'make-pdf', 'node_modules', 'VERSION', 'CONTRACT.md'].includes(parts[0])
              && !parts.some(part => part === 'cso' || part === 'diagram-render' || part.startsWith('gstack-cso-')));
          } });
          const file = path.join(temp, 'DESIGN.md');
          fs.writeFileSync(file, '---\nname: Fixture\ncolors:\n  primary: "#123456"\n---\n\n## Overview\n\nA fixture.\n');
          const tokens = spawnSync(path.join(copied, 'bin/gstack-design-md.ts'), ['tokens', file], {
            cwd: temp, env, encoding: 'utf8', timeout: 10_000,
          });
          expect(tokens.status, tokens.stderr).toBe(0);
          expect(JSON.parse(tokens.stdout).tokens['colors.primary']).toBe('#123456');
          const detector = spawnSync(path.join(copied, 'bin/gstack-design-detect.ts'), ['probe'], {
            cwd: temp, env, encoding: 'utf8', timeout: 10_000,
          });
          expect(detector.status, detector.stderr).toBe(0);
          expect(detector.stdout).toContain('IMPECCABLE_');
          const copiedDesign = spawnSync(path.join(copied, 'design/design'), [], {
            cwd: temp, env, encoding: 'utf8', timeout: 10_000,
          });
          expect(copiedDesign.status, copiedDesign.stderr).toBe(0);
        }
      });
    }
  }

  test('security and tracker helpers still enforce their boundaries', () => {
    const high = run('bin/gstack-redact', ['--json'], 'ghp_' + 'A'.repeat(36));
    expect(high.status, high.stderr).toBe(3);
    expect(JSON.parse(high.stdout).findings.some((finding: { severity: string }) => finding.severity === 'HIGH')).toBe(true);
    const clean = run('bin/gstack-redact', ['--json'], 'plain documentation');
    expect(clean.status, clean.stderr).toBe(0);
    const guarded = run('bin/gstack-issue-guard', ['--stdin'], 'untrusted tracker text');
    expect(guarded.status, guarded.stderr).toBe(0);
    expect(guarded.stdout).toContain('untrusted');
    const repo = path.join(temp, 'hook-repo');
    fs.mkdirSync(repo);
    const git = spawnSync('git', ['init', '-q', repo], { env, encoding: 'utf8', timeout: 5_000 });
    expect(git.status, git.stderr).toBe(0);
    const team = spawnSync(path.join(ROOT, 'bin/gstack-team-init'), ['required'], {
      cwd: repo, env, encoding: 'utf8', timeout: 10_000,
    });
    expect(team.status, team.stderr).toBe(0);
    expect(JSON.parse(fs.readFileSync(path.join(repo, '.claude/settings.json'), 'utf8')).hooks.PreToolUse).toHaveLength(1);
    const installed = spawnSync(path.join(ROOT, 'bin/gstack-redact'), ['install-prepush-hook'], {
      cwd: repo, env, encoding: 'utf8', timeout: 10_000,
    });
    expect(installed.status, installed.stderr).toBe(0);
    const hook = spawnSync('bash', [path.join(repo, '.git/hooks/pre-push')], {
      cwd: repo, env: { ...env, GSTACK_REDACT_PREPUSH: 'skip' }, input: '', encoding: 'utf8', timeout: 10_000,
    });
    expect(hook.status, hook.stderr).toBe(0);
  });

  test('design board starts, attaches, serves and stops under Node', async () => {
    const html = path.join(temp, 'board.html');
    fs.writeFileSync(html, '<html><body>Node board</body></html>');
    try {
      const started = run('design/design', ['serve', '--html', html]);
      expect(started.status, started.stderr).toBe(0);
      const status = JSON.parse(run('design/design', ['daemon', 'status']).stdout);
      expect(status.running).toBe(true);
      const response = await fetch(`http://127.0.0.1:${status.port}/health`, { signal: AbortSignal.timeout(5000) });
      expect(response.status).toBe(200);
      expect((await response.json()).activeBoards).toBe(1);
      const attached = run('design/design', ['serve', '--html', html]);
      expect(attached.status, attached.stderr).toBe(0);
      expect(attached.stderr).toContain('DAEMON_ATTACHED');
      expect(run('design/design', ['daemon', 'stop']).status).toBe(1);
    } finally {
      const stopped = run('design/design', ['daemon', 'stop', '--force']);
      expect(stopped.status, stopped.stderr).toBe(0);
    }
    expect(JSON.parse(run('design/design', ['daemon', 'status']).stdout).running).toBe(false);
  });

  test('print HTML rendering uses the source helper without a build', () => {
    const markdown = path.join(temp, 'input.md');
    const html = path.join(temp, 'output.html');
    fs.writeFileSync(markdown, '# Node print\n\nHello\n');
    const rendered = run('bin/gstack-markdown-html', [markdown, html]);
    expect(rendered.status, rendered.stderr).toBe(0);
    expect(fs.readFileSync(html, 'utf8')).toContain('Node print');
  });
});
