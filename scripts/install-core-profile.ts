#!/usr/bin/env bun
/** Install the selected skill catalog into one host's skill directory. */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { runGeneration } from './gen-skill-docs';
import { getHostConfig } from '../hosts';
import { loadRouterMap } from './resolvers/router-map';
import type { InstallSelection, SkillProfile } from './host-config';
import { ALL_MODEL_NAMES, type Model } from './models';
import { namespaceSkill, publicSkillName } from './skill-namespace';

export type CoreInstallOptions = {
  host: 'claude' | 'codex';
  sourceRoot: string;
  skillsDir: string;
  stateRoot: string;
  model: Model;
  profile?: SkillProfile;
  prefix?: boolean;
  respectDetection?: boolean;
};

function exists(file: string): boolean { return fs.existsSync(file) || fs.lstatSync(file, { throwIfNoEntry: false }) !== undefined; }
function inside(file: string, root: string): boolean {
  const rel = path.relative(root, file);
  return rel === '' || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel));
}
function linkOrCopy(src: string, dst: string, stagedSrc = src): void {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (process.platform === 'win32') fs.cpSync(stagedSrc, dst, { recursive: true });
  else fs.symlinkSync(src, dst, fs.statSync(stagedSrc).isDirectory() ? 'dir' : 'file');
}
function snapshot(dir: string): string[] {
  const rows: string[] = [];
  const walk = (folder: string, rel = '') => {
    for (const name of fs.readdirSync(folder).sort()) {
      if (name === '.gstack-manifest.json') continue;
      const next = path.join(folder, name), key = path.join(rel, name), stat = fs.lstatSync(next);
      if (stat.isSymbolicLink()) rows.push(`${key}:link:${fs.readlinkSync(next)}`);
      else if (stat.isDirectory()) { rows.push(`${key}:dir`); walk(next, key); }
      else if (stat.isFile()) rows.push(`${key}:file:${createHash('sha256').update(fs.readFileSync(next)).digest('hex')}`);
      else rows.push(`${key}:other`);
    }
  };
  walk(dir);
  return rows;
}
function writeManifest(dir: string): void {
  fs.writeFileSync(path.join(dir, '.gstack-manifest.json'), JSON.stringify(snapshot(dir)) + '\n', { mode: 0o600 });
}
function owned(entry: string, source: string, state: string): boolean {
  const legacyRender = process.env.GSTACK_USER_RENDER_DIR ?? path.join(process.env.GSTACK_HOME ?? path.join(process.env.HOME ?? '', '.gstack'), 'render', 'claude');
  const stat = fs.lstatSync(entry, { throwIfNoEntry: false });
  if (!stat) return true;
  if (stat.isSymbolicLink()) {
    const target = path.resolve(path.dirname(entry), fs.readlinkSync(entry));
    return inside(target, source) || inside(target, state) || inside(target, legacyRender);
  }
  if (!stat.isDirectory()) return false;
  const manifest = path.join(entry, '.gstack-manifest.json');
  if (fs.existsSync(manifest)) {
    try {
      if (JSON.stringify(snapshot(entry)) !== JSON.stringify(JSON.parse(fs.readFileSync(manifest, 'utf8')))) return false;
    } catch { return false; }
  }
  const marker = path.join(entry, '.gstack-owned');
  if (fs.existsSync(marker)) {
    const recorded = fs.readFileSync(marker, 'utf8').trim();
    if (recorded !== source && recorded !== state) return false;
    if (fs.existsSync(manifest)) return true;
    // Pre-manifest installs may contain structural directories (browse/, review/,
    // agents/) around owned links. Reject any other real user file.
    const skill = path.join(entry, 'SKILL.md');
    if (!fs.existsSync(skill) || !fs.readFileSync(skill, 'utf8').includes('AUTO-GENERATED from')) return false;
    const linksOnly = (folder: string): boolean => fs.readdirSync(folder).every(name => {
      if (folder === entry && ['SKILL.md', '.gstack-owned', '.gstack-install.json'].includes(name)) return true;
      const child = path.join(folder, name);
      const stat = fs.lstatSync(child);
      if (stat.isDirectory()) return linksOnly(child);
      if (!stat.isSymbolicLink()) return false;
      const target = path.resolve(folder, fs.readlinkSync(child));
      return inside(target, source) || inside(target, state) || inside(target, legacyRender);
    });
    return linksOnly(entry);
  }
  const record = path.join(entry, '.gstack-install.json');
  if (fs.existsSync(record)) {
    try { return JSON.parse(fs.readFileSync(record, 'utf8')).sourceRoot === source; } catch { return false; }
  }
  const skill = path.join(entry, 'SKILL.md');
  if (fs.lstatSync(skill, { throwIfNoEntry: false })?.isSymbolicLink()) {
    const target = path.resolve(entry, fs.readlinkSync(skill));
    return inside(target, source) || inside(target, state) || inside(target, legacyRender);
  }
  return false;
}

/** Stage every file, check ownership, then move owned registrations with rollback. */
export async function installCoreProfile(opts: CoreInstallOptions): Promise<string[]> {
  const profile = opts.profile ?? 'core';
  const source = fs.realpathSync(opts.sourceRoot);
  if (!(ALL_MODEL_NAMES as readonly string[]).includes(opts.model)) throw new Error(`unknown generation model: ${opts.model}`);
  const skills = path.resolve(opts.skillsDir);
  const state = path.resolve(opts.stateRoot);
  if (inside(source, skills)) throw new Error('core requires the source checkout outside the host skill search directory');
  if (inside(state, skills)) throw new Error('core render must be outside the host skill search directory');
  const map = loadRouterMap();
  const config = getHostConfig(opts.host);
  fs.mkdirSync(path.dirname(state), { recursive: true });
  fs.mkdirSync(skills, { recursive: true });
  const lock = path.join(skills, '.gstack-install.lock');
  try { fs.mkdirSync(lock); } catch { throw new Error(`another skill install is active: ${skills}`); }
  let stage: string;
  try { stage = fs.mkdtempSync(path.join(path.dirname(state), '.gstack-profile-stage-')); }
  catch (error) { fs.rmdirSync(lock); throw error; }
  const render = path.join(stage, 'render');
  const runtime = path.join(stage, 'runtime');
  const entries = path.join(stage, 'entries');
  const backup = path.join(stage, 'backup');
  const root = path.join(skills, 'gstack');
  const sourceSkills = opts.host === 'claude' ? render : path.join(render, '.agents', 'skills');
  const prefixed = opts.host === 'codex' || opts.prefix === true;
  const entryName = (id: string) => publicSkillName(id, prefixed);
  const selection: InstallSelection = { version: 1, host: opts.host, skillProfile: profile, generationModel: opts.model, sourceRoot: source };
  const placed: string[] = [];
  const moved: Array<[string, string]> = [];
  try {
    fs.mkdirSync(render, { recursive: true });
    const generated = await runGeneration({ host: opts.host, skillProfile: profile, model: opts.model, outputRoot: render, contentLinkRoot: state, respectDetection: opts.respectDetection });
    if (generated.exitCode !== 0) throw new Error(`core render failed: ${generated.diagnostics.map(d => d.message).join('; ')}`);
    fs.mkdirSync(runtime, { recursive: true });
    fs.mkdirSync(entries, { recursive: true });
    const rootSkill = opts.host === 'claude' ? path.join(sourceSkills, 'SKILL.md') : path.join(sourceSkills, 'gstack', 'SKILL.md');
    fs.writeFileSync(path.join(runtime, 'SKILL.md'), namespaceSkill(fs.readFileSync(rootSkill, 'utf8'), prefixed));
    const generatedNames = profile === 'core' ? map.core.filter(id => id !== 'gstack') : fs.readdirSync(sourceSkills, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && entry.name !== 'gstack' && fs.existsSync(path.join(sourceSkills, entry.name, 'SKILL.md')))
      .map(entry => opts.host === 'codex' ? entry.name.replace(/^gstack-/, '') : entry.name);
    for (const id of generatedNames) {
      const from = path.join(sourceSkills, opts.host === 'codex' ? `gstack-${id}` : id);
      const to = path.join(entries, entryName(id));
      if (!fs.existsSync(path.join(from, 'SKILL.md'))) throw new Error(`missing core entry: ${id}`);
      fs.mkdirSync(to);
      let body = fs.readFileSync(path.join(from, 'SKILL.md'), 'utf8');
      for (const row of body.matchAll(/^\|[^\n]*\|\s*`(sections\/[a-z0-9-]+\.md)`\s*\|/gm)) {
        if (!fs.existsSync(path.join(from, row[1]))) throw new Error(`missing section reference: ${id}/${row[1]}`);
      }
      for (const alias of body.matchAll(/Read `\.\.\/([a-z][a-z0-9-]+)\/SKILL\.md` relative to this installed SKILL\.md/g)) {
        const target = path.join(sourceSkills, alias[1], 'SKILL.md');
        if (!fs.existsSync(target)) throw new Error(`missing canonical target: ${id} -> ${alias[1]}`);
      }
      fs.writeFileSync(path.join(to, 'SKILL.md'), namespaceSkill(body, prefixed));
      for (const child of fs.readdirSync(from)) {
        if (child === 'SKILL.md') continue;
        linkOrCopy(path.join(state, opts.host === 'claude' ? id : `.agents/skills/gstack-${id}`, child), path.join(to, child), path.join(from, child));
      }
      fs.writeFileSync(path.join(to, '.gstack-owned'), source + '\n');
      writeManifest(to);
    }
    // The runtime root deliberately contains no nested SKILL.md files.
    const assets = config.runtimeRoot.globalSymlinks.filter(name => name !== 'gstack-upgrade');
    for (const asset of assets) {
      const src = path.join(source, asset);
      if (fs.existsSync(src)) linkOrCopy(src, path.join(runtime, asset));
    }
    for (const [dir, files] of Object.entries(config.runtimeRoot.globalFiles ?? {})) {
      for (const file of files) {
        const src = path.join(source, dir, file);
        if (fs.existsSync(src)) linkOrCopy(src, path.join(runtime, dir, file));
      }
    }
    // Sections and metadata are consumed beside the installed entry too.
    for (const artifact of generated.artifacts) {
      if (!['section', 'metadata'].includes(artifact.kind)) continue;
      const file = path.join(render, artifact.relativePath);
      fs.writeFileSync(file, namespaceSkill(fs.readFileSync(file, 'utf8'), prefixed));
    }
    fs.writeFileSync(path.join(runtime, '.gstack-install.json'), JSON.stringify(selection, null, 2) + '\n', { mode: 0o600 });
    fs.writeFileSync(path.join(runtime, '.gstack-owned'), source + '\n');
    writeManifest(runtime);

    fs.mkdirSync(skills, { recursive: true });
    const desired = new Set(['gstack', ...generatedNames.map(entryName)]);
    const obsolete: string[] = [];
    for (const name of fs.readdirSync(skills)) {
      if (desired.has(name)) continue;
      const candidate = path.join(skills, name);
      if (owned(candidate, source, state)) obsolete.push(candidate);
    }
    for (const name of desired) {
      const dest = path.join(skills, name);
      if (exists(dest) && !owned(dest, source, state)) throw new Error(`foreign skill collision: ${dest}`);
    }
    if (exists(state) && !fs.existsSync(path.join(root, '.gstack-install.json'))) {
      throw new Error(`existing core render lacks an install record: ${state}`);
    }
    fs.mkdirSync(backup);
    const replacements = [state, root, ...generatedNames.map(id => path.join(skills, entryName(id))), ...obsolete];
    for (let i = 0; i < replacements.length; i++) {
      const dest = replacements[i];
      if (!exists(dest)) continue;
      const saved = path.join(backup, String(i));
      fs.renameSync(dest, saved);
      moved.push([dest, saved]);
    }
    fs.renameSync(render, state); placed.push(state);
    fs.renameSync(runtime, root); placed.push(root);
    for (const id of generatedNames) {
      const dest = path.join(skills, entryName(id));
      fs.renameSync(path.join(entries, entryName(id)), dest);
      placed.push(dest);
    }
    // Preserve replaced installations outside discovery for an explicit rollback.
    const archived = `${state}.previous-${Date.now()}`;
    if (fs.readdirSync(backup).length) fs.renameSync(backup, archived);
    return [...desired];
  } catch (error) {
    for (const dest of placed.reverse()) fs.rmSync(dest, { recursive: true, force: true });
    for (const [dest, saved] of moved.reverse()) fs.renameSync(saved, dest);
    throw error;
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
    fs.rmdirSync(lock);
  }
}

if (import.meta.main) {
  const argv = process.argv.slice(2);
  const arg = (name: string) => { const i = argv.indexOf(name); if (i < 0 || !argv[i + 1]) throw new Error(`${name} requires a value`); return argv[i + 1]; };
  try {
    const host = arg('--host');
    if (host !== 'claude' && host !== 'codex') throw new Error('core supports only claude or codex');
    const profile = argv.includes('--profile') ? arg('--profile') : 'core';
    if (profile !== 'core' && profile !== 'compat') throw new Error(`unknown skill profile: ${profile}`);
    const installed = await installCoreProfile({ host, profile, sourceRoot: arg('--source-root'), skillsDir: arg('--skills-dir'), stateRoot: arg('--state-root'), model: arg('--model') as Model, prefix: argv.includes('--prefix'), respectDetection: argv.includes('--respect-detection') });
    console.log(`Installed ${installed.length} ${host} ${profile} entries`);
  } catch (error) { console.error((error as Error).message); process.exitCode = 1; }
}
