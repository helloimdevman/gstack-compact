import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(import.meta.dir, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

/** The canonical marker prefix both halves must agree on. */
const MARKER = 'gstack-shortcut(';

describe('harvester: /retro Step 11.5 debt ledger', () => {
  const tmpl = read('retro/sections/instructions.md.tmpl');
  const rendered = read('retro/sections/instructions.md');

  test('the carved instructions section ships the ledger step, and the card routes to it', () => {
    const card = read('retro/SKILL.md');
    expect(card).toContain('sections/instructions.md');
    expect(card).toContain('## Shared contract');
    for (const body of [tmpl, rendered]) {
      expect(body).toContain('### Step 11.5: Shortcut Debt Ledger');
      expect(body).toContain(`grep -rn "${MARKER}"`);
      // Zero markers is the healthy case — the step must say so, not fail.
      expect(body).toContain('No shortcut debt. Clean ledger.');
      expect(body).toContain('N markers, M with no trigger.');
    }
  });

  test('the harvest grep excludes convention docs; ledger rows join decisions and name the rot taxonomy', () => {
    const step = tmpl.split('### Step 11.5')[1]?.split('### Step 12')[0] ?? '';
    for (const excl of [
      '--exclude-dir=.git',
      '--exclude-dir=node_modules',
      '--exclude-dir=vendor',
      '--exclude-dir=.claude',
      '--exclude-dir=dist',
      '--exclude="SKILL.md"',
      '--exclude="*.md.tmpl"',
    ]) {
      expect(step).toContain(excl);
    }
    // Zero matches must not fail the pipeline the step runs in.
    expect(step).toContain('|| true');
    // Rows join the decision store and tag the two ways a marker rots.
    expect(step).toContain('gstack-decision-search');
    expect(step).toContain('`unlinked`');
    expect(step).toContain('`no-trigger`');
    expect(step).toContain('never double-count');
  });
});

describe('legacy shortcut marker compatibility', () => {
  test('review checklist suppression and simplification specialist both honor the marker (acknowledged debt is not a finding)', () => {
    expect(read('review/checklist.md')).toContain('gstack-shortcut(dec-*)');
    expect(read('review/specialists/simplification.md')).toContain('gstack-shortcut(dec-*)');
  });
});
