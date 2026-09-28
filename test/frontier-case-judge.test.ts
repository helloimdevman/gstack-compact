import { test, expect } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import type { NativePublicToolEvent } from '../lib/claude-public-transcript';
import { judgeFrontierCase } from './helpers/frontier-case-judge';

const catalog = JSON.parse(fs.readFileSync(path.join(import.meta.dir, 'fixtures/frontier-optimization/cases.json'), 'utf8'));

test('twelve fixed cases define 72 planned slots and explicit authority boundaries', () => {
  expect(catalog.cases.map((item: any) => item.id)).toEqual(Array.from({ length: 12 }, (_, i) => `B${String(i + 1).padStart(2, '0')}`));
  expect(catalog.slots).toBe(catalog.cases.length * catalog.models.length * catalog.versions.length);
  for (const item of catalog.cases) {
    expect(fs.existsSync(path.join(import.meta.dir, '..', item.fixture.split('#')[0]))).toBe(true);
    for (const key of ['initialState', 'goal', 'allowedTools', 'allowedEffects', 'confirmedAnswers', 'requiredArtifacts', 'failureConditions']) expect(item).toHaveProperty(key);
    expect(item.requiredArtifacts.length).toBeGreaterThan(0);
    expect(item.failureConditions.length).toBeGreaterThan(0);
  }
  expect(catalog.cases[10].subcases).toEqual(['missing-contract', 'missing-tool', 'missing-answer']);
});

test('public-event replay rejects prose-only success, missing artifacts, forbidden effects, and foreign paths', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-frontier-judge-'));
  const foreign = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-frontier-foreign-'));
  const file = path.join(root, 'result.txt');
  fs.writeFileSync(file, 'verified output\n');
  fs.writeFileSync(path.join(foreign, 'result.txt'), 'foreign output\n');
  const testCase = { id: 'B01', requiredArtifacts: ['result'], failureConditions: ['unrelated command'] };
  const events: NativePublicToolEvent[] = [
    { kind: 'use', sessionId: 's', toolUseId: '1', timestamp: '2026-09-27T00:00:00Z', name: 'Write' },
    { kind: 'result', sessionId: 's', toolUseId: '1', timestamp: '2026-09-27T00:00:01Z', content: 'ok' },
  ];
  const complete = { fixtureRoot: root, publicEvents: events, artifacts: { result: file }, effectAudit: [] as string[], semanticChecks: { 'unrelated command': true }, completed: true };
  try {
    expect(judgeFrontierCase(testCase).status).toBe('not_run');
    expect(judgeFrontierCase(testCase, { ...complete, publicEvents: [] }).status).toBe('not_run');
    expect(judgeFrontierCase(testCase, { ...complete, artifacts: {} }).status).toBe('failed');
    expect(judgeFrontierCase(testCase, { ...complete, artifacts: { result: path.join(foreign, 'result.txt') } }).status).toBe('failed');
    expect(judgeFrontierCase(testCase, { ...complete, effectAudit: ['unrelated command'] }).status).toBe('failed');
    expect(judgeFrontierCase(testCase, { ...complete, semanticChecks: {} }).status).toBe('incomplete');
    expect(judgeFrontierCase(testCase, { ...complete, pendingPermission: true }).status).toBe('blocked');
    expect(judgeFrontierCase(testCase, { ...complete, cancelled: true }).status).toBe('cancelled');
    expect(judgeFrontierCase(testCase, { ...complete, publicEvents: [events[0], { ...events[1], isError: true }] }).status).toBe('failed');
    expect(judgeFrontierCase(testCase, { ...complete, publicEvents: [...events, { ...events[0], toolUseId: '2' }] }).status).toBe('failed');
    expect(judgeFrontierCase(testCase, { ...complete, fixtureRoot: path.join(root, 'missing') }).status).toBe('failed');
    expect(judgeFrontierCase(testCase, complete).status).toBe('passed');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(foreign, { recursive: true, force: true });
  }
});
