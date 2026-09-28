/**
 * Section manifest ↔ filesystem consistency (v2 plan T9 / Phase C orphan check).
 *
 * Implements the 3-tier orphan classification from v2_PLAN.md:
 *  - generated orphan  (sections/X.md with no sections/X.md.tmpl)  → FAIL
 *  - hand-edited generated file (X.md missing the AUTO-GENERATED header) → FAIL
 *  - manifest orphan   (sections/X.md.tmpl not listed in manifest)  → FAIL
 *
 * Also pins the PASSIVE-manifest contract (CM2 / v2_PLAN.md:663): manifest entries
 * carry only id/file/title/trigger — no machine predicate (applies_when/required_for).
 *
 * Generalized for every carved skill (v2 plan Phase B). Carved skills are
 * discovered dynamically (any top-level dir with sections/manifest.json), so a new
 * carve is covered the moment its manifest lands — no edit here. Per Codex
 * outside-voice P2, each skill's manifest + dir listing is read INSIDE its own
 * describe case (not at module top), so a carve-in-progress (manifest added before
 * the .md is generated) fails only that skill's generated-.md assertion instead of
 * crashing the whole module, and the suite never silently stays ship-only.
 */

import { describe, test, expect } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import * as sectionResolver from '../scripts/resolvers/sections';

const ROOT = path.resolve(import.meta.dir, '..');

/** Every top-level skill dir that owns a sections/manifest.json. */
function discoverCarvedSkills(): string[] {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => fs.existsSync(path.join(ROOT, name, 'sections', 'manifest.json')))
    .sort();
}

const CARVED_SKILLS = discoverCarvedSkills();

describe('section manifest ↔ filesystem consistency', () => {
  test('rejects duplicate, missing, escaping, and unreachable sections', () => {
    const validate = (sectionResolver as any).validateSectionManifest;
    expect(typeof validate).toBe('function');
    const bad = {
      skill: 'sample',
      sections: [
        { id: 'one', file: 'one.md', title: 'One', trigger: 'when one' },
        { id: 'one', file: '../escape.md', title: 'Escape', trigger: 'when two' },
        { id: 'orphan', file: 'missing.md', title: 'Missing', trigger: 'when three' },
        { id: 'bad-title', file: 'one.md', title: 42, trigger: 'when four' },
      ],
    };
    const errors: string[] = validate(bad, 'sample', '{{SECTION:one}}', new Set(['one.md']));
    expect(errors.join(' ')).toContain('duplicate id');
    expect(errors.join(' ')).toContain('invalid file');
    expect(errors.join(' ')).toContain('missing file');
    expect(errors.join(' ')).toContain('unreachable');
    expect(errors.join(' ')).toContain('missing title or trigger');
  });
  test('the known carved skills are discovered', () => {
    // Tripwire: if a carve regresses (manifest deleted) this catches it.
    expect(CARVED_SKILLS).toContain('ship');
    expect(CARVED_SKILLS).toContain('plan');
  });

  for (const skill of CARVED_SKILLS) {
    describe(skill, () => {
      // Codex P2: computed per-skill-case, not at module load.
      const sectionsDir = path.join(ROOT, skill, 'sections');
      const manifest = JSON.parse(fs.readFileSync(path.join(sectionsDir, 'manifest.json'), 'utf-8'));
      const sectionTmpls = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.md.tmpl'));
      const sectionMds = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.md') && !f.endsWith('.md.tmpl'));

      test('manifest parses with skill + sections array', () => {
        expect(manifest.skill).toBe(skill);
        expect(Array.isArray(manifest.sections)).toBe(true);
        expect(manifest.sections.length).toBeGreaterThan(0);
      });

      test('every manifest entry has a .md.tmpl source AND a generated .md', () => {
        for (const s of manifest.sections) {
          expect(fs.existsSync(path.join(sectionsDir, `${s.file}.tmpl`))).toBe(true);
          expect(fs.existsSync(path.join(sectionsDir, s.file))).toBe(true);
        }
      });

      test('manifest is PASSIVE — no applies_when / required_for predicate (CM2)', () => {
        for (const s of manifest.sections) {
          expect(s).not.toHaveProperty('applies_when');
          expect(s).not.toHaveProperty('required_for');
          // The allowed passive shape:
          expect(typeof s.id).toBe('string');
          expect(typeof s.file).toBe('string');
          expect(typeof s.title).toBe('string');
          expect(typeof s.trigger).toBe('string');
        }
      });

      test('no generated orphan: every sections/X.md has a sections/X.md.tmpl → FAIL', () => {
        const orphans = sectionMds.filter(md => !sectionTmpls.includes(`${md}.tmpl`));
        expect(orphans).toEqual([]);
      });

      test('no hand-edited generated file: every sections/X.md has the AUTO-GENERATED header → FAIL', () => {
        for (const md of sectionMds) {
          const head = fs.readFileSync(path.join(sectionsDir, md), 'utf-8').slice(0, 120);
          expect(head).toContain('AUTO-GENERATED');
        }
      });

      test('every .md.tmpl is listed in the manifest', () => {
        const listed = new Set(manifest.sections.map((s: { file: string }) => `${s.file}.tmpl`));
        const unlisted = sectionTmpls.filter(t => !listed.has(t));
        expect(unlisted).toEqual([]);
      });

      test('section ids are unique', () => {
        const ids = manifest.sections.map((s: { id: string }) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  }
});
