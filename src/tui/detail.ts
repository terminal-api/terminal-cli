export function formatDetail(item: unknown): string {
  return JSON.stringify(item, null, 2);
}

export async function pasteFromClipboard(): Promise<string | null> {
  for (const command of getPasteCommands()) {
    const result = await tryPasteCommand(command);
    if (result !== null) {
      return result;
    }
  }
  return null;
}

function getPasteCommands(): string[][] {
  switch (process.platform) {
    case "darwin":
      return [["pbpaste"]];
    case "win32":
      return [["powershell", "-command", "Get-Clipboard"]];
    default:
      return [
        ["wl-paste"],
        ["xclip", "-selection", "clipboard", "-o"],
        ["xsel", "--clipboard", "--output"],
      ];
  }
}

async function tryPasteCommand(command: string[]): Promise<string | null> {
  try {
    const proc = Bun.spawn(command, {
      stdout: "pipe",
      stderr: "ignore",
    });
    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;
    return exitCode === 0 ? output : null;
  } catch {
    return null;
  }
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
    await proc.stdin.end();
    const exitCode = await proc.exited;
    return exitCode === 0;
  } catch {
    return false;
  }
}
