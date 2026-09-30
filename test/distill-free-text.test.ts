/**
 * gstack-distill-free-text — Layer 8 dream cycle (plan-tune cathedral T10).
 *
 * Covers the SDK-free paths: status, dry-run, rate cap, no-event handling.
 * The real API call path is exercised by the E2E test in T16; here we
 * verify the bin's deterministic plumbing without burning tokens.
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawnSync } from 'child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';

const ROOT = path.resolve(import.meta.dir, '..');
const BIN = path.join(ROOT, 'bin', 'gstack-distill-free-text');
const QLOG_BIN = path.join(ROOT, 'bin', 'gstack-question-log');

let stateRoot: string;
let fixtureCwd: string;
let cwdSlug: string;

beforeEach(() => {
  stateRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'gstack-dist-'));
  cwdSlug = 'distill-fixture';
  fixtureCwd = path.join(stateRoot, cwdSlug);
  fs.mkdirSync(fixtureCwd, { recursive: true });
});

afterEach(() => {
  fs.rmSync(stateRoot, { recursive: true, force: true });
});

function makeEnv(extra: Record<string, string> = {}): Record<string, string> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined) env[k] = v;
  }
  env.GSTACK_STATE_ROOT = stateRoot;
  env.GSTACK_QUESTION_LOG_NO_DERIVE = '1';
  delete env.GSTACK_HOME;
  return { ...env, ...extra };
}

function run(args: string[]): { stdout: string; stderr: string; status: number } {
  const res = spawnSync(BIN, args, {
    env: makeEnv(),
    encoding: 'utf-8',
    cwd: fixtureCwd,
    timeout: 30_000,
  });
  return {
    stdout: res.stdout ?? '',
    stderr: res.stderr ?? '',
    status: res.status ?? -1,
  };
}

function writeAuqOtherEvent(text: string): void {
  spawnSync(
    QLOG_BIN,
    [
      JSON.stringify({
        skill: 'plan-tune',
        question_id: 'hook-distill00',
        question_summary: 'Test question for distillation',
        options_count: 2,
        user_choice: 'Other',
        source: 'auq-other',
        free_text: text,
        session_id: 's-distill',
        tool_use_id: 'tu-distill-' + Math.random().toString(36).slice(2, 8),
      }),
    ],
    {
      env: makeEnv(),
      cwd: fixtureCwd,
      encoding: 'utf-8',
      timeout: 30_000,
    },
  );
}

function writeCostLogEntry(slug: string, dateIso: string): void {
  fs.mkdirSync(stateRoot, { recursive: true });
  fs.appendFileSync(
    path.join(stateRoot, 'distill-cost.jsonl'),
    JSON.stringify({ ts: dateIso, slug, proposals_count: 0, cost_usd_est: 0 }) + '\n',
  );
}

// ----------------------------------------------------------------------
// Status subcommand
// ----------------------------------------------------------------------

describe('--status', () => {
  test('reports "no runs yet" when cost log absent', () => {
    const r = run(['--status']);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/no distill runs/);
  });

  test('reports counts when prior runs exist', () => {
    writeCostLogEntry(cwdSlug, new Date().toISOString());
    writeCostLogEntry(cwdSlug, new Date().toISOString());
    const r = run(['--status']);
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('RUNS: 2');
    expect(r.stdout).toMatch(/TODAY: 2 run\(s\)/);
  });
});

// ----------------------------------------------------------------------
// No rate cap (v1.52.0.0 cap audit) — the natural rate of free-text events
// is rare enough that count-based capping was theatrical. Cost log alone
// provides auditability via --status.
// ----------------------------------------------------------------------

describe('no rate cap (audit removed)', () => {
  test('never exits with RATE_CAPPED, even with many runs today', () => {
    const today = new Date().toISOString();
    for (let i = 0; i < 10; i++) writeCostLogEntry(cwdSlug, today);
    const r = run([]);
    expect(r.status).toBe(0);
    expect(r.stdout).not.toMatch(/RATE_CAPPED/);
  });
});

// ----------------------------------------------------------------------
// No events / no log
// ----------------------------------------------------------------------

describe('no-event paths', () => {
  test('exits NO_LOG when question-log.jsonl missing', () => {
    const r = run([]);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/NO_LOG/);
  });

  test('exits NO_FREE_TEXT when log has events but none are auq-other', () => {
    spawnSync(
      QLOG_BIN,
      [
        JSON.stringify({
          skill: 'plan-tune',
          question_id: 'hook-other00',
          question_summary: 'Q',
          options_count: 2,
          user_choice: 'A',
          source: 'hook',
          session_id: 's',
          tool_use_id: 'tu-x',
        }),
      ],
      { env: makeEnv(), cwd: fixtureCwd, encoding: 'utf-8', timeout: 30_000 },
    );
    const r = run([]);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/NO_FREE_TEXT/);
  });
});

// ----------------------------------------------------------------------
// Dry-run
// ----------------------------------------------------------------------

describe('--dry-run', () => {
  test('emits the distill prompt + events JSON without calling API', () => {
    writeAuqOtherEvent('I always include tests with new features');
    writeAuqOtherEvent('Skip design review for typo fixes');
    // Strip ANTHROPIC_API_KEY to prove no API call happens.
    const env = makeEnv();
    delete env.ANTHROPIC_API_KEY;
    const res = spawnSync(BIN, ['--dry-run'], { env, cwd: fixtureCwd, encoding: 'utf-8', timeout: 30_000 });
    expect(res.status).toBe(0);
    expect(res.stdout).toContain('DISTILL PROMPT');
    expect(res.stdout).toContain('always include tests');
  });
});

// ----------------------------------------------------------------------
// API key required
// ----------------------------------------------------------------------

describe('API auth', () => {
  test('fails loud when ANTHROPIC_API_KEY missing on sync run', () => {
    writeAuqOtherEvent('Some free text response that needs distilling');
    const env = makeEnv();
    delete env.ANTHROPIC_API_KEY;
    const res = spawnSync(BIN, [], { env, cwd: fixtureCwd, encoding: 'utf-8', timeout: 30_000 });
    expect(res.status).not.toBe(0);
    expect(res.stderr).toMatch(/ANTHROPIC_API_KEY/);
    expect(res.stderr).toMatch(/separate billing/);
  });

  test('native HTTP writes filtered proposals and rejects HTTP errors without the SDK', async () => {
    writeAuqOtherEvent('Always include tests');
    let status = 200;
    let request: any;
    const server = createServer(async (incoming, outgoing) => {
      let body = '';
      for await (const chunk of incoming) body += chunk;
      request = { path: incoming.url, headers: incoming.headers, body: JSON.parse(body) };
      outgoing.writeHead(status, { 'content-type': 'application/json' });
      outgoing.end(JSON.stringify({ content: [{ type: 'text', text: JSON.stringify({ proposals: [
        { key: 'tests', confidence: 0.9 }, { key: 'discard', confidence: 0.2 },
      ] }) }], usage: { input_tokens: 10, output_tokens: 20 } }));
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
      const env = makeEnv({ ANTHROPIC_API_KEY: 'local-fixture', ANTHROPIC_BASE_URL: `http://127.0.0.1:${(server.address() as any).port}/` });
      const invoke = async () => {
        const child = Bun.spawn([BIN], { cwd: fixtureCwd, env, stdout: 'pipe', stderr: 'pipe' });
        const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
        return { stdout, stderr, code };
      };
      const ok = await invoke();
      expect(ok.code, ok.stderr).toBe(0);
      expect(ok.stdout).toContain('"proposals_count":1');
      expect(request.path).toBe('/v1/messages');
      expect(request.headers['anthropic-version']).toBe('2023-06-01');
      expect(request.headers['x-api-key']).toBe('local-fixture');
      expect(request.body.max_tokens).toBe(4096);
      status = 429;
      writeAuqOtherEvent('Another response for the HTTP error control');
      const rejected = await invoke();
      expect(rejected.code).not.toBe(0);
      expect(rejected.stderr).toContain('provider returned HTTP 429');
    } finally { server.close(); server.closeAllConnections(); }
  });
});

// ----------------------------------------------------------------------
// Background spawn
// ----------------------------------------------------------------------

describe('--background', () => {
  test('detaches and exits with DISTILL_SPAWNED', () => {
    const r = run(['--background']);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/DISTILL_SPAWNED: pid=\d+/);
  });
});
