import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
const SKILL_START_SCRIPT = readFileSync(new URL('../bin/gstack-skill-start', import.meta.url), 'utf8');

test('migration prompt lives in gstack-skill-start (marker-gated emit)', () => {
    // Token-reduction Phase 2: the one-time V0→V1 migration prompt left the
    // rendered preamble; bin/gstack-skill-start computes the gate from the
    // marker files and emits it as a GSTACK_INSTRUCTION block, with the ack
    // (clear pending + set prompted) carried INSIDE the block for the model
    // to run after the interaction. The prompt text itself is pinned by
    // test/onboarding-moved-literals.test.ts (tombstone).
    expect(SKILL_START_SCRIPT).toContain(
      'if [ -f "$_GH/.writing-style-prompt-pending" ] && [ ! -f "$_GH/.writing-style-prompted" ]',
    );
    expect(SKILL_START_SCRIPT).toContain('_emit_block writing-style-migration');
    expect(SKILL_START_SCRIPT).toContain(
      'rm -f "$_GH/.writing-style-prompt-pending" && touch "$_GH/.writing-style-prompted"',
    );
  });
