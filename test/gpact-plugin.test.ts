import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { spawnSync } from 'node:child_process';
import { installCoreProfile } from '../scripts/install-core-profile';
import { generatePlugin } from '../scripts/gen-plugin';
import { namespaceSkill, publicSkillName } from '../scripts/skill-namespace';
import { loadRouterMap } from '../scripts/resolvers/router-map';
import { runGeneration } from '../scripts/gen-skill-docs';
import { buildBill } from '../lib/context-bill';
import { BUDGET_FIXTURE_PATH, EAGER_HEADROOM } from './helpers/capture-context-budget';

const ROOT = path.resolve(import.meta.dirname, '..');

test('public names and aliases change together without renaming runtime paths or IDs', () => {
  const source = '---\nname: gstack-upgrade\n---\nUse /gstack-upgrade, /plan, and $gstack-review. Read `../gstack-plan/SKILL.md`.\n~/.claude/skills/gstack/bin/gstack-skill-start --skill gstack\n';
  const prefixed = namespaceSkill(source);
  expect(prefixed).toContain('name: gpact-upgrade');
  expect(prefixed).toContain('/gpact-upgrade, /gpact-plan, and $gpact-review');
  expect(prefixed).toContain('../gpact-plan/SKILL.md');
  expect(prefixed).toContain('~/.claude/skills/gstack/bin/gstack-skill-start --skill gstack');
  expect(namespaceSkill(source, false)).toContain('Read `../plan/SKILL.md`');
  expect(publicSkillName('gstack')).toBe('gpact');
  expect(publicSkillName('gpact-review')).toBe('gpact-review');
});

for (const host of ['claude', 'codex'] as const) {
  test(`${host} plugin stays within the existing host context budgets`, async () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gpact-budget-'));
    try {
      const generated = await runGeneration({ host, skillProfile: 'core', outputRoot: temp });
      expect(generated.exitCode).toBe(0);
      const baseline = buildBill(host === 'claude' ? temp : path.join(temp, '.agents/skills'));
      const existing = JSON.parse(fs.readFileSync(BUDGET_FIXTURE_PATH, 'utf8'));
      const byName = new Map(baseline.skills.map(skill => [publicSkillName(skill.dir === baseline.root ? 'gstack' : skill.name), skill]));
      const deployed = buildBill(path.join(ROOT, 'plugin-skills', host));
      expect(baseline.skills).toHaveLength(11);
      expect(deployed.skills).toHaveLength(11);
      expect(deployed.totals.alwaysOnTokens).toBeLessThanOrEqual(existing.alwaysOnTotal);
      for (const skill of deployed.skills) {
        const canonical = byName.get(skill.name)!;
        expect(canonical).toBeDefined();
        const id = skill.name === 'gpact' ? 'gstack' : skill.name.replace(/^gpact-/, '');
        const ceiling = host === 'claude' ? existing.eagerPerInvocation[id] : Math.ceil(canonical.eagerTokens * EAGER_HEADROOM);
        expect(skill.eagerTokens, skill.name).toBeLessThanOrEqual(ceiling);
      }
    } finally { fs.rmSync(temp, { recursive: true, force: true }); }
  });

  test(`${host} prefixed compat aliases resolve and uninstall preserves foreign entries`, async () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gpact-alias-'));
    const skills = path.join(temp, host === 'claude' ? '.claude' : '.codex', 'skills');
    try {
      const entries = await installCoreProfile({ host, sourceRoot: ROOT, skillsDir: skills, stateRoot: path.join(temp, 'state'), profile: 'compat', prefix: true, model: host === 'claude' ? 'claude' : 'gpt' });
      let aliases = 0;
      for (const name of entries) {
        const file = path.join(skills, name, 'SKILL.md');
        const content = fs.readFileSync(file, 'utf8');
        expect(content).toMatch(/^name: gpact(?:-[a-z0-9-]+)?$/m);
        for (const match of content.matchAll(/Read `(\.\.\/[^`]+\/SKILL\.md)` relative to this installed SKILL\.md/g)) {
          aliases++;
          expect(fs.existsSync(path.resolve(path.dirname(file), match[1]))).toBe(true);
        }
      }
      expect(aliases).toBeGreaterThan(10);
      for (const name of ['gpact-personal', 'gpact-other-owner']) {
        fs.mkdirSync(path.join(skills, name));
        fs.writeFileSync(path.join(skills, name, 'SKILL.md'), '# User skill\n');
      }
      fs.writeFileSync(path.join(skills, 'gpact-other-owner', '.gstack-owned'), path.join(temp, 'other-source') + '\n');
      // Redirect the historical global /tmp cleanup into this owned fixture.
      const uninstall = path.join(temp, 'uninstall');
      fs.writeFileSync(uninstall, fs.readFileSync(path.join(ROOT, 'bin/gstack-uninstall'), 'utf8').replaceAll('/tmp/gstack-', path.join(temp, 'gstack-')));
      const removed = spawnSync('bash', [uninstall, '--force', '--keep-state'], {
        cwd: temp, encoding: 'utf8', timeout: 30_000,
        env: { ...process.env, HOME: temp, CODEX_HOME: path.join(temp, '.codex'), GSTACK_DIR: path.join(skills, 'gstack'), GSTACK_HOME: path.join(temp, 'state'), GSTACK_STATE_ROOT: path.join(temp, 'state') },
      });
      expect(removed.status, removed.stderr).toBe(0);
      for (const name of entries) expect(fs.existsSync(path.join(skills, name)), name).toBe(false);
      for (const name of ['gpact-personal', 'gpact-other-owner']) expect(fs.readFileSync(path.join(skills, name, 'SKILL.md'), 'utf8')).toBe('# User skill\n');
    } finally { fs.rmSync(temp, { recursive: true, force: true }); }
  });

  test(`${host} plugin exposes exactly the core catalog with portable bootstrap and sections`, () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, `.${host === 'claude' ? 'claude' : 'codex'}-plugin/plugin.json`), 'utf8'));
    expect(manifest.name).toBe('gpact');
    const skills = path.resolve(ROOT, manifest.skills);
    const names = fs.readdirSync(skills).sort();
    expect(names).toEqual(loadRouterMap().core.map(id => publicSkillName(id)).sort());
    for (const name of names) {
      const content = fs.readFileSync(path.join(skills, name, 'SKILL.md'), 'utf8');
      expect(content).toContain(`name: ${name}\n`);
      expect(content).toContain('"$_G/bin/gpact-plugin-init" || exit 1');
      expect(content).not.toContain('~/.claude/skills/gstack');
      expect(content).not.toContain('_R=$(git rev-parse');
      if (host === 'claude') expect(content).toContain('_G="${CLAUDE_PLUGIN_ROOT}"');
      else expect(content).toContain('three directories above this loaded SKILL.md');
      for (const match of content.matchAll(/`(sections\/[a-z0-9-]+\.md)`/g)) {
        expect(fs.existsSync(path.join(skills, name, match[1]))).toBe(true);
      }
    }
  });
}

test('committed plugin skills are byte-fresh against their source templates', async () => {
  expect(await generatePlugin(true)).toBe(0);
});

function runtimeFixture() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gpact-init-'));
  for (const file of ['bin/gpact-plugin-init', 'bin/gstack-js', 'lib/node-runtime.mjs', 'lib/node-eval.mjs']) {
    fs.mkdirSync(path.dirname(path.join(temp, file)), { recursive: true });
    fs.copyFileSync(path.join(ROOT, file), path.join(temp, file));
  }
  const commandDir = path.join(temp, 'commands');
  fs.mkdirSync(commandDir);
  // The fake package manager only writes within this fixture's owned cwd.
  fs.writeFileSync(path.join(commandDir, 'npm'), `#!/usr/bin/env bash
set -eu
printf '%s\\n' "$*" >> npm-calls
[ "\x24{FAIL_NPM:-}" != 1 ] || exit 17
for name in marked yaml semver smol-toml; do
  mkdir -p "node_modules/$name"
  printf '%s\\n' '{"type":"module","main":"index.js"}' > "node_modules/$name/package.json"
  printf '%s\\n' 'export default {};' > "node_modules/$name/index.js"
done
mkdir -p node_modules/semver/functions
cp node_modules/semver/index.js node_modules/semver/functions/compare.js
`, { mode: 0o755 });
  const node = Bun.which(process.env.GSTACK_NODE_BIN ?? 'node');
  if (!node) throw new Error('Node.js is required');
  const run = (extra: NodeJS.ProcessEnv = {}) => spawnSync('bash', [path.join(temp, 'bin/gpact-plugin-init')], {
    cwd: temp, env: { ...process.env, PATH: `${commandDir}:/usr/bin:/bin`, GSTACK_NODE_BIN: node, ...extra }, encoding: 'utf8', timeout: 30_000,
  });
  return { temp, run };
}

test.skipIf(process.platform === 'win32')('plugin cold init uses locked production-only npm install once without Bun', () => {
  const { temp, run } = runtimeFixture();
  try {
    const cold = run();
    expect(cold.status, cold.stderr).toBe(0);
    expect(run().status).toBe(0);
    expect(fs.readFileSync(path.join(temp, 'npm-calls'), 'utf8')).toBe('ci --omit=dev --ignore-scripts --no-audit --no-fund\n');
    expect(fs.existsSync(path.join(temp, '.gpact-runtime-install.lock'))).toBe(false);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});

test.skipIf(process.platform === 'win32')('failed or concurrent plugin initialization cannot report a ready runtime', () => {
  const { temp, run } = runtimeFixture();
  try {
    expect(run({ FAIL_NPM: '1' }).status).toBe(17);
    expect(fs.existsSync(path.join(temp, '.gpact-runtime-install.lock'))).toBe(false);
    fs.mkdirSync(path.join(temp, '.gpact-runtime-install.lock'));
    const busy = run();
    expect(busy.status).toBe(1);
    expect(busy.stderr).toContain('already in progress');
    expect(fs.readFileSync(path.join(temp, 'npm-calls'), 'utf8').split('\n')).toHaveLength(2);
    fs.rmdirSync(path.join(temp, '.gpact-runtime-install.lock'));
    expect(run().status).toBe(0);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
