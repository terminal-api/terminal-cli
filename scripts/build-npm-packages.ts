#!/usr/bin/env bun
/**
 * Generate the main npm package after binaries are built
 *
 * This creates:
 *   dist/cli/  - Main package with wrapper and postinstall script
 *
 * Platform packages are already created by build-binaries.ts
 */

import { existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";

const ROOT_DIR = join(import.meta.dir, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

async function getPackageInfo(): Promise<{
  version: string;
  description: string;
  author: string;
  license: string;
  repository: { type: string; url: string };
  homepage: string;
  bugs: { url: string };
}> {
  const pkg = await Bun.file(join(ROOT_DIR, "package.json")).json();
  return {
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    license: pkg.license,
    repository: pkg.repository,
    homepage: pkg.homepage,
    bugs: pkg.bugs,
  };
}

async function getBinaries(): Promise<Record<string, string>> {
  const binariesPath = join(DIST_DIR, "binaries.json");
  if (!existsSync(binariesPath)) {
    console.error("binaries.json not found. Run build-binaries.ts first.");
    process.exit(1);
  }
  return await Bun.file(binariesPath).json();
}

async function createMainPackage(
  pkgInfo: Awaited<ReturnType<typeof getPackageInfo>>,
  binaries: Record<string, string>,
): Promise<void> {
  const pkgDir = join(DIST_DIR, "cli");
  const binDir = join(pkgDir, "bin");

  console.log("Creating @terminal-api/cli (main package)...");

  // Create directories
  mkdirSync(binDir, { recursive: true });

  // Create the bin wrapper script (shell script that calls postinstall binary)
  const binWrapper = `#!/usr/bin/env node
const { execFileSync, spawnSync } = require("child_process");
const { existsSync } = require("fs");
const { join } = require("path");

const PLATFORMS = {
  "darwin-arm64": "@terminal-api/cli-darwin-arm64",
  "darwin-x64": "@terminal-api/cli-darwin-x64",
  "linux-x64": "@terminal-api/cli-linux-x64",
  "linux-arm64": "@terminal-api/cli-linux-arm64",
  "win32-x64": "@terminal-api/cli-windows-x64",
};

function getBinaryPath() {
  const platformKey = \`\${process.platform}-\${process.arch}\`;
  const pkg = PLATFORMS[platformKey];

  if (!pkg) {
    console.error(\`Unsupported platform: \${platformKey}\`);
    console.error("Supported platforms: " + Object.keys(PLATFORMS).join(", "));
    process.exit(1);
  }

  const binaryName = process.platform === "win32" ? "terminal.exe" : "terminal";

  // Try to find the binary in various locations
  const searchPaths = [
    // Standard node_modules location
    join(__dirname, "..", "node_modules", pkg, "bin", binaryName),
    // Hoisted dependencies
    join(__dirname, "..", "..", pkg, "bin", binaryName),
    // pnpm style
    join(__dirname, "..", "..", "..", pkg, "bin", binaryName),
    // Global install with npm
    join(__dirname, "..", "..", pkg.replace("@terminal-api/", ""), "bin", binaryName),
  ];

  for (const searchPath of searchPaths) {
    if (existsSync(searchPath)) {
      return searchPath;
    }
  }

  // Try require.resolve as last resort
  try {
    const pkgPath = require.resolve(\`\${pkg}/package.json\`);
    const binPath = join(pkgPath, "..", "bin", binaryName);
    if (existsSync(binPath)) {
      return binPath;
    }
  } catch {
    // Package not found via require.resolve
  }

  console.error(\`Could not find terminal binary for \${platformKey}\`);
  console.error("Searched paths:");
  searchPaths.forEach(p => console.error(\`  - \${p}\`));
  console.error("\\nTry reinstalling: npm install -g @terminal-api/cli");
  process.exit(1);
}

const binary = getBinaryPath();
const result = spawnSync(binary, process.argv.slice(2), {
  stdio: "inherit",
  windowsHide: true,
});

if (result.error) {
  console.error("Failed to run terminal:", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
`;

  await Bun.write(join(binDir, "terminal"), binWrapper);

  // Create postinstall script for any necessary setup
  const postinstallScript = `#!/usr/bin/env node
// Postinstall script for @terminal-api/cli
// This runs after installation to verify the binary is accessible

const { existsSync } = require("fs");
const { join } = require("path");

const PLATFORMS = {
  "darwin-arm64": "@terminal-api/cli-darwin-arm64",
  "darwin-x64": "@terminal-api/cli-darwin-x64",
  "linux-x64": "@terminal-api/cli-linux-x64",
  "linux-arm64": "@terminal-api/cli-linux-arm64",
  "win32-x64": "@terminal-api/cli-windows-x64",
};

const platformKey = \`\${process.platform}-\${process.arch}\`;
const pkg = PLATFORMS[platformKey];

if (!pkg) {
  console.warn(\`Warning: No prebuilt binary for \${platformKey}\`);
  console.warn("The terminal CLI may not work on this platform.");
  process.exit(0);
}

// Check if the platform package was installed
try {
  require.resolve(\`\${pkg}/package.json\`);
  console.log(\`terminal-cli: \${platformKey} binary installed successfully\`);
} catch {
  console.warn(\`Warning: Platform package \${pkg} not found.\`);
  console.warn("This may happen if optional dependencies were skipped.");
  console.warn("Try: npm install @terminal-api/cli --include=optional");
}
`;

  await Bun.write(join(pkgDir, "postinstall.js"), postinstallScript);

  // Create package.json for main package
  const packageJson = {
    name: "@terminal-api/cli",
    version: pkgInfo.version,
    description: pkgInfo.description,
    license: pkgInfo.license,
    author: pkgInfo.author,
    repository: pkgInfo.repository,
    homepage: pkgInfo.homepage,
    bugs: pkgInfo.bugs,
    keywords: ["terminal", "telematics", "fleet", "api", "cli", "eld", "trucking", "logistics"],
    bin: {
      terminal: "./bin/terminal",
    },
    files: ["bin", "postinstall.js"],
    scripts: {
      postinstall: "node ./postinstall.js",
    },
    optionalDependencies: binaries,
    engines: {
      node: ">=18",
    },
  };

  await Bun.write(join(pkgDir, "package.json"), JSON.stringify(packageJson, null, 2) + "\n");

  // Copy README and LICENSE
  copyFileSync(join(ROOT_DIR, "README.md"), join(pkgDir, "README.md"));
  copyFileSync(join(ROOT_DIR, "LICENSE"), join(pkgDir, "LICENSE"));

  console.log(`  -> ${pkgDir}`);
}

async function main(): Promise<void> {
  const pkgInfo = await getPackageInfo();
  const binaries = await getBinaries();

  console.log(`Building main npm package for v${pkgInfo.version}\n`);

  await createMainPackage(pkgInfo, binaries);

  console.log("\nMain package created!");
  console.log("\nTo publish all packages:");
  console.log("  bun run scripts/publish.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
