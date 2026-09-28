#!/usr/bin/env python3
"""PTY bridge for Bun versions without Bun.Terminal.

Relays the child PTY to this process's stdin/stdout and exits with the
child's status. COLS/ROWS come from GSTACK_PTY_COLS and GSTACK_PTY_ROWS.
"""
import fcntl
import os
import pty
import select
import signal
import struct
import sys
import termios
import threading

def set_size(fd: int, rows: int, cols: int) -> None:
    winsize = struct.pack("HHHH", rows, cols, 0, 0)
    fcntl.ioctl(fd, termios.TIOCSWINSZ, winsize)

def main() -> None:
    cmd = sys.argv[1:]
    if not cmd:
        sys.stderr.write("pty-bridge: missing command\n")
        sys.exit(64)
    cols = int(os.environ.get("GSTACK_PTY_COLS", "80"))
    rows = int(os.environ.get("GSTACK_PTY_ROWS", "24"))
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp(cmd[0], cmd)
    set_size(fd, rows, cols)

    def stop_child(signum, _frame):
        try:
            os.kill(pid, signal.SIGTERM if signum != signal.SIGKILL else signal.SIGKILL)
        except ProcessLookupError:
            pass

    signal.signal(signal.SIGTERM, stop_child)
    signal.signal(signal.SIGINT, stop_child)

    def pump_stdin() -> None:
        while True:
            try:
                data = os.read(0, 65536)
            except OSError:
                return
            if not data:
                return
            try:
                os.write(fd, data)
            except OSError:
                return

    threading.Thread(target=pump_stdin, daemon=True).start()
    while True:
        try:
            ready, _, _ = select.select([fd], [], [], 0.2)
        except (OSError, ValueError):
            break
        if fd not in ready:
            result = os.waitpid(pid, os.WNOHANG)
            if result[0] == pid:
                break
            continue
        try:
            data = os.read(fd, 65536)
        except OSError:
            break
        if not data:
            break
        os.write(1, data)
    _, status = os.waitpid(pid, 0)
    if os.WIFEXITED(status):
        sys.exit(os.WEXITSTATUS(status))
    if os.WIFSIGNALED(status):
        sys.exit(128 + os.WTERMSIG(status))
    sys.exit(1)

if __name__ == "__main__":
    main()
