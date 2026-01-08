import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { existsSync, rmSync, readdirSync } from "fs";
import { join } from "path";

const ROOT_DIR = join(import.meta.dir, "..");
const DIST_DIR = join(ROOT_DIR, "dist");
const TEST_DIST_DIR = join(ROOT_DIR, "dist-test");

describe("build scripts", () => {
  describe("build-binaries.ts", () => {
    beforeAll(async () => {
      // Clean test dist directory
      if (existsSync(TEST_DIST_DIR)) {
        rmSync(TEST_DIST_DIR, { recursive: true });
      }
    });

    afterAll(() => {
      // Clean up test dist directory
      if (existsSync(TEST_DIST_DIR)) {
        rmSync(TEST_DIST_DIR, { recursive: true });
      }
    });

    test("builds binary for current platform with --single flag", async () => {
      const proc = Bun.spawn(
        ["bun", "run", "scripts/build-binaries.ts", "--single", "--skip-install"],
        {
          cwd: ROOT_DIR,
          env: {
            ...process.env,
          },
          stdout: "pipe",
          stderr: "pipe",
        },
      );

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain("Build complete!");
      expect(stdout).toContain(`@terminal-api/cli-`);

      // Verify binary was created for current platform
      const platform = process.platform === "win32" ? "windows" : process.platform;
      const arch = process.arch;
      const binaryDir = join(DIST_DIR, `terminal-${platform}-${arch}`);
      const binaryPath = join(
        binaryDir,
        "bin",
        process.platform === "win32" ? "terminal.exe" : "terminal",
      );

      expect(existsSync(binaryDir)).toBe(true);
      expect(existsSync(binaryPath)).toBe(true);

      // Verify package.json was created
      const pkgJsonPath = join(binaryDir, "package.json");
      expect(existsSync(pkgJsonPath)).toBe(true);

      const pkgJson = await Bun.file(pkgJsonPath).json();
      expect(pkgJson.name).toBe(`@terminal-api/cli-${platform}-${arch}`);
      expect(pkgJson.os).toEqual([process.platform]);
      expect(pkgJson.cpu).toEqual([process.arch]);
    });

    test("creates binaries.json manifest", async () => {
      const binariesPath = join(DIST_DIR, "binaries.json");
      expect(existsSync(binariesPath)).toBe(true);

      const binaries = await Bun.file(binariesPath).json();
      expect(typeof binaries).toBe("object");
      expect(Object.keys(binaries).length).toBeGreaterThan(0);

      // Each entry should have package name as key and version as value
      for (const [name, version] of Object.entries(binaries)) {
        expect(name).toMatch(/^@terminal-api\/cli-/);
        expect(typeof version).toBe("string");
        expect(version).toMatch(/^\d+\.\d+\.\d+/);
      }
    });

    test("built binary executes and shows version", async () => {
      const platform = process.platform === "win32" ? "windows" : process.platform;
      const arch = process.arch;
      const binaryPath = join(
        DIST_DIR,
        `terminal-${platform}-${arch}`,
        "bin",
        process.platform === "win32" ? "terminal.exe" : "terminal",
      );

      if (!existsSync(binaryPath)) {
        // Skip if binary doesn't exist (might be running on unsupported platform)
        return;
      }

      const proc = Bun.spawn([binaryPath, "--version"], {
        stdout: "pipe",
        stderr: "pipe",
      });

      const exitCode = await proc.exited;
      expect(exitCode).toBe(0);
    });

    test("built binary shows help", async () => {
      const platform = process.platform === "win32" ? "windows" : process.platform;
      const arch = process.arch;
      const binaryPath = join(
        DIST_DIR,
        `terminal-${platform}-${arch}`,
        "bin",
        process.platform === "win32" ? "terminal.exe" : "terminal",
      );

      if (!existsSync(binaryPath)) {
        return;
      }

      const proc = Bun.spawn([binaryPath, "--help"], {
        stdout: "pipe",
        stderr: "pipe",
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain("CLI for the Terminal Telematics API");
      expect(stdout).toContain("Commands:");
    });
  });

  describe("build-npm-packages.ts", () => {
    test("creates main package with correct structure", async () => {
      // Run build-npm-packages if dist/cli doesn't exist
      if (!existsSync(join(DIST_DIR, "cli"))) {
        const proc = Bun.spawn(["bun", "run", "scripts/build-npm-packages.ts"], {
          cwd: ROOT_DIR,
          stdout: "pipe",
          stderr: "pipe",
        });
        await proc.exited;
      }

      const cliDir = join(DIST_DIR, "cli");
      expect(existsSync(cliDir)).toBe(true);

      // Check required files exist
      expect(existsSync(join(cliDir, "package.json"))).toBe(true);
      expect(existsSync(join(cliDir, "bin", "terminal"))).toBe(true);
      expect(existsSync(join(cliDir, "postinstall.js"))).toBe(true);
      expect(existsSync(join(cliDir, "README.md"))).toBe(true);
      expect(existsSync(join(cliDir, "LICENSE"))).toBe(true);
    });

    test("main package.json has correct fields", async () => {
      const pkgJsonPath = join(DIST_DIR, "cli", "package.json");
      if (!existsSync(pkgJsonPath)) {
        return;
      }

      const pkgJson = await Bun.file(pkgJsonPath).json();

      expect(pkgJson.name).toBe("@terminal-api/cli");
      expect(pkgJson.bin).toEqual({ terminal: "./bin/terminal" });
      expect(pkgJson.scripts?.postinstall).toBe("node ./postinstall.js");
      expect(pkgJson.optionalDependencies).toBeDefined();
      expect(typeof pkgJson.optionalDependencies).toBe("object");

      // Should have at least one platform dependency
      const deps = Object.keys(pkgJson.optionalDependencies);
      expect(deps.length).toBeGreaterThan(0);
      expect(deps.every((d) => d.startsWith("@terminal-api/cli-"))).toBe(true);
    });

    test("bin wrapper script is valid node script", async () => {
      const wrapperPath = join(DIST_DIR, "cli", "bin", "terminal");
      if (!existsSync(wrapperPath)) {
        return;
      }

      const content = await Bun.file(wrapperPath).text();

      // Should be a node script
      expect(content).toContain("#!/usr/bin/env node");
      // Should have platform detection
      expect(content).toContain("process.platform");
      expect(content).toContain("process.arch");
      // Should reference platform packages
      expect(content).toContain("@terminal-api/cli-darwin-arm64");
      expect(content).toContain("@terminal-api/cli-linux-x64");
      expect(content).toContain("@terminal-api/cli-windows-x64");
    });

    test("postinstall script is valid", async () => {
      const postinstallPath = join(DIST_DIR, "cli", "postinstall.js");
      if (!existsSync(postinstallPath)) {
        return;
      }

      const content = await Bun.file(postinstallPath).text();

      // Should be a node script
      expect(content).toContain("#!/usr/bin/env node");
      // Should have platform detection
      expect(content).toContain("process.platform");
      expect(content).toContain("process.arch");
    });
  });

  describe("publish.ts dry-run", () => {
    test("dry-run completes without errors", async () => {
      // Only run if dist exists
      if (!existsSync(join(DIST_DIR, "binaries.json"))) {
        return;
      }

      const proc = Bun.spawn(["bun", "run", "scripts/publish.ts", "--dry-run"], {
        cwd: ROOT_DIR,
        stdout: "pipe",
        stderr: "pipe",
      });

      const exitCode = await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(exitCode).toBe(0);
      expect(stdout).toContain("dry run");
      expect(stdout).toContain("Publishing platform packages...");
      expect(stdout).toContain("Publishing main package...");
      expect(stdout).toContain("Publish complete!");
    });

    test("lists all platform packages in dry-run", async () => {
      if (!existsSync(join(DIST_DIR, "binaries.json"))) {
        return;
      }

      const proc = Bun.spawn(["bun", "run", "scripts/publish.ts", "--dry-run"], {
        cwd: ROOT_DIR,
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      // Should list the main package
      expect(stdout).toContain("@terminal-api/cli@");
    });
  });

  describe("release archive creation", () => {
    test("can create tar.gz for linux binaries", async () => {
      const linuxDir = readdirSync(DIST_DIR).find(
        (d) => d.startsWith("terminal-linux-") && !d.endsWith(".tar.gz"),
      );

      if (!linuxDir) {
        return; // Skip if no linux binary built
      }

      const binDir = join(DIST_DIR, linuxDir, "bin");
      if (!existsSync(binDir)) {
        return;
      }

      const archivePath = join(DIST_DIR, `${linuxDir}-test.tar.gz`);

      const proc = Bun.spawn(["tar", "-czf", archivePath, "-C", binDir, "."], {
        stdout: "pipe",
        stderr: "pipe",
      });

      const exitCode = await proc.exited;
      expect(exitCode).toBe(0);
      expect(existsSync(archivePath)).toBe(true);

      // Clean up
      rmSync(archivePath);
    });

    test("can create zip for darwin/windows binaries", async () => {
      const zipDir = readdirSync(DIST_DIR).find(
        (d) =>
          (d.startsWith("terminal-darwin-") || d.startsWith("terminal-windows-")) &&
          !d.endsWith(".zip"),
      );

      if (!zipDir) {
        return; // Skip if no darwin/windows binary built
      }

      const binDir = join(DIST_DIR, zipDir, "bin");
      if (!existsSync(binDir)) {
        return;
      }

      const archivePath = join(DIST_DIR, `${zipDir}-test.zip`);

      const proc = Bun.spawn(["zip", "-r", archivePath, "."], {
        cwd: binDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const exitCode = await proc.exited;
      expect(exitCode).toBe(0);
      expect(existsSync(archivePath)).toBe(true);

      // Clean up
      rmSync(archivePath);
    });
  });
});

describe("package.json validation", () => {
  test("has required fields for npm publishing", async () => {
    const pkgJson = await Bun.file(join(ROOT_DIR, "package.json")).json();

    expect(pkgJson.name).toBe("@terminal-api/cli");
    expect(pkgJson.version).toMatch(/^\d+\.\d+\.\d+/);
    expect(pkgJson.description).toBeDefined();
    expect(pkgJson.license).toBe("MIT");
    expect(pkgJson.author).toBeDefined();
    expect(pkgJson.repository).toBeDefined();
    expect(pkgJson.repository.url).toContain("github.com");
    expect(pkgJson.keywords).toBeInstanceOf(Array);
    expect(pkgJson.keywords.length).toBeGreaterThan(0);
  });

  test("has correct bin entry", async () => {
    const pkgJson = await Bun.file(join(ROOT_DIR, "package.json")).json();

    expect(pkgJson.bin).toBeDefined();
    expect(pkgJson.bin.terminal).toBeDefined();
  });

  test("has build scripts", async () => {
    const pkgJson = await Bun.file(join(ROOT_DIR, "package.json")).json();

    expect(pkgJson.scripts["build:binaries"]).toBeDefined();
    expect(pkgJson.scripts["build:npm"]).toBeDefined();
    expect(pkgJson.scripts["build:release"]).toBeDefined();
    expect(pkgJson.scripts["publish:npm"]).toBeDefined();
  });
});

describe("LICENSE file", () => {
  test("exists and contains MIT license", async () => {
    const licensePath = join(ROOT_DIR, "LICENSE");
    expect(existsSync(licensePath)).toBe(true);

    const content = await Bun.file(licensePath).text();
    expect(content).toContain("MIT License");
    expect(content).toContain("Permission is hereby granted");
  });
});
