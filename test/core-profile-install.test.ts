import { test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { installCoreProfile } from '../scripts/install-core-profile';

const sourceRoot = path.resolve(import.meta.dir, '..');

for (const host of ['claude', 'codex'] as const) {
  test(`${host} core install registers 10 and preserves a foreign collision`, async () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-core-install-'));
    const skillsDir = path.join(temp, 'host skills');
    const stateRoot = path.join(temp, 'state', `${host}-core`);
    const plan = host === 'claude' ? 'plan' : 'gstack-plan';
    try {
      const opts = { host, sourceRoot, skillsDir, stateRoot, model: host === 'claude' ? 'claude' as const : 'gpt' as const };
      const installed = await installCoreProfile(opts);
      expect(installed).toHaveLength(10);
      expect(fs.readdirSync(skillsDir).filter(name => fs.existsSync(path.join(skillsDir, name, 'SKILL.md')))).toHaveLength(10);
      expect(fs.existsSync(path.join(skillsDir, plan, 'sections'))).toBe(true);
      expect(fs.existsSync(path.join(skillsDir, 'gstack', 'CONTRACT.md'))).toBe(true);
      expect(fs.existsSync(path.join(skillsDir, 'gstack', 'plan', 'SKILL.md'))).toBe(false);
      const record = JSON.parse(fs.readFileSync(path.join(skillsDir, 'gstack', '.gstack-install.json'), 'utf8'));
      expect(record.skillProfile).toBe('core');
      const foreign = path.join(skillsDir, host === 'claude' ? 'review' : 'gstack-review');
      fs.rmSync(foreign, { recursive: true });
      fs.mkdirSync(foreign);
      fs.writeFileSync(path.join(foreign, 'SKILL.md'), 'user skill\n');
      await expect(installCoreProfile(opts)).rejects.toThrow('foreign skill collision');
      expect(fs.readFileSync(path.join(foreign, 'SKILL.md'), 'utf8')).toBe('user skill\n');
      expect(fs.existsSync(path.join(skillsDir, plan, 'SKILL.md'))).toBe(true);
    } finally {
      fs.rmSync(temp, { recursive: true, force: true });
    }
  });
}

test('explicit compat to core to compat keeps the selected catalog isolated', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-profile-switch-'));
  const skillsDir = path.join(temp, 'skills');
  const common = { host: 'claude' as const, sourceRoot, skillsDir, model: 'claude' as const };
  try {
    const compat = await installCoreProfile({ ...common, profile: 'compat', stateRoot: path.join(temp, 'state', 'compat') });
    expect(compat.length).toBeGreaterThan(10);
    expect(fs.existsSync(path.join(skillsDir, 'cso', 'SKILL.md'))).toBe(true);
    const core = await installCoreProfile({ ...common, profile: 'core', stateRoot: path.join(temp, 'state', 'core') });
    expect(core).toHaveLength(10);
    expect(fs.existsSync(path.join(skillsDir, 'cso'))).toBe(false);
    expect(fs.existsSync(path.join(skillsDir, 'plan', 'SKILL.md'))).toBe(true);
    const restored = await installCoreProfile({ ...common, profile: 'compat', stateRoot: path.join(temp, 'state', 'compat') });
    expect(restored.length).toBeGreaterThan(10);
    expect(fs.existsSync(path.join(skillsDir, 'cso', 'SKILL.md'))).toBe(true);
    expect(JSON.parse(fs.readFileSync(path.join(skillsDir, 'gstack', '.gstack-install.json'), 'utf8')).skillProfile).toBe('compat');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('a concurrent install lock rejects before touching registrations', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-profile-lock-'));
  const skillsDir = path.join(temp, 'skills');
  fs.mkdirSync(path.join(skillsDir, '.gstack-install.lock'), { recursive: true });
  try {
    await expect(installCoreProfile({ host: 'claude', sourceRoot, skillsDir, stateRoot: path.join(temp, 'state'), model: 'claude' })).rejects.toThrow('another skill install');
    expect(fs.readdirSync(skillsDir)).toEqual(['.gstack-install.lock']);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('a user-added file inside an owned entry blocks replacement and survives', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-profile-mixed-'));
  const skillsDir = path.join(temp, 'skills');
  const opts = { host: 'claude' as const, sourceRoot, skillsDir, stateRoot: path.join(temp, 'state'), model: 'claude' as const };
  try {
    await installCoreProfile(opts);
    const note = path.join(skillsDir, 'plan', 'my-notes.md');
    fs.writeFileSync(note, 'user content\n');
    await expect(installCoreProfile(opts)).rejects.toThrow('foreign skill collision');
    expect(fs.readFileSync(note, 'utf8')).toBe('user content\n');
    expect(fs.existsSync(path.join(skillsDir, 'plan', 'SKILL.md'))).toBe(true);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('Claude core prefix changes both the sibling directory and frontmatter name', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-profile-prefix-'));
  try {
    const skillsDir = path.join(temp, 'skills');
    await installCoreProfile({ host: 'claude', sourceRoot, skillsDir, stateRoot: path.join(temp, 'state'), model: 'claude', prefix: true });
    const entry = fs.readFileSync(path.join(skillsDir, 'gstack-plan', 'SKILL.md'), 'utf8');
    expect(entry).toMatch(/^name: gstack-plan$/m);
    expect(fs.existsSync(path.join(skillsDir, 'plan'))).toBe(false);
    expect(fs.readdirSync(skillsDir).filter(name => fs.existsSync(path.join(skillsDir, name, 'SKILL.md')))).toHaveLength(10);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('a pre-manifest core install can refresh, but a mixed legacy directory cannot', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-profile-legacy-'));
  const skillsDir = path.join(temp, 'skills');
  const opts = { host: 'claude' as const, sourceRoot, skillsDir, stateRoot: path.join(temp, 'state'), model: 'claude' as const };
  try {
    await installCoreProfile(opts);
    for (const name of fs.readdirSync(skillsDir)) {
      const manifest = path.join(skillsDir, name, '.gstack-manifest.json');
      if (fs.existsSync(manifest)) fs.unlinkSync(manifest);
    }
    expect(await installCoreProfile(opts)).toHaveLength(10);
    const note = path.join(skillsDir, 'gstack', 'my-notes.md');
    fs.unlinkSync(path.join(skillsDir, 'gstack', '.gstack-manifest.json'));
    fs.writeFileSync(note, 'user content\n');
    await expect(installCoreProfile(opts)).rejects.toThrow('foreign skill collision');
    expect(fs.readFileSync(note, 'utf8')).toBe('user content\n');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
