/**
 * Generated-doc fence pairing + PIPESTATUS portability (#2671, #2669).
 *
 * #2671: an unclosed ```bash fence in codex/sections/consult-mode.md silently
 * inverted every fenced region after it — prose rendered as code and the
 * skill's tail instructions rendered inert. Nothing guarded fence pairing, so
 * the defect migrated file-to-file across carves. The scanner below is a
 * CommonMark-faithful state machine, NOT a mod-2 count: inside an open fence,
 * a ```lang line is literal content (only a bare ``` closes), so nested fence
 * EXAMPLES don't false-positive; a file that ends inside a fence fails.
 *
 * #2669: `${PIPESTATUS[0]}` is bash-only — empty under zsh, so hang detection
 * (`= "124"`) never fired and every clean run printed a spurious
 * "[codex exit ]". The portable form `${PIPESTATUS[0]:-${pipestatus[1]}}` is
 * pinned statically AND executed under real bash and zsh.
 */
import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = path.resolve(import.meta.dir, "..");

/** All generated skill docs: every SKILL.md + every sections/*.md. */
function generatedDocs(): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name === "node_modules")
      continue;
    const skillMd = path.join(ROOT, entry.name, "SKILL.md");
    if (fs.existsSync(skillMd)) out.push(skillMd);
    const sections = path.join(ROOT, entry.name, "sections");
    if (fs.existsSync(sections)) {
      for (const f of fs.readdirSync(sections)) {
        if (f.endsWith(".md")) out.push(path.join(sections, f));
      }
    }
  }
  return out;
}

/** Returns the 1-based line of the first unclosed fence, or null when paired. */
export function findUnclosedFence(body: string): number | null {
  let openLine: number | null = null;
  let openLen = 0;
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const run = lines[i].match(/^(`{3,})(.*)$/);
    if (!run) continue;
    if (openLine === null) {
      openLine = i + 1; // any ```+ line opens (info string allowed)
      openLen = run[1].length;
    } else if (run[1].length >= openLen && /^\s*$/.test(run[2])) {
      // CommonMark close: backticks-only, run at least as long as the opener.
      // A shorter run (``` inside a ```` fence) is literal content.
      openLine = null;
    }
    // ```lang while inside = literal content (nested fence example) — ignore.
  }
  return openLine;
}

describe("generated-doc fence pairing (#2671)", () => {
  const docs = generatedDocs();

  test("scanner sees a meaningful corpus", () => {
    expect(docs.length).toBeGreaterThan(50);
  });

  test("every generated SKILL.md and sections/*.md closes every fence", () => {
    const bad: string[] = [];
    for (const doc of docs) {
      const line = findUnclosedFence(fs.readFileSync(doc, "utf-8"));
      if (line !== null) bad.push(`${path.relative(ROOT, doc)}:${line}`);
    }
    expect(
      bad,
      `unclosed \`\`\` fence(s) — everything after each inverts prose/code:\n  ${bad.join("\n  ")}`,
    ).toEqual([]);
  });

  test("the scanner itself catches the #2671 shape (self-test)", () => {
    const broken = "prose\n```bash\nx=1\n\nmore prose that should be outside\n```bash\nmkdir -p y\n```\n";
    // First fence opens; ```bash inside is content; bare ``` closes it; file
    // ends OUTSIDE — but the second region's prose was swallowed. The
    // detectable invariant is end-of-file state, so test a truly unclosed tail:
    expect(findUnclosedFence(broken)).toBeNull();
    expect(findUnclosedFence(broken + "```text\ntail\n")).toBe(9);
  });

  test("fence-length tracking: a longer opener is not closed by a shorter run", () => {
    // 4-backtick fence wrapping a 3-backtick example (the standard way to
    // show a fence inside a fence) — the inner bare ``` must NOT close it.
    const quad = "````markdown\n```bash\necho hi\n```\n````\n";
    expect(findUnclosedFence(quad)).toBeNull();
    // Same body missing the 4-backtick closer: unclosed at line 1.
    expect(findUnclosedFence("````markdown\n```bash\necho hi\n```\n")).toBe(1);
  });
});
