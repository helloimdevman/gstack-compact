import { describe, expect, test } from 'bun:test';
import { resolveModel } from '../scripts/models';
import { generateModelOverlay, readOverlay } from '../scripts/resolvers/model-overlay';
import { generateInstalledPreamble } from '../scripts/resolvers/preamble';
import { generateSetupCommand } from '../scripts/resolvers/utility';
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

describe('GPT-5.6 Sol model profile', () => {
  test('only the exact Sol ID selects the Sol profile', () => {
    expect(resolveModel('gpt-5.6-sol')).toBe('gpt-5.6-sol');
    expect(resolveModel('gpt-5.6-terra')).toBe('gpt');
    expect(resolveModel('gpt-5.6-luna')).toBe('gpt');
    expect(resolveModel('gpt-5.6-sol-preview')).toBe('gpt');
    expect(resolveModel('gpt-5.7')).toBe('gpt');
  });

  test('standalone overlay does not inherit generic GPT completion bias', () => {
    const raw = readOverlay('gpt-5.6-sol');
    expect(raw).toContain('The explicit task is the lake');
    expect(raw).toContain('one clean relevant verification pass');
    expect(raw).toContain('report-only');
    expect(raw).not.toContain('{{INHERIT:gpt}}');
    expect(raw).not.toContain('make your best judgment and proceed');
  });

  test('wrapper gives scope interpretation precedence but preserves concrete gates', () => {
    const out = generateModelOverlay(ctx('gpt-5.6-sol'));
    expect(out).toContain('disambiguate scope');
    expect(out).toContain('Concrete skill workflow steps');
    expect(out).toContain('Never use this patch to skip a concrete requirement');
  });

  test('the installed preamble retains Sol scope guidance without the retired completeness essay', () => {
    const out = generateInstalledPreamble(ctx('gpt-5.6-sol'));
    expect(out).toContain('The explicit task is the lake');
    expect(out).toContain('GSTACK_CONTRACT');
    expect(out).not.toContain('## Completeness Principle');
    expect(generateInstalledPreamble({ ...ctx('gpt-5.6-sol'), explainLevel: 'terse' })).toBe(out);
  });

  test('generic GPT overlay remains unchanged', () => {
    expect(generateModelOverlay(ctx('gpt'))).toContain('make your best judgment and proceed');
  });

});

describe('SETUP_COMMAND resolver', () => {
  test('claude keeps bare ./setup; every other host reinstalls itself', () => {
    expect(generateSetupCommand({ ...ctx('claude'), host: 'claude' })).toBe('./setup');
    expect(generateSetupCommand({ ...ctx('gpt'), host: 'codex' })).toBe('./setup --host codex');
    expect(generateSetupCommand({ ...ctx('claude'), host: 'kiro' })).toBe('./setup --host kiro');
    expect(generateSetupCommand({ ...ctx('claude'), host: 'factory' })).toBe('./setup --host factory');
  });
});
