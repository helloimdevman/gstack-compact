import { test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
const hookSrc = fs.readFileSync(path.resolve(import.meta.dir, '../hosts/claude/hooks/question-preference-hook.ts'), 'utf8');

test('dependency repair routes to one candidate without approving a package or a broken set', () => {
    const source = fs.readFileSync(path.resolve(import.meta.dir, '../docs/askuserquestion-split.md'), 'utf8');
    const repair = source.split('**Step 1 — validate dependencies and capacity.**')[1]?.split('**Step 2')[0] ?? '';
    const text = repair.replace(/\s+/g, ' ');
    expect(text).toContain('actual prior answers');
    expect(text).toContain('This routing answer changes no disposition');
    expect(text).toContain('For the named candidate, fire one `D<N>.revise-<k>` with the standard **Include / Defer / Cut / Hold** menu');
    expect(text).toContain("Hold all other candidates' prior answers fixed");
    expect(text).toContain('Revalidate dependencies and capacity after the answer');
    expect(text).toContain('never silently cut, swap or include another candidate');
    expect(text).toContain('A Hold stops the chain');
    expect(text).toContain('report the unresolved blocking conflict');
    expect(text).toContain('Do not confirm an incoherent set as ready to implement');
    expect(text).not.toContain('accept the broken state');
  });

test('the hook actually emits the [plan-tune auto-decide] prefix', () => {
    expect(hookSrc).toContain('[plan-tune auto-decide]');
  });
