import { test, expect } from 'bun:test';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { generateInstalledPreamble } from '../scripts/resolvers/preamble';
import { HOST_PATHS, type Host, type TemplateContext } from '../scripts/resolvers/types';

const START = path.resolve(import.meta.dir, '../bin/gstack-skill-start');

for (const host of ['claude', 'codex'] as Host[]) {
  for (const location of ['global', 'local'] as const) {
    test(`${host} ${location} bootstrap returns reusable absolute paths`, () => {
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack boot '));
      try {
        const home = path.join(tmp, 'home');
        const project = path.join(tmp, 'project');
        const codexHome = path.join(home, 'custom codex');
        const runtime = location === 'local'
          ? path.join(project, HOST_PATHS[host]!.localSkillRoot)
          : host === 'codex' ? path.join(codexHome, 'skills/gstack') : path.join(home, '.claude/skills/gstack');
        fs.mkdirSync(path.join(runtime, 'bin'), { recursive: true });
        fs.mkdirSync(project, { recursive: true });
        fs.writeFileSync(path.join(runtime, 'CONTRACT.md'), 'isolated contract\n');
        const start = path.join(runtime, 'bin/gstack-skill-start');
        fs.copyFileSync(START, start);
        fs.chmodSync(start, 0o755);
        if (location === 'local') {
          const git = spawnSync('git', ['init', '-q'], { cwd: project, timeout: 10_000 });
          expect(git.status).toBe(0);
        }
        const ctx: TemplateContext = { skillName: 'review', tmplPath: 'review/SKILL.md.tmpl', host, paths: HOST_PATHS[host]!, preambleTier: 2 };
        const preamble = generateInstalledPreamble(ctx);
        expect(preamble.length).toBeLessThan(800);
        const fence = preamble.match(/```bash\n([\s\S]*?)\n```/);
        expect(fence).not.toBeNull();
        const env = { ...process.env, HOME: home, CODEX_HOME: codexHome, GSTACK_HOME: path.join(home, 'state folder') };
        const first = spawnSync('bash', ['-c', fence![1]!], {
          cwd: project,
          env,
          encoding: 'utf8', timeout: 10_000,
        });
        expect(first.status, first.stderr).toBe(0);
        expect(first.stdout).toContain('SKILL_START_PROTO: 1');
        const contract = first.stdout.match(/^GSTACK_CONTRACT: (.+)$/m)?.[1];
        const bin = first.stdout.match(/^GSTACK_BIN: (.+)$/m)?.[1];
        const resolvedRuntime = fs.realpathSync(runtime);
        expect(contract).toBe(path.join(resolvedRuntime, 'CONTRACT.md'));
        expect(bin).toBe(path.join(resolvedRuntime, 'bin'));
        const second = spawnSync('bash', ['-c', 'cat "$1"; "$2/gstack-skill-start" --skill review', 'second-shell', contract!, bin!], {
          cwd: project, env, encoding: 'utf8', timeout: 10_000,
        });
        expect(second.status, second.stderr).toBe(0);
        expect(second.stdout).toContain('isolated contract\nSKILL_START_PROTO: 1');
      } finally {
        fs.rmSync(tmp, { recursive: true, force: true });
      }
    });
  }
}
