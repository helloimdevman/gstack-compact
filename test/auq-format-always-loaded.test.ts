/**
 * AskUserQuestion format is no longer copied into every skill.
 *
 * Frontier skills point at CONTRACT.md. The long decision-brief essay
 * (ELI10, completeness scores, one-question pacing) stays out of SKILL.md.
 */
import { describe, test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dir, '..');

function productSkills(): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'test' || entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'SKILL.md') found.push(full);
    }
  };
  walk(ROOT);
  return found;
}

describe('AUQ essay is not copied into product skills', () => {
  test('skills with a bootstrap preamble point at the shared contract', () => {
    const skills = productSkills();
    expect(skills.length).toBeGreaterThan(40);
    const bootstrapped = skills.filter(file => fs.existsSync(`${file}.tmpl`) &&
      fs.readFileSync(`${file}.tmpl`, 'utf-8').includes('{{PREAMBLE}}'));
    expect(bootstrapped.length).toBeGreaterThan(10);
    const missing = bootstrapped.filter(file => !fs.readFileSync(file, 'utf-8').includes('## Shared contract'));
    expect(missing).toEqual([]);
  });

  test('no product skill inlines the AskUserQuestion format or one-question pacing', () => {
    for (const file of productSkills()) {
      const body = fs.readFileSync(file, 'utf-8');
      expect(body, file).not.toContain('## AskUserQuestion Format');
      expect(body.toLowerCase(), file).not.toContain('one question per turn');
      expect(body, file).not.toContain('Completeness Principle — Boil the Ocean');
    }
  });

  test('the shared contract is the only copy of the stop rule', () => {
    const contract = fs.readFileSync(path.join(ROOT, 'CONTRACT.md'), 'utf-8');
    expect(contract).toContain('Combine related questions');
    expect(contract).toContain('Stop when the requested outcome is verified');
  });
});
