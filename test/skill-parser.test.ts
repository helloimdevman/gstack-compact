import { test, expect } from 'bun:test';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { validateSkill } from './helpers/skill-parser';

test('removed bundled-browser commands are rejected in skill docs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-parser-'));
  try {
    const file = path.join(dir, 'SKILL.md');
    fs.writeFileSync(file, '# Browse\n\n```bash\n$B goto https://example.com\n```\n');
    expect(validateSkill(file).invalid.map(item => item.line)).toEqual([4]);
    fs.writeFileSync(file, '# Browse\n\n```bash\naside repl script.js\n```\n');
    expect(validateSkill(file).invalid).toHaveLength(0);
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});
