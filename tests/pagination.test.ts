import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createMockServer, getServerUrl } from "./mock-server";

type BunServer = ReturnType<typeof Bun.serve>;

describe("--all pagination flag", () => {
  let server: BunServer;
  let baseUrl: string;
  const testConfigDir = join(tmpdir(), `terminal-cli-pagination-test-${Date.now()}`);

  beforeAll(() => {
    mkdirSync(testConfigDir, { recursive: true });
    server = createMockServer();
    baseUrl = getServerUrl(server);
  });

  afterAll(async () => {
    await server.stop();
    rmSync(testConfigDir, { recursive: true, force: true });
  });

  async function runCli(
    args: string[],
    env: Record<string, string> = {},
  ): Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
  }> {
    const childEnv: Record<string, string | undefined> = {
      ...process.env,
      TERMINAL_API_KEY: "test-api-key",
      TERMINAL_CONNECTION_TOKEN: "test-token",
      TERMINAL_BASE_URL: baseUrl,
      TERMINAL_CONFIG_DIR: testConfigDir,
      TERMINAL_PROFILE: "",
      TERMINAL_ENABLE_ADMIN: "",
      TERMINAL_AUTH_MODE: "",
      TERMINAL_ADMIN_ACCESS_TOKEN: "",
      TERMINAL_ADMIN_REFRESH_TOKEN: "",
      TERMINAL_ADMIN_ACCESS_TOKEN_EXPIRES_AT: "",
      TERMINAL_ADMIN_GOOGLE_CLIENT_ID: "",
      TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET: "",
      TERMINAL_ADMIN_EMAIL: "",
      TERMINAL_ADMIN_APPLICATION_ID: "",
      ...env,
    };

    for (const [key, value] of Object.entries(childEnv)) {
      if (value === "") {
        delete childEnv[key];
      }
    }

    const proc = Bun.spawn(["bun", "run", "src/cli.ts", ...args], {
      cwd: import.meta.dir + "/..",
      env: childEnv,
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    return { stdout, stderr, exitCode };
  }

  test("fetches single page without --all", async () => {
    const { stdout, exitCode } = await runCli(["list-vehicles", "--limit", "1"]);

    expect(exitCode).toBe(0);
    const response = JSON.parse(stdout);
    expect(response.results).toBeDefined();
    expect(response.results.length).toBe(1);
    // Should have pagination cursor when not using --all
    expect(response.next).toBeDefined();
  });

  test("fetches all pages with --all flag", async () => {
    const { stdout, exitCode } = await runCli(["list-vehicles", "--limit", "1", "--all"]);

    expect(exitCode).toBe(0);
    const response = JSON.parse(stdout);
    expect(response.results).toBeDefined();
    // Should have fetched all vehicles (mock has 2)
    expect(response.results.length).toBe(2);
    // Should not have pagination cursor after fetching all
    expect(response.next).toBeUndefined();
  });

  test("--all works with list-drivers", async () => {
    const { stdout, exitCode } = await runCli(["list-drivers", "--all"]);

    expect(exitCode).toBe(0);
    const response = JSON.parse(stdout);
    expect(response.results).toBeDefined();
    expect(response.results.length).toBeGreaterThan(0);
  });

  test("--all combined with --format table", async () => {
    const { stdout, exitCode } = await runCli([
      "list-vehicles",
      "--limit",
      "1",
      "--all",
      "--format",
      "table",
    ]);

    expect(exitCode).toBe(0);
    // Table output should contain both vehicles
    expect(stdout).toContain("Big Red");
    expect(stdout).toContain("Blue Thunder");
  });

  test("--all combined with --format pretty", async () => {
    const { stdout, exitCode } = await runCli([
      "list-vehicles",
      "--limit",
      "1",
      "--all",
      "--format",
      "pretty",
    ]);

    expect(exitCode).toBe(0);
    // Pretty output should contain both vehicles
    expect(stdout).toContain("Big Red");
    expect(stdout).toContain("Blue Thunder");
  });

  test("--all has no effect on non-paginated endpoints", async () => {
    const { stdout, exitCode } = await runCli([
      "get-vehicle",
      "--id",
      "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
      "--all",
    ]);

    expect(exitCode).toBe(0);
    const response = JSON.parse(stdout);
    // Should return single vehicle, not an array
    expect(response.id).toBe("vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC");
    expect(response.results).toBeUndefined();
  });
});
