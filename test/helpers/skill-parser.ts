/** Shared skill-doc validation helpers. */
import * as fs from 'fs';
import * as path from 'path';

/** External-host prose must not retain Claude install paths. */
export function externalHostPathLeaks(content: string): string[] {
  return content.replace(/```bash\n[\s\S]*?```/g, '').split('\n')
    .filter(line => line.includes('.claude/skills'));
}

/** Reject invocations of the removed bundled-browser CLI in generated skills. */
export function validateSkill(skillPath: string) {
  const invalid = fs.readFileSync(skillPath, 'utf8').split('\n').flatMap((line, index) =>
    /(?:^|\s)\$B(?:\s|$)/.test(line)
      ? [{ command: '$B', args: [], line: index + 1, raw: line.trim() }]
      : []);
  return { valid: [], invalid, snapshotFlagErrors: [], warnings: [] };
}

/**
 * Extract all REMOTE_SLUG=$(...) assignment patterns from .md files in given subdirectories.
 * Returns a Map from filename → array of full assignment lines found.
 */
export function extractRemoteSlugPatterns(rootDir: string, subdirs: string[]): Map<string, string[]> {
  const results = new Map<string, string[]>();
  // Accepts both the bare `REMOTE_SLUG=$(...)` form and the gstack-slug form
  // (`eval "$(...gstack-slug)"; REMOTE_SLUG="${SLUG:-...}"`).
  const pattern = /^(?:eval\s[^;]*;\s*)?REMOTE_SLUG=\S/;

  for (const subdir of subdirs) {
    const dir = path.join(rootDir, subdir);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches: string[] = [];

      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (pattern.test(trimmed)) {
          matches.push(trimmed);
        }
      }

      if (matches.length > 0) {
        results.set(`${subdir}/${file}`, matches);
      }
    }
  }

  return results;
}

/**
 * Parse a markdown weight table anchored to a "### Weights" heading.
 * Expects rows like: | Category | 15% |
 * Returns Map<category, number> where number is the percentage (e.g., 15).
 */
export function extractWeightsFromTable(content: string): Map<string, number> {
  const weights = new Map<string, number>();

  // Find the ### Weights section
  const weightsIdx = content.indexOf('### Weights');
  if (weightsIdx === -1) return weights;

  // Find the table within that section (stop at next heading or end)
  const section = content.slice(weightsIdx);
  const lines = section.split('\n');

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop at next heading
    if (line.startsWith('#') && !line.startsWith('###')) break;
    if (line.startsWith('### ') && i > 0) break;

    // Parse table rows: | Category | N% |
    const match = line.match(/^\|\s*(\w[\w\s]*\w|\w+)\s*\|\s*(\d+)%\s*\|$/);
    if (match) {
      const category = match[1].trim();
      const pct = parseInt(match[2], 10);
      // Skip header row
      if (category !== 'Category' && !isNaN(pct)) {
        weights.set(category, pct);
      }
    }
  }

  return weights;
}
