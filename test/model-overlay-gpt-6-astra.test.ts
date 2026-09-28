import { describe, expect, test } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import { resolveModel } from '../scripts/models';
import { generateModelOverlay } from '../scripts/resolvers/model-overlay';
import type { TemplateContext } from '../scripts/resolvers/types';

function ctx(model: TemplateContext['model']): TemplateContext {
  return {
    skillName: 'investigate',
    tmplPath: 'investigate/SKILL.md.tmpl',
    host: 'codex',
    paths: {
      skillRoot: '$GSTACK_ROOT',
      localSkillRoot: '.agents/skills/gstack',
      binDir: '$GSTACK_BIN',
      browseDir: '$GSTACK_BROWSE',
      designDir: '$GSTACK_DESIGN',
    },
    preambleTier: 3,
    model,
  };
}

describe('GPT-6 Astra model profile', () => {
  test('exact and suffixed Astra IDs select the Astra profile', () => {
    expect(resolveModel('gpt-6-astra')).toBe('gpt-6-astra');
    expect(resolveModel('gpt-6-astra-2026-09-01')).toBe('gpt-6-astra');
  });

  test('unproven Astra-specific advice does not become an installed patch', () => {
    const raw = fs.readFileSync(path.resolve(import.meta.dir, '..', 'model-overlays/gpt-6-astra.md'), 'utf-8');
    expect(raw).not.toContain('{{INHERIT:');
    const out = generateModelOverlay(ctx('gpt-6-astra'));
    expect(raw.trim()).toBe('');
    expect(out).toBe('');
  });
});
