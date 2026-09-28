/**
 * Spawn a command on a real PTY.
 * Bun 1.2 ignores the `terminal` spawn option, so this process relays
 * through scripts/pty-bridge.py when Bun.Terminal is absent.
 */
import * as path from 'node:path';

export interface PtyHandle {
  terminal: {
    write(data: string | Uint8Array): void;
    resize?(cols: number, rows: number): void;
  };
  exited: Promise<number>;
  kill(signal?: string): void;
  signalCode: string | null;
}

export function bunHasTerminal(): boolean {
  return typeof (Bun as { Terminal?: unknown }).Terminal === 'function';
}

export function spawnPty(
  command: string[],
  opts: {
    cwd?: string;
    env?: Record<string, string>;
    cols: number;
    rows: number;
    onData: (chunk: Buffer) => void;
    onReaderExit?: (code: number, signal: string | null) => void;
  },
): PtyHandle {
  const script = path.join(import.meta.dir, '..', 'scripts', 'pty-bridge.py');
  const proc = Bun.spawn(['python3', script, ...command], {
    cwd: opts.cwd,
    env: {
      ...(opts.env ?? process.env as Record<string, string>),
      GSTACK_PTY_COLS: String(opts.cols),
      GSTACK_PTY_ROWS: String(opts.rows),
      PYTHONUNBUFFERED: '1',
    },
    stdin: 'pipe',
    stdout: 'pipe',
    stderr: 'pipe',
    // Bun 1.2 ignores this. Tests that mock Bun.spawn still inject the first
    // screen through terminal.data, the same callback a native PTY would use.
    terminal: {
      cols: opts.cols,
      rows: opts.rows,
      data(_terminal: unknown, chunk: Buffer) { opts.onData(chunk); },
    },
  } as Parameters<typeof Bun.spawn>[1]);
  const handle: PtyHandle = {
    terminal: {
      write(data: string | Uint8Array) {
        const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
        proc.stdin.write(bytes);
        proc.stdin.flush?.();
      },
    },
    exited: proc.exited,
    kill(signal?: string) { proc.kill(signal as never); },
    signalCode: null,
  };
  const stdout = (proc as { stdout?: { getReader?: () => ReadableStreamDefaultReader<Uint8Array> } }).stdout;
  if (stdout && typeof stdout.getReader === 'function') void (async () => {
    const reader = stdout.getReader!();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value?.byteLength) opts.onData(Buffer.from(value));
      }
    } finally {
      opts.onReaderExit?.(0, null);
    }
  })();
  return handle;
}
