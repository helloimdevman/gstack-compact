import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { runBashScript } from './helpers/bash-script';

const ROOT = path.resolve(import.meta.dir, '..');
const setup = fs.readFileSync(path.join(ROOT, 'setup'), 'utf8');

test('setup renders each selected legacy host once and leaves isolated profiles to their installer', () => {
  const slice = (from: string, to: string) => {
    const start = setup.indexOf(from);
    const end = setup.indexOf(to, start);
    if (start < 0 || end <= start) throw new Error(`setup block missing: ${from}`);
    return setup.slice(start, end);
  };
  const profiles = slice('CLAUDE_ISOLATED_PROFILE=0', '\nif [ "$MODEL_OVERRIDE_SET"');
  const model = slice('# Resolve the model overlay', '# 1. Install runtime dependencies');
  const render = slice('# Isolated core/compat installs', '# 3. Ensure');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-render-'));
  try {
    const trace = path.join(root, 'calls');
    const run = (overrides: Record<string, string> = {}) => {
      fs.writeFileSync(trace, '');
      const result = runBashScript(`set -e
log() { :; }
_prune_stale_generated() { :; }
_install_field() { printf '%s' "$SAVED_MODEL"; }
bun_cmd() {
  printf '%s\\t' "$@" >> "$TRACE"
  printf '\\n' >> "$TRACE"
  [ "$FAIL_BUN" != "$2" ] || return 17
  if [ "$2" = scripts/resolve-codex-generation-model.ts ]; then
    printf 'gpt-5.6-sol\\tfixture\\n'
  fi
}
${profiles}
${model}
${render}`, {
        cwd: root, timeout: 10_000,
        env: {
          ...process.env, HOME: root, SOURCE_GSTACK_DIR: root,
          CLAUDE_REGISTER_DIR: path.join(root, 'claude'), CODEX_GSTACK: path.join(root, 'codex'),
          CODEX_SKILLS: path.join(root, 'skills'), TRACE: trace,
          INSTALL_CLAUDE: '0', INSTALL_CODEX: '0', INSTALL_FACTORY: '0', INSTALL_OPENCODE: '0', INSTALL_CURSOR: '0',
          CLAUDE_SKILL_PROFILE: 'compat', CODEX_SKILL_PROFILE: 'compat', SKILL_PROFILE_OVERRIDE: '',
          MODEL_OVERRIDE_SET: '0', MODEL_OVERRIDE: '', SAVED_MODEL: '', FAIL_BUN: '', ...overrides,
        },
      });
      return { ...result, calls: fs.readFileSync(trace, 'utf8').trim().split('\n').filter(Boolean).map(line => line.trim().split('\t')) };
    };
    for (const host of ['claude', 'codex', 'factory', 'opencode', 'cursor']) {
      for (const build of ['0', '1']) {
        const r = run({ [`INSTALL_${host.toUpperCase()}`]: '1', NEEDS_BUILD: build });
        expect(r.status, r.stderr).toBe(0);
        const generations = r.calls.filter(args => args[1] === 'gen:skill-docs');
        expect(generations).toEqual([['run', 'gen:skill-docs', '--host', host,
          ...(['claude', 'codex'].includes(host) ? ['--model', host === 'codex' ? 'gpt-5.6-sol' : 'claude'] : [])]]);
        expect(r.calls.filter(args => args[1] === 'scripts/resolve-codex-generation-model.ts')).toHaveLength(host === 'codex' ? 1 : 0);
      }
    }
    for (const profile of ['core', 'compat']) {
      const r = run({ INSTALL_CLAUDE: '1', INSTALL_CODEX: '1', CLAUDE_SKILL_PROFILE: profile, CODEX_SKILL_PROFILE: profile, SKILL_PROFILE_OVERRIDE: profile });
      expect(r.status, r.stderr).toBe(0);
      expect(r.calls.filter(args => args[1] === 'gen:skill-docs')).toEqual([]);
    }
    const explicit = run({ INSTALL_CODEX: '1', MODEL_OVERRIDE_SET: '1', MODEL_OVERRIDE: 'model with spaces' });
    expect(explicit.calls[0]).toEqual(['run', 'scripts/resolve-codex-generation-model.ts', '--explicit', 'model with spaces']);
    fs.mkdirSync(path.join(root, 'codex'));
    fs.writeFileSync(path.join(root, 'codex/.gstack-install.json'), '{}');
    const saved = run({ INSTALL_CODEX: '1', SAVED_MODEL: 'gpt-5.6-sol' });
    expect(saved.calls).toEqual([['run', 'scripts/resolve-codex-generation-model.ts', '--explicit', 'gpt-5.6-sol']]);
    const failed = run({ INSTALL_FACTORY: '1', INSTALL_CURSOR: '1', FAIL_BUN: 'gen:skill-docs' });
    expect(failed.status).toBe(17);
    expect(failed.calls).toEqual([['run', 'gen:skill-docs', '--host', 'factory']]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('setup Codex model activation', () => {
  test('exposes --model for Claude and Codex generation', () => {
    expect(setup).toContain('--model <id>');
    expect(setup).toContain('MODEL_OVERRIDE_SET=1');
    expect(setup).toContain('--model is supported only for Claude or Codex skill generation');
    // The override reaches the resolver as QUOTED argv — an unquoted
    // regression would word-split/glob user input.
    expect(setup).toContain('--explicit "$MODEL_OVERRIDE"');
  });

  test('resolves the profile once, fails closed, and passes it as quoted argv', () => {
    expect(setup).toContain('scripts/resolve-codex-generation-model.ts');
    expect(setup).toContain('CODEX_GENERATION_MODEL="gpt-6-astra"');
    expect(setup).toContain('Codex skill profile: $CODEX_GENERATION_MODEL');
    expect(setup).toContain('Source: $CODEX_GENERATION_MODEL_SOURCE');
    expect(setup).toContain('gen:skill-docs --host codex --model "$CODEX_GENERATION_MODEL"');
    // Positive pin of the parse mechanism (an eval-shaped regression would
    // remove this line rather than merely rephrase an eval call).
    expect(setup).toContain(`IFS=$'\\t' read -r CODEX_GENERATION_MODEL CODEX_GENERATION_MODEL_SOURCE`);
    // Fail-closed: empty resolver output aborts setup, including the exit.
    const guardAt = setup.indexOf('gstack setup failed: Codex model resolver returned no model');
    expect(guardAt).toBeGreaterThan(-1);
    expect(setup.slice(guardAt, guardAt + 200)).toContain('exit 1');
  });

  test('fallback generation and handoff preserve the selected profile', () => {
    const linkStart = setup.indexOf('link_codex_skill_dirs()');
    const linkEnd = setup.indexOf('create_agents_sidecar()', linkStart);
    const block = setup.slice(linkStart, linkEnd);
    expect(block).toContain('gen:skill-docs --host codex --model "$CODEX_GENERATION_MODEL"');
    expect(block).toContain('gen:skill-docs --host codex --model $CODEX_GENERATION_MODEL');
    expect(setup).toContain('model changes: rerun ./setup --host codex');
    expect(setup).toContain('model profile: $CODEX_GENERATION_MODEL');
  });

  test('Kiro uses its own host render without rewriting the Codex profile', () => {
    const kiroStart = setup.indexOf('# 6. Install for Kiro CLI');
    const kiroEnd = setup.indexOf('# 6b.', kiroStart);
    expect(kiroStart).toBeGreaterThan(-1);
    const block = setup.slice(kiroStart, kiroEnd);
    expect(block).toContain('gen:skill-docs --host kiro');
    expect(block).toContain('KIRO_DIR="$SOURCE_GSTACK_DIR/.kiro/skills"');
    expect(block).not.toContain('gen:skill-docs --host codex');
    expect(block).not.toContain('CODEX_GENERATION_MODEL');
  });

  test('Kiro installs its native root, upgrade skill, and bin/lib runtime assets', () => {
    const kiroStart = setup.indexOf('# 6. Install for Kiro CLI');
    const kiroEnd = setup.indexOf('# 6b.', kiroStart);
    const block = setup.slice(kiroStart, kiroEnd);
    expect(block).toContain('_link_or_copy "$KIRO_DIR/gstack-upgrade/SKILL.md"');
    expect(block).toContain('_link_or_copy "$KIRO_DIR/gstack/SKILL.md"');
    expect(block).toContain('_link_or_copy "$SOURCE_GSTACK_DIR/bin" "$KIRO_GSTACK/bin"');
    expect(block).toContain('_link_or_copy "$SOURCE_GSTACK_DIR/lib" "$KIRO_GSTACK/lib"');
    expect(block).not.toContain('$AGENTS_DIR');
  });

  test('Codex skills path honors CODEX_HOME', () => {
    expect(setup).toContain('CODEX_SKILLS="${CODEX_HOME:-$HOME/.codex}/skills"');
  });

  test('--model prints the one-shot persistence note', () => {
    expect(setup).toContain('--model applies to this run only');
  });
});

describe('Codex E2E hermetic model pin', () => {
  const runner = fs.readFileSync(path.join(ROOT, 'test', 'helpers', 'codex-session-runner.ts'), 'utf8');

  test('copies authentication only and can ignore operator config', () => {
    expect(runner).toContain("for (const entry of ['auth.json'])");
    expect(runner).toContain("if (ignoreUserConfig) args.push('--ignore-user-config')");
    expect(runner).toContain('CODEX_HOME: tempCodexDir');
    expect(runner).not.toContain("if (entry === 'skills') continue");
  });
});

describe('Sol E2E tree hygiene', () => {
  const solTest = fs.readFileSync(path.join(ROOT, 'test', 'codex-e2e-sol-scope.test.ts'), 'utf8');

  test('renders Sol in its own output tree without changing the installed profile', () => {
    // The shared fixture owns generation and cleanup; sol-skill-fixture.test.ts
    // proves its complete artifact bytes and unchanged installed-cache metadata.
    const fixture = fs.readFileSync(path.join(ROOT, 'test/helpers/sol-skill-fixture.ts'), 'utf8');
    expect(solTest).toContain('generatedFixture = await createSolSkillFixture()');
    expect(solTest).toContain('skillDir = generatedFixture.skillDir');
    expect(fixture).toContain("host: 'codex', model: 'gpt-5.6-sol', outputRoot, contentLinkRoot: null");
    expect(fixture).toContain("path.join(outputRoot, '.agents', 'skills', 'gstack-investigate')");
    expect(solTest).not.toContain('priorAgentsBackup');
    expect(solTest).not.toContain("path.join(ROOT, '.agents')");
    // Scope-widening detection must see untracked + staged files, not just
    // unstaged tracked modifications.
    expect(solTest).toContain("['status', '--porcelain']");
    expect(solTest).not.toContain("['diff', '--name-only']");
    // The fixture seed commit must survive global commit.gpgsign=true.
    expect(solTest).toContain("['config', 'commit.gpgsign', 'false']");
  });
});
