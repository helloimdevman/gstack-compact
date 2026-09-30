/** Package the core catalog from the same templates as standalone installs. */
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { runGeneration } from './gen-skill-docs';
import { namespaceSkill, publicSkillName } from './skill-namespace';

const ROOT = path.resolve(import.meta.dirname, '..');

export async function generatePlugin(dryRun = false): Promise<number> {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gpact-plugin-'));
  const expected = new Set<string>();
  let stale = 0;
  try {
    for (const host of ['claude', 'codex'] as const) {
      const outputRoot = path.join(temp, host);
      const result = await runGeneration({ host, skillProfile: 'core', outputRoot });
      if (result.exitCode !== 0) throw new Error(result.diagnostics.map(d => d.message).join('\n'));
      for (const artifact of result.artifacts) {
        if (!['skill', 'section', 'metadata'].includes(artifact.kind)) continue;
        const relative = artifact.relativePath.replace(/^\.agents\/skills\//, '');
        const parts = relative.split('/');
        const id = parts.length === 1 ? 'gstack' : parts.shift()!;
        const rest = relative === 'SKILL.md' ? relative : parts.join('/');
        const dest = path.join(ROOT, 'plugin-skills', host, publicSkillName(id), rest);
        let content = namespaceSkill(fs.readFileSync(path.join(outputRoot, artifact.relativePath), 'utf8'));
        if (artifact.kind === 'skill') {
          const root = host === 'claude' ? '${CLAUDE_PLUGIN_ROOT}' : '$GSTACK_ROOT';
          content = content.replace(/_G="[^\n]+"\n_R=[^\n]+\n\[ [^\n]+\n/, `_G="${root}"\n"$_G/bin/gpact-plugin-init" || exit 1\n`);
          if (host === 'codex') {
            content = content.replace(/(\n---\n)/, '$1\nThe plugin root is three directories above this loaded SKILL.md. Resolve that absolute path from the skill file location and set `GSTACK_ROOT` to it in every shell block. It contains `.codex-plugin/plugin.json` and `bin/gstack-skill-start`.\n');
          }
        }
        if (host === 'claude') {
          content = content.replace(/~\/\.claude\/skills\/gstack\b/g, '"${CLAUDE_PLUGIN_ROOT}"');
        }
        expected.add(dest);
        if (dryRun) {
          if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== content) { console.error(`STALE: ${path.relative(ROOT, dest)}`); stale++; }
        } else {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.writeFileSync(dest, content);
        }
      }
    }
    const scan = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) scan(file);
        else if (!expected.has(file)) throw new Error(`Unexpected plugin artifact: ${path.relative(ROOT, file)}`);
      }
    };
    if (fs.existsSync(path.join(ROOT, 'plugin-skills'))) scan(path.join(ROOT, 'plugin-skills'));
    return stale ? 1 : 0;
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

if (import.meta.main) process.exitCode = await generatePlugin(process.argv.includes('--dry-run'));
