import { test, expect } from 'bun:test';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveModel } from '../scripts/models';
import { runGeneration } from '../scripts/gen-skill-docs';

test('unproven Opus 5.5 advice is empty and unknown models use common instructions', () => {
  expect(resolveModel('opus-5.5')).toBe('opus-5.5');
  expect(resolveModel('claude-opus-5.5-2026-09-01')).toBe('opus-5.5');
  expect(resolveModel('unknown-frontier-model')).toBeNull();
  expect(readFileSync(join(import.meta.dir, '../model-overlays/opus-5.5.md'), 'utf8').trim()).toBe('');
});

test('installed canonical entries receive a proven patch once; alias does not duplicate it', async () => {
  const outputRoot = mkdtempSync(join(tmpdir(), 'gstack-model-core-'));
  try {
    const result = await runGeneration({ host: 'codex', model: 'gpt-5.6-sol', outputRoot, contentLinkRoot: outputRoot });
    expect(result.exitCode, JSON.stringify(result.diagnostics)).toBe(0);
    for (const skill of ['plan', 'review', 'verify', 'ship', 'investigate']) {
      const entry = readFileSync(join(outputRoot, `.agents/skills/gstack-${skill}/SKILL.md`), 'utf8');
      expect(entry.match(/Model-Specific Behavioral Patch/g)?.length).toBe(1);
    }
    const alias = readFileSync(join(outputRoot, '.agents/skills/gstack-autoplan/SKILL.md'), 'utf8');
    expect(alias).not.toContain('Model-Specific Behavioral Patch');
  } finally {
    rmSync(outputRoot, { recursive: true, force: true });
  }
});

test('setup passes an explicit Claude model to the Claude generator', () => {
  const setup = readFileSync(join(import.meta.dir, '../setup'), 'utf8');
  expect(setup).toContain('--host claude --model opus-5.5');
  expect(setup).toContain('gen:skill-docs --host claude --model "$CLAUDE_GENERATION_MODEL"');
  expect(setup).toContain('INSTALL_CODEX" -eq 0 ] && [ "$INSTALL_CLAUDE" -eq 0');
});
