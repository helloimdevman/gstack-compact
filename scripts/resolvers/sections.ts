/**
 * Section resolvers (v2 plan T9, Claude-first carve).
 *
 * A carved skill keeps its prose-heavy steps in `<skill>/sections/<id>.md`, read
 * on demand. The SAME template ships to every host, so these resolvers make the
 * carve host-aware:
 *
 *  - On file-section hosts: {{SECTION:id}} emits a STOP-Read pointer to the
 *    generated file beside the entry.
 *  - On inline hosts: {{SECTION:id}} INLINES the section template's content,
 *    so external hosts keep the full monolith ship skill (no section files, no
 *    host-portable-path problem). Inlined content keeps its own {{RESOLVER}}
 *    tokens, which the generator's multi-pass resolve expands.
 *
 * {{SECTION_INDEX:skill}} renders the situation→section table from the PASSIVE
 * manifest on file-section hosts (empty on inline hosts). The manifest
 * is the single source of id/file/title/trigger text (CM2; v2_PLAN.md:663).
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ResolverFn, TemplateContext } from './types';
import { getHostConfig } from '../../hosts';

const ROOT = path.resolve(import.meta.dirname, '..', '..');

interface SectionEntry {
  id: string;
  file: string;
  title: string;
  trigger: string;
}
interface SectionManifest {
  skill: string;
  sections: SectionEntry[];
}

export function validateSectionManifest(raw: unknown, skill: string, entry: string, files: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object') return ['manifest must be an object'];
  const manifest = raw as Partial<SectionManifest>;
  if (manifest.skill !== skill) errors.push(`wrong skill: ${String(manifest.skill)}`);
  if (!Array.isArray(manifest.sections) || manifest.sections.length === 0) return [...errors, 'sections must be nonempty'];
  const ids = new Set<string>();
  const names = new Set<string>();
  const hasIndex = entry.includes(`{{SECTION_INDEX:${skill}}}`) || entry.includes('{{SECTION_INDEX}}');
  for (const section of manifest.sections) {
    if (!section || typeof section !== 'object') { errors.push('invalid section'); continue; }
    if (typeof section.id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(section.id)) errors.push(`invalid id: ${String(section.id)}`);
    else if (ids.has(section.id)) errors.push(`duplicate id: ${section.id}`);
    ids.add(section.id);
    if (typeof section.file !== 'string' || !/^[a-z][a-z0-9-]*\.md$/.test(section.file)) errors.push(`invalid file: ${String(section.file)}`);
    else {
      if (names.has(section.file)) errors.push(`duplicate file: ${section.file}`);
      if (!files.has(section.file)) errors.push(`missing file: ${section.file}`);
      names.add(section.file);
    }
    if (typeof section.title !== 'string' || !section.title.trim() || typeof section.trigger !== 'string' || !section.trigger.trim()) errors.push(`missing title or trigger: ${String(section.id)}`);
    if (!hasIndex && !entry.includes(`{{SECTION:${section.id}}}`)) errors.push(`unreachable section: ${String(section.id)}`);
  }
  return errors;
}

function loadManifest(skill: string): SectionManifest {
  if (!/^[a-z][a-z0-9-]*$/.test(skill)) throw new Error(`Invalid section skill: ${skill}`);
  const p = path.join(ROOT, skill, 'sections', 'manifest.json');
  const raw = fs.readFileSync(p, 'utf-8');
  const manifest = JSON.parse(raw) as SectionManifest;
  const template = fs.readFileSync(path.join(ROOT, skill, 'SKILL.md.tmpl'), 'utf-8');
  const files = new Set(fs.readdirSync(path.dirname(p)).filter(f => f.endsWith('.md.tmpl')).map(f => f.slice(0, -'.tmpl'.length)));
  const errors = validateSectionManifest(manifest, skill, template, files);
  if (errors.length) throw new Error(`${p}: ${errors.join('; ')}`);
  return manifest;
}

function findSection(skill: string, id: string): SectionEntry {
  const entry = loadManifest(skill).sections.find(s => s.id === id);
  if (!entry) {
    throw new Error(`{{SECTION:${id}}} — no section "${id}" in ${skill}/sections/manifest.json`);
  }
  return entry;
}

/** {{SECTION:id}} — pointer on file-section hosts, inline elsewhere. */
export const SECTION: ResolverFn = (ctx: TemplateContext, args?: string[]): string => {
  const id = args?.[0];
  if (!id) throw new Error('{{SECTION:id}} requires a section id');
  const entry = findSection(ctx.skillName, id);

  if (getHostConfig(ctx.host).generation.sectionMode === 'files') {
    const sectionPath = `sections/${entry.file}`;
    return [
      `> **STOP.** Before ${entry.trigger}, Read \`${sectionPath}\` relative to this SKILL.md`,
      `> and execute it in full. That section is the source for this step.`,
    ].join('\n');
  }

  // Non-Claude hosts inline the section template content (monolith preserved).
  // Inner {{RESOLVER}} tokens are expanded by the generator's multi-pass resolve.
  const tmplPath = path.join(ROOT, ctx.skillName, 'sections', `${entry.file}.tmpl`);
  return fs.readFileSync(tmplPath, 'utf-8').trimEnd();
};

/**
 * {{SECTION_INDEX:skill}} — situation→section table from the passive manifest.
 * File-section hosts only; inline hosts have no separate files.
 */
export const SECTION_INDEX: ResolverFn = (ctx: TemplateContext, args?: string[]): string => {
  if (getHostConfig(ctx.host).generation.sectionMode !== 'files') return '';
  const skill = args?.[0] ?? ctx.skillName;
  const manifest = loadManifest(skill);
  const lines: string[] = [
    '## Section index — Read each section when its situation applies',
    '',
    'This skill is a decision-tree skeleton. The steps below point to on-demand',
    'sections relative to this SKILL.md. Read one in full when its trigger applies.',
    '',
    '| When | Read this section |',
    '|------|-------------------|',
  ];
  for (const s of manifest.sections) {
    lines.push(`| ${s.trigger} | \`sections/${s.file}\` |`);
  }
  return lines.join('\n');
};
