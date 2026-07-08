interface CliVersion {
  name: string;
  version: string;
}

let cliVersionPromise: Promise<CliVersion> | undefined;

export function getCliVersion(): Promise<CliVersion> {
  cliVersionPromise ??= loadCliVersion();
  return cliVersionPromise;
}

async function loadCliVersion(): Promise<CliVersion> {
  try {
    const pkgUrl = new URL("../../package.json", import.meta.url);
    const pkgText = await Bun.file(pkgUrl).text();
    const pkg = JSON.parse(pkgText) as { name?: string; version?: string };

    return {
      name: pkg.name ?? "terminal-cli",
      version: pkg.version ?? "unknown",
    };
  } catch {
    return { name: "terminal-cli", version: "unknown" };
  }
}
