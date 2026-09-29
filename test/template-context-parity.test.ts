/**
 * Section TemplateContext parity (v2 plan T9 / Codex consult absorbed-refinement #1).
 *
 * Section generation must use the SAME TemplateContext as the parent skill —
 * crucially the same skillName. CHANGELOG_WORKFLOW uses that name to choose
 * ship's origin/<base> range; a section resolved as "sections" would use
 * the wrong range.
 *
 * We assert on the generated section output and unresolved placeholders.
 */

import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(import.meta.dir, '..');
const SHIP_SECTIONS = path.join(ROOT, 'ship', 'sections');

function readSection(file: string): string {
  return fs.readFileSync(path.join(SHIP_SECTIONS, file), 'utf-8');
}

describe('section TemplateContext parity (skillName pinned to parent)', () => {
  test('no generated section has unresolved {{PLACEHOLDER}} tokens', () => {
    for (const md of fs.readdirSync(SHIP_SECTIONS).filter(f => f.endsWith('.md') && !f.endsWith('.md.tmpl'))) {
      const content = readSection(md);
      const unresolved = content.match(/\{\{[A-Z_]+(?::[^}]+)?\}\}/g);
      expect({ md, unresolved }).toEqual({ md, unresolved: null });
    }
  });

  test('changelog section uses the parent ship context', () => {
    const content = readSection('changelog.md');
    expect(content).toContain('CHANGELOG');
    expect(content).toContain('git log origin/<base>..HEAD --oneline');
    expect(content).toContain('git diff origin/<base>');
    expect(content.length).toBeGreaterThan(300);
  });
});
