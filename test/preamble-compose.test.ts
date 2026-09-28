import { test, expect } from 'bun:test';
import { ALL_HOST_CONFIGS } from '../hosts';
import { HOST_PATHS, type TemplateContext } from '../scripts/resolvers/types';
import { generateInstalledPreamble } from '../scripts/resolvers/preamble';
import { RESOLVERS } from '../scripts/resolvers';

for (const host of ALL_HOST_CONFIGS) {
  test(`${host.name}: registered preamble uses the installed bootstrap and shared contract`, () => {
    const ctx: TemplateContext = { skillName: 'review', tmplPath: 'review/SKILL.md.tmpl',
      host: host.name, paths: HOST_PATHS[host.name]!, preambleTier: 2, model: 'claude' };
    const out = RESOLVERS.PREAMBLE(ctx);
    expect(RESOLVERS.PREAMBLE).toBe(generateInstalledPreamble);
    expect(out).toContain('gstack-skill-start');
    expect(out).toContain('Read the printed `GSTACK_CONTRACT`');
    expect(out.indexOf('## Shared contract')).toBeLessThan(out.indexOf('## Model-Specific Behavioral Patch'));
    expect(out).toContain('blocks protected /review steps');
    expect(out).toContain('do NOT assume Conductor');
    expect(out).not.toContain('## AskUserQuestion Format');
    expect(out).not.toContain('## Context Recovery');
    for (const preambleTier of [undefined, 0, 5]) {
      expect(() => RESOLVERS.PREAMBLE({ ...ctx, preambleTier })).toThrow();
    }
  });
}

test('skill-start script emits CONDUCTOR_SESSION, gated on != headless (Issue 8)', () => {
    const fs = require('fs');
    const path = require('path');
    const script = fs.readFileSync(path.join(import.meta.dir, '..', 'bin', 'gstack-skill-start'), 'utf-8');
    expect(script).toContain('echo "CONDUCTOR_SESSION: true"');
    expect(script).toMatch(/"\$_SESSION_KIND" != "headless"[\s\S]*CONDUCTOR_WORKSPACE_PATH[\s\S]*CONDUCTOR_PORT[\s\S]*CONDUCTOR_SESSION: true/);
    // #2733: spawned outranks Conductor — a spawned session inside a Conductor
    // workspace auto-chooses instead of rendering prose to nobody.
    expect(script).toMatch(/"\$_SESSION_KIND" != "headless"[\s\S]{0,80}"\$_SESSION_KIND" != "spawned"[\s\S]{0,200}CONDUCTOR_SESSION: true/);
  });
