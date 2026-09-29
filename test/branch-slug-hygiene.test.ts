/**
 * Branch-name slug hygiene in file-path positions (#2550, #1851/#1127).
 *
 * gstack-review-log WRITES `<canonical-branch>-reviews.jsonl` where the
 * canonical form comes from bin/gstack-slug (tr '/' '-' then
 * tr -cd 'a-zA-Z0-9._-'). Context Recovery used to PROBE the same file with
 * raw $_BRANCH (`git branch --show-current`) — so for any branch containing
 * a `/` (most feature branches) the REVIEWS line never fired. Same class:
 * review.ts's plan content-search sanitized with tr '/' '-' only, missing
 * the tr -cd half of the canonical pipeline.
 *
 * Discipline pinned here:
 *   - FILE-PATH positions interpolate the slug-canonical $BRANCH (set by the
 *     gstack-slug eval that opens Context Recovery).
 *   - Raw $_BRANCH stays for display (BRANCH: echo) and for timeline.jsonl
 *     content greps — the timeline writer stores the RAW branch, so slugging
 *     the reader would break that pairing.
 *
 * Reader-side fix folded from community PR #1851 by @harjothkhara.
 */
import { describe, test, expect } from 'bun:test';
import { execFileSync, execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ALL_HOST_CONFIGS } from '../hosts';
import { discoverSkillFiles } from '../scripts/discover-skills';

const ROOT = path.join(import.meta.dir, '..');

// Raw $_BRANCH (either spelling) immediately before/after a path separator.
const PATH_ADJACENT = /\/\$\{?_BRANCH|\$\{_BRANCH\}\/|\$_BRANCH\//;
// Raw $_BRANCH as a filename prefix (…-reviews.jsonl and friends).
const FILENAME_PREFIX = /\$\{?_BRANCH\}?[A-Za-z0-9._-]*\.(?:jsonl|json|md|txt|log)/;

function renderedSkillFiles(root = ROOT): string[] {
  // Repository files, including new outputs, exclude ignored workspaces/archives.
  const files = execFileSync('git', [
    'ls-files', '-z', '--cached', '--others', '--exclude-standard', '--',
    'SKILL.md', '**/SKILL.md', '**/sections/*.md',
  ], { cwd: root, encoding: 'utf-8', timeout: 30_000 })
    .split('\0').filter(Boolean).map(file => path.join(root, file));
  // Host outputs are deliberately gitignored; inspect only their registered roots.
  for (const host of ALL_HOST_CONFIGS.filter(host => host.name !== 'claude')) {
    const hostRoot = path.join(root, host.hostSubdir);
    const skillsRoot = path.join(hostRoot, 'skills');
    if (!fs.existsSync(skillsRoot) || fs.lstatSync(hostRoot).isSymbolicLink()
      || fs.lstatSync(skillsRoot).isSymbolicLink()) continue;
    files.push(...discoverSkillFiles(skillsRoot).map(file => path.join(skillsRoot, file)));
  }
  return [...new Set(files)];
}

describe('branch slug hygiene (#2550, #1851)', () => {
  test('inventory covers repository outputs and host caches without ignored candidate trees', () => {
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-skill inventory-'));
    try {
      execFileSync('git', ['init', '-q'], { cwd: repo, timeout: 30_000 });
      const write = (file: string) => {
        fs.mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
        fs.writeFileSync(path.join(repo, file), '# Skill\n');
      };
      const source = ['SKILL.md', 'health/SKILL.md', 'health/sections/checks.md'];
      const hosts = ALL_HOST_CONFIGS.filter(host => host.name !== 'claude');
      fs.writeFileSync(path.join(repo, '.gitignore'),
        ['.context/', 'node_modules/', ...hosts.map(host => `${host.hostSubdir}/`)].join('\n'));
      source.forEach(write);
      execFileSync('git', ['add', '--', ...source], { cwd: repo, timeout: 30_000 });
      source.push('new skill/SKILL.md');
      write(source.at(-1)!); // New, untracked output must still be checked.
      write('.context/candidate/SKILL.md');
      write('.context/candidate/health/sections/checks.md');
      write('node_modules/other/SKILL.md');
      expect(renderedSkillFiles(repo).sort())
        .toEqual(source.map(file => path.join(repo, file)).sort());
      const caches = hosts.map(host => `${host.hostSubdir}/skills/gstack-health/SKILL.md`);
      caches.forEach(write);
      expect(renderedSkillFiles(repo).sort())
        .toEqual([...source, ...caches].map(file => path.join(repo, file)).sort());
      // Old find never followed host or skills directory symlinks into another tree.
      write('.context/outside/skills/gstack-foreign/SKILL.md');
      for (const [index, host] of hosts.slice(0, 2).entries()) {
        const link = path.join(repo, host.hostSubdir, index ? 'skills' : '');
        fs.rmSync(link, { recursive: true, force: true });
        fs.symlinkSync(path.join(repo, '.context/outside', index ? 'skills' : ''), link, 'junction');
      }
      expect(renderedSkillFiles(repo).sort())
        .toEqual([...source, ...caches.slice(2)].map(file => path.join(repo, file)).sort());
    } finally {
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });

  test('no generated SKILL.md or section interpolates raw $_BRANCH in a path position', () => {
    const offenders: string[] = [];
    for (const file of renderedSkillFiles()) {
      const content = fs.readFileSync(file, 'utf-8');
      if (PATH_ADJACENT.test(content) || FILENAME_PREFIX.test(content)) {
        offenders.push(path.relative(ROOT, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  test('review logging stores branch slugs without creating raw branch directories', () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-review-home-'));
    const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-review-repo-'));
    try {
      const env = { ...process.env, GSTACK_HOME: home };
      execFileSync('git', ['init', '-q', '-b', 'feat/slug-hygiene'], { cwd: repo, timeout: 30_000 });
      execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.test', '-c', 'commit.gpgsign=false', 'commit', '--allow-empty', '-qm', 'seed'], { cwd: repo, timeout: 30_000 });
      execFileSync(path.join(ROOT, 'bin/gstack-review-log'), ['{"skill":"ship","status":"ok"}'], { cwd: repo, env, timeout: 30_000 });
      const vars = execFileSync(path.join(ROOT, 'bin/gstack-slug'), [], { cwd: repo, env, encoding: 'utf8', timeout: 30_000 });
      const slug = vars.match(/^SLUG=(.*)$/m)![1];
      const branch = vars.match(/^BRANCH=(.*)$/m)![1];
      expect(branch).toBe('feat-slug-hygiene');
      const project = path.join(home, 'projects', slug);
      expect(fs.readFileSync(path.join(project, `${branch}-reviews.jsonl`), 'utf8')).toContain('"skill":"ship"');
      expect(fs.existsSync(path.join(project, 'feat/slug-hygiene-reviews.jsonl'))).toBe(false);
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
      fs.rmSync(repo, { recursive: true, force: true });
    }
  });
});
