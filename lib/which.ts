import { accessSync, constants, statSync } from 'node:fs';
import * as path from 'node:path';

/** Resolve an executable without launching a shell or requiring a Bun global. */
export function which(command: string, env: NodeJS.ProcessEnv = process.env): string | null {
  const windows = process.platform === 'win32';
  const extensions = windows && !path.extname(command)
    ? (env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD').split(';') : [''];
  const dirs = command.includes('/') || command.includes('\\') ? [''] : (env.PATH ?? env.Path ?? '').split(path.delimiter).filter(Boolean);
  for (const dir of dirs) {
    for (const ext of extensions) {
      const file = path.resolve(dir.replace(/^"(.*)"$/, '$1'), command + ext);
      try {
        if (!statSync(file).isFile()) continue;
        accessSync(file, windows ? constants.F_OK : constants.X_OK);
        return file;
      } catch {}
    }
  }
  return null;
}
