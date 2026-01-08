#!/usr/bin/env bun
/**
 * Build standalone executables for all supported platforms
 *
 * This script cross-compiles from a single machine by installing
 * native dependencies for all platforms before building.
 *
 * Usage:
 *   bun run scripts/build-binaries.ts              # Build all platforms
 *   bun run scripts/build-binaries.ts --single     # Build only current platform
 *   bun run scripts/build-binaries.ts --skip-install  # Skip dependency installation
 */

import { $ } from "bun";
import { existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";

const TARGETS = [
  { os: "darwin", arch: "arm64", target: "bun-darwin-arm64" },
  { os: "darwin", arch: "x64", target: "bun-darwin-x64" },
  { os: "linux", arch: "x64", target: "bun-linux-x64" },
  { os: "linux", arch: "arm64", target: "bun-linux-arm64" },
  { os: "win32", arch: "x64", target: "bun-windows-x64" },
] as const;

const ROOT_DIR = join(import.meta.dir, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

async function getPackageInfo(): Promise<{
  name: string;
  version: string;
  opentuiVersion: string;
}> {
  const pkg = await Bun.file(join(ROOT_DIR, "package.json")).json();
  // Extract @opentui/core version
  const opentuiVersion = pkg.dependencies["@opentui/core"].replace("^", "");
  return {
    name: pkg.name.replace("@terminal-api/", ""),
    version: pkg.version,
    opentuiVersion,
  };
}

function getBinaryName(os: string, arch: string): string {
  // Use consistent naming: terminal-{os}-{arch}
  // For npm package naming, we use win32 but for display we use windows
  const osName = os === "win32" ? "windows" : os;
  return `terminal-${osName}-${arch}`;
}

function getNpmPackageName(os: string, arch: string): string {
  // npm packages use the os name directly (darwin, linux, windows)
  const osName = os === "win32" ? "windows" : os;
  return `@terminal-api/cli-${osName}-${arch}`;
}

async function buildTarget(
  target: (typeof TARGETS)[number],
  version: string,
): Promise<{ name: string; version: string }> {
  const binaryName = getBinaryName(target.os, target.arch);
  const distPath = join(DIST_DIR, binaryName);
  const binPath = join(distPath, "bin");
  const outFile = join(binPath, target.os === "win32" ? "terminal.exe" : "terminal");

  console.log(`Building ${target.target}...`);

  // Create output directory
  mkdirSync(binPath, { recursive: true });

  const result = await Bun.build({
    entrypoints: [join(ROOT_DIR, "src/cli.ts")],
    compile: {
      target: target.target,
      outfile: outFile,
    },
    minify: true,
    sourcemap: "external",
    define: {
      "process.env.TERMINAL_CLI_VERSION": JSON.stringify(version),
    },
  });

  if (!result.success) {
    console.error(`Failed to build ${target.target}:`);
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  // Create package.json for this platform package
  const npmPackageName = getNpmPackageName(target.os, target.arch);
  const platformPkg = {
    name: npmPackageName,
    version,
    os: [target.os],
    cpu: [target.arch],
  };

  await Bun.write(join(distPath, "package.json"), JSON.stringify(platformPkg, null, 2) + "\n");

  console.log(`  -> ${distPath}`);

  return { name: npmPackageName, version };
}

async function main(): Promise<void> {
  const singleFlag = process.argv.includes("--single");
  const skipInstall = process.argv.includes("--skip-install");

  const { name, version, opentuiVersion } = await getPackageInfo();

  console.log(`Building ${name} v${version}\n`);

  // Clean dist directory
  if (existsSync(DIST_DIR)) {
    rmSync(DIST_DIR, { recursive: true });
  }
  mkdirSync(DIST_DIR, { recursive: true });

  // Install native dependencies for all platforms (required for cross-compilation)
  if (!skipInstall) {
    console.log("Installing native dependencies for all platforms...");
    await $`bun install --os="*" --cpu="*" @opentui/core@${opentuiVersion}`;
    console.log("");
  }

  // Filter targets if --single flag is provided
  const targets = singleFlag
    ? TARGETS.filter((t) => t.os === process.platform && t.arch === process.arch)
    : TARGETS;

  if (targets.length === 0) {
    console.error(`No matching target for current platform: ${process.platform}-${process.arch}`);
    process.exit(1);
  }

  // Build each target and collect package info
  const binaries: Record<string, string> = {};
  for (const target of targets) {
    const result = await buildTarget(target, version);
    binaries[result.name] = result.version;
  }

  // Export binaries info for use by other scripts
  const binariesPath = join(DIST_DIR, "binaries.json");
  await Bun.write(binariesPath, JSON.stringify(binaries, null, 2) + "\n");

  console.log("\nBuild complete!");
  console.log("\nPlatform packages:");
  for (const [pkgName, pkgVersion] of Object.entries(binaries)) {
    console.log(`  ${pkgName}@${pkgVersion}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export { TARGETS, getBinaryName, getNpmPackageName };
