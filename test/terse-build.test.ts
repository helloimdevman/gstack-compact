import { test, expect } from 'bun:test';
import { ALL_HOST_CONFIGS } from '../hosts';
import { HOST_PATHS, type TemplateContext } from '../scripts/resolvers/types';
import { RESOLVERS } from '../scripts/resolvers';

// The installed preamble already omits the retired essays for every profile.
// Keep the accepted explain-level option without resurrecting their producer.
test('default and terse share the same installed bootstrap across hosts and tiers', () => {
  for (const host of ALL_HOST_CONFIGS) for (const preambleTier of [1, 2, 3, 4]) {
    const ctx: TemplateContext = { skillName: 'build', tmplPath: 'build/SKILL.md.tmpl',
      host: host.name, paths: HOST_PATHS[host.name]!, preambleTier };
    const out = RESOLVERS.PREAMBLE(ctx);
    expect(RESOLVERS.PREAMBLE({ ...ctx, explainLevel: 'terse' })).toBe(out);
    expect(RESOLVERS.PREAMBLE({ ...ctx, explainLevel: 'default' })).toBe(out);
    for (const heading of ['Writing Style', 'Completeness Principle', 'Confusion Protocol', 'Context Health']) {
      expect(out).not.toContain(`## ${heading}`);
    }
    expect(out).toContain('GSTACK_CONTRACT');
  }
});
