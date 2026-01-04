export function formatDetail(item: unknown): string {
  return JSON.stringify(item, null, 2);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  for (const command of getClipboardCommands()) {
    const success = await tryClipboardCommand(command, text);
    if (success) {
      return true;
    }
  }
  return false;
}

function getClipboardCommands(): string[][] {
  switch (process.platform) {
    case "darwin":
      return [["pbcopy"]];
    case "win32":
      return [["cmd", "/c", "clip"]];
    default:
      return [
        ["wl-copy"],
        ["xclip", "-selection", "clipboard"],
        ["xsel", "--clipboard", "--input"],
      ];
  }
}

async function tryClipboardCommand(command: string[], text: string): Promise<boolean> {
  try {
    const proc = Bun.spawn(command, {
      stdin: "pipe",
      stdout: "ignore",
      stderr: "ignore",
    });
    proc.stdin.write(text);
    proc.stdin.end();
    const exitCode = await proc.exited;
    return exitCode === 0;
  } catch {
    return false;
  }
}
