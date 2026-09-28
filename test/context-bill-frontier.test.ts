import { test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { buildBill } from '../lib/context-bill';

test('installed bill distinguishes catalog, canonical alias, selected section, and all-section ceiling', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-bill-core-'));
  try {
    fs.mkdirSync(path.join(root, 'gstack'));
    fs.writeFileSync(path.join(root, 'gstack', 'SKILL.md'), '---\nname: gstack\ndescription: router\n---\n# Router\n');
    fs.writeFileSync(path.join(root, 'gstack', 'CONTRACT.md'), 'shared contract\n');
    fs.mkdirSync(path.join(root, 'plan', 'sections'), { recursive: true });
    fs.writeFileSync(path.join(root, 'plan', 'SKILL.md'), '---\nname: plan\ndescription: planning\n---\n| When | Read this section |\n|---|---|\n| product review | `sections/product.md` |\n| engineering review | `sections/engineering.md` |\n');
    fs.writeFileSync(path.join(root, 'plan', 'sections', 'product.md'), 'product evidence\n');
    fs.symlinkSync('product.md', path.join(root, 'plan', 'sections', 'engineering.md'));
    fs.mkdirSync(path.join(root, 'autoplan'));
    fs.writeFileSync(path.join(root, 'autoplan', 'SKILL.md'), '---\nname: autoplan\ndescription: alias\n---\nRead `../plan/SKILL.md` relative to this installed SKILL.md and execute its `review-all` mode.\n');
    const bill = buildBill(root, { selectedSections: { plan: ['sections/product.md'] } });
    const plan = bill.skills.find(skill => skill.name === 'plan')!;
    const alias = bill.skills.find(skill => skill.name === 'autoplan')!;
    expect(bill.totals.skillCount).toBe(3);
    expect(bill.totals.runtimeBytes).toBe(Buffer.byteLength('shared contract\n'));
    expect(plan.conditionalRefs.map(ref => ref.path)).toEqual(['sections/product.md', 'sections/engineering.md']);
    expect(plan.perInvocationBytes).toBe(plan.eagerBytes + plan.conditionalRefs[0].bytes);
    expect(plan.routeCeiling!.bytes).toBe(plan.eagerBytes + plan.conditionalBytes);
    expect(fs.realpathSync(path.join(root, 'plan', plan.conditionalRefs[0].path))).toBe(fs.realpathSync(path.join(root, 'plan', plan.conditionalRefs[1].path)));
    expect(plan.conditionalBytes).toBe(2 * plan.conditionalRefs[0].bytes);
    expect(alias.forcedRefs[0].via).toBe('canonical alias');
    expect(alias.forcedRefs[0].missing).toBe(false);
    expect(alias.eagerBytes).toBeGreaterThan(alias.skillMdBytes);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('large JSON bills flush completely through a pipe', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-bill-pipe-'));
  try {
    for (let i = 0; i < 100; i++) {
      const dir = path.join(root, `skill-${i}`);
      fs.mkdirSync(dir);
      fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: skill-${i}\ndescription: ${'x'.repeat(300)}\n---\n# Skill ${i}\n`);
    }
    const run = Bun.spawn(['bun', path.join(import.meta.dir, '../bin/gstack-context-bill'), root, '--json'], { stdout: 'pipe', stderr: 'pipe' });
    const [stdout, exit] = await Promise.all([new Response(run.stdout).text(), run.exited]);
    expect(exit).toBe(0);
    expect(stdout.length).toBeGreaterThan(65_536);
    expect(JSON.parse(stdout).totals.skillCount).toBe(100);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
