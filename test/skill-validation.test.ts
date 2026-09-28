import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { validateSkill } from './helpers/skill-parser';
import { discoverTemplates } from '../scripts/discover-skills';

const ROOT = path.resolve(import.meta.dir, '..');

test('registered skills use generated docs without bundled-browser commands', () => {
  const templates = discoverTemplates(ROOT);
  expect(templates.length).toBeGreaterThan(10);
  for (const template of templates) {
    const output = path.join(ROOT, template.output);
    expect(fs.existsSync(output)).toBe(true);
    expect(validateSkill(output).invalid).toEqual([]);
  }
});
