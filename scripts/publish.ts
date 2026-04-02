#!/usr/bin/env bun
/**
 * Publish all packages to npm
 *
 * Usage:
 *   bun run scripts/publish.ts              # Publish with 'latest' tag
 *   bun run scripts/publish.ts --tag beta   # Publish with custom tag
 *   bun run scripts/publish.ts --dry-run    # Show what would be published
 *   bun run scripts/publish.ts --otp 123456 # Publish with an npm one-time password
 */

import { $ } from "bun";
import { spawnSync } from "child_process";
import { existsSync, readdirSync } from "fs";
import { join } from "path";

const ROOT_DIR = join(import.meta.dir, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

async function getPackageInfo(): Promise<{ version: string }> {
  const pkg = await Bun.file(join(ROOT_DIR, "package.json")).json();
  return { version: pkg.version };
}

async function getBinaries(): Promise<Record<string, string>> {
  const binariesPath = join(DIST_DIR, "binaries.json");
  if (!existsSync(binariesPath)) {
    console.error("binaries.json not found. Run build-binaries.ts first.");
    process.exit(1);
  }
  return await Bun.file(binariesPath).json();
}

function getOtp(): string | undefined {
  const otpIndex = process.argv.indexOf("--otp");
  if (otpIndex !== -1) {
    return process.argv[otpIndex + 1];
  }

  return process.env.NPM_CONFIG_OTP ?? process.env.npm_config_otp;
}

function getPackedTarball(pkgDir: string): string {
  const tarballs = readdirSync(pkgDir)
    .filter((name) => name.endsWith(".tgz"))
    .sort();
  const tarball = tarballs.at(-1);

  if (!tarball) {
    console.error(`No packed tarball found in ${pkgDir}`);
    process.exit(1);
  }

  return tarball;
}

function publishTarball(pkgDir: string, tag: string, otp?: string): void {
  const args = ["publish", getPackedTarball(pkgDir), "--access", "public", "--tag", tag];

  if (otp) {
    args.push("--otp", otp);
  }

  const result = spawnSync("npm", args, {
    cwd: pkgDir,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`npm publish failed with exit code ${result.status ?? 1}`);
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const tagIndex = process.argv.indexOf("--tag");
  const tag = tagIndex !== -1 ? (process.argv[tagIndex + 1] ?? "latest") : "latest";
  const otp = getOtp();

  const { version } = await getPackageInfo();
  // Verify binaries.json exists (packages were built)
  await getBinaries();

  console.log(`Publishing terminal-cli v${version} with tag '${tag}'`);
  if (dryRun) {
    console.log("(dry run - no packages will be published)\n");
  } else {
    console.log("");
  }

  // Verify all packages exist
  const mainPkgDir = join(DIST_DIR, "cli");
  if (!existsSync(mainPkgDir)) {
    console.error("Main package not found. Run build-npm-packages.ts first.");
    process.exit(1);
  }

  // Get platform package directories
  const platformDirs = readdirSync(DIST_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name.startsWith("terminal-"))
    .map((d) => d.name);

  if (platformDirs.length === 0) {
    console.error("No platform packages found. Run build-binaries.ts first.");
    process.exit(1);
  }

  // Smoke test: run the binary for current platform
  const currentPlatform = process.platform === "win32" ? "windows" : process.platform;
  const currentBinaryDir = `terminal-${currentPlatform}-${process.arch}`;
  const currentBinaryPath = join(
    DIST_DIR,
    currentBinaryDir,
    "bin",
    process.platform === "win32" ? "terminal.exe" : "terminal",
  );

  if (existsSync(currentBinaryPath)) {
    console.log(`Smoke test: running ${currentBinaryDir}/bin/terminal --version`);
    try {
      await $`${currentBinaryPath} --version`;
      console.log("Smoke test passed!\n");
    } catch {
      console.error("Smoke test failed!");
      process.exit(1);
    }
  } else {
    console.log(`Skipping smoke test (no binary for ${currentPlatform}-${process.arch})\n`);
  }

  // Publish platform packages first
  console.log("Publishing platform packages...");
  for (const dirName of platformDirs) {
    const pkgDir = join(DIST_DIR, dirName);
    const pkgJsonPath = join(pkgDir, "package.json");

    if (!existsSync(pkgJsonPath)) {
      console.error(`  ${dirName}: package.json not found, skipping`);
      continue;
    }

    const pkgJson = await Bun.file(pkgJsonPath).json();
    console.log(`  ${pkgJson.name}@${pkgJson.version}`);

    if (!dryRun) {
      try {
        // Make binaries executable on Unix
        if (process.platform !== "win32") {
          await $`chmod -R 755 ${pkgDir}`.quiet();
        }
        // Pack and publish
        await $`bun pm pack`.cwd(pkgDir).quiet();
        publishTarball(pkgDir, tag, otp);
      } catch {
        // Package might already exist at this version
        console.error(`    Warning: publish failed (may already exist)`);
      }
    }
  }

  // Publish main package
  console.log("\nPublishing main package...");
  const mainPkgJson = await Bun.file(join(mainPkgDir, "package.json")).json();
  console.log(`  ${mainPkgJson.name}@${mainPkgJson.version}`);

  if (!dryRun) {
    await $`bun pm pack`.cwd(mainPkgDir).quiet();
    publishTarball(mainPkgDir, tag, otp);
  }

  console.log("\nPublish complete!");

  if (!dryRun) {
    console.log(`\nInstall with: npm install -g @terminal-api/cli@${tag}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
