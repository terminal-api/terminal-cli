import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { createMockServer, getServerUrl } from "./mock-server";

type BunServer = ReturnType<typeof Bun.serve>;

describe("CLI", () => {
  let server: BunServer;
  let baseUrl: string;
  const testConfigDir = join(tmpdir(), `terminal-cli-cli-test-${Date.now()}`);

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

  describe("help and version", () => {
    test("--help shows usage", async () => {
      const { stdout, exitCode } = await runCli(["--help"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("CLI for the Terminal Telematics API");
      expect(stdout).toContain("Usage:");
      expect(stdout).toContain("Options:");
      expect(stdout).toContain("API COMMANDS:");
      expect(stdout).not.toContain("admin");
    });

    test("-h also shows help", async () => {
      const { stdout, exitCode } = await runCli(["-h"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("CLI for the Terminal Telematics API");
    });

    test("--version shows version", async () => {
      const { stdout, exitCode } = await runCli(["--version"]);

      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    test("-v also shows version", async () => {
      const { stdout, exitCode } = await runCli(["-v"]);

      expect(exitCode).toBe(0);
      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });
  });

  describe("config commands", () => {
    test("config show displays configuration", async () => {
      const { stdout, exitCode } = await runCli(["config", "show"]);

      expect(exitCode).toBe(0);
      // Should mask the API key
      expect(stdout).toContain("apiKey");
    });

    test("profile show masks short secrets without exposing them", async () => {
      const profileName = "short-secret";

      let result = await runCli(["profile", "create", profileName]);
      expect(result.exitCode).toBe(0);

      result = await runCli(["config", "set", "api-key", "abc", "--profile", profileName]);
      expect(result.exitCode).toBe(0);

      const { stdout, exitCode } = await runCli(["profile", "show", profileName]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain('"apiKey": "***"');
      expect(stdout).not.toContain('"apiKey": "abc..."');
    });

    test("config path shows config file path", async () => {
      const { stdout, exitCode } = await runCli(["config", "path"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain(testConfigDir);
      expect(stdout).toContain("config.json");
    });
  });

  describe("completions", () => {
    test("completions bash generates bash completions", async () => {
      const { stdout, exitCode } = await runCli(["completions", "bash"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("_terminal_completions");
      expect(stdout).toContain("complete -F");
    });

    test("completions zsh generates zsh completions", async () => {
      const { stdout, exitCode } = await runCli(["completions", "zsh"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("#compdef terminal");
      expect(stdout).toContain("_terminal");
    });

    test("completions fish generates fish completions", async () => {
      const { stdout, exitCode } = await runCli(["completions", "fish"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("complete -c terminal");
    });
  });

  describe("API commands", () => {
    test("list-vehicles returns vehicles", async () => {
      const { stdout, exitCode } = await runCli(["list-vehicles"]);

      expect(exitCode).toBe(0);
      const response = JSON.parse(stdout);
      expect(response.results).toBeDefined();
      expect(response.results.length).toBeGreaterThan(0);
      expect(response.results[0].id).toContain("vcl_");
    });

    test("list-vehicles with --limit", async () => {
      const { stdout, exitCode } = await runCli(["list-vehicles", "--limit", "1"]);

      expect(exitCode).toBe(0);
      const response = JSON.parse(stdout);
      expect(response.results.length).toBe(1);
    });

    test("get-vehicle returns single vehicle", async () => {
      const { stdout, exitCode } = await runCli([
        "get-vehicle",
        "--id",
        "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
      ]);

      expect(exitCode).toBe(0);
      const vehicle = JSON.parse(stdout);
      expect(vehicle.id).toBe("vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC");
      expect(vehicle.name).toBe("Big Red");
    });

    test("list-drivers returns drivers", async () => {
      const { stdout, exitCode } = await runCli(["list-drivers"]);

      expect(exitCode).toBe(0);
      const response = JSON.parse(stdout);
      expect(response.results).toBeDefined();
      expect(response.results[0].firstName).toBe("John");
    });

    test("list-providers works without connection token", async () => {
      const { stdout, exitCode } = await runCli(["list-providers"], {
        TERMINAL_CONNECTION_TOKEN: "", // Clear connection token
      });

      expect(exitCode).toBe(0);
      const response = JSON.parse(stdout);
      expect(response.results).toBeDefined();
      expect(response.results.length).toBeGreaterThan(0);
    });

    test("list-groups returns groups", async () => {
      const { stdout, exitCode } = await runCli(["list-groups"]);

      expect(exitCode).toBe(0);
      const response = JSON.parse(stdout);
      expect(response.results).toBeDefined();
    });

    test("update-current-connection parses object arguments as JSON", async () => {
      const filters = {
        vehicles: {
          includeIds: ["vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC"],
        },
        drivers: {
          includeIds: ["drv_01D8ZQFGHVJ858NBF2Q7DV9MNC"],
        },
      };

      const { stdout, exitCode } = await runCli([
        "update-current-connection",
        "--filters",
        JSON.stringify(filters),
      ]);

      expect(exitCode).toBe(0);
      const response = JSON.parse(stdout);
      expect(response.filters).toEqual(filters);
    });
  });

  describe("output formats", () => {
    test("--format json outputs JSON (default)", async () => {
      const { stdout, exitCode } = await runCli(["list-vehicles", "--format", "json"]);

      expect(exitCode).toBe(0);
      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
    });

    test("--format pretty outputs colored output", async () => {
      const { stdout, exitCode } = await runCli(["list-vehicles", "--format", "pretty"]);

      expect(exitCode).toBe(0);
      // Pretty format includes the data
      expect(stdout).toContain("results");
    });

    test("--format table outputs table", async () => {
      const { stdout, exitCode } = await runCli(["list-vehicles", "--format", "table"]);

      expect(exitCode).toBe(0);
      // Table should have headers
      expect(stdout.length).toBeGreaterThan(0);
    });
  });

  describe("error handling", () => {
    test("unknown command shows error", async () => {
      const { stderr, exitCode } = await runCli(["unknown-command"]);

      expect(exitCode).toBe(1);
      expect(stderr).toContain("unknown command");
    });

    test("missing required argument shows error", async () => {
      const { stderr, exitCode } = await runCli(["get-vehicle"]); // Missing --id

      expect(exitCode).toBe(1);
      expect(stderr).toContain("Missing required argument");
    });

    test("API error is displayed", async () => {
      const { stderr, exitCode } = await runCli(["get-vehicle", "--id", "non-existent-vehicle"]);

      expect(exitCode).toBe(1);
      expect(stderr).toContain("API Error");
      expect(stderr).toContain("404");
    });
  });

  describe("command help", () => {
    test("command --help shows command details", async () => {
      const { stdout, exitCode } = await runCli(["list-vehicles", "--help"]);

      expect(exitCode).toBe(0);
      expect(stdout).toContain("list-vehicles");
      expect(stdout).toContain("List Vehicles");
      expect(stdout).toContain("--cursor");
      expect(stdout).toContain("--limit");
    });
  });

  describe("admin feature flag", () => {
    test("admin commands are exposed when enabled", async () => {
      const { stdout, exitCode } = await runCli(["--help"], {
        TERMINAL_ENABLE_ADMIN: "1",
      });

      expect(exitCode).toBe(0);
      expect(stdout).toContain("admin");
      expect(stdout).toContain("terminal admin login");
    });

    test("admin login help is available when enabled", async () => {
      const { stdout, exitCode } = await runCli(["admin", "login", "--help"], {
        TERMINAL_ENABLE_ADMIN: "1",
      });

      expect(exitCode).toBe(0);
      expect(stdout).toContain("Sign in with Google");
      expect(stdout).toContain("--client-id");
      expect(stdout).toContain("--application-id");
    });

    test("admin commands use the configured default profile", async () => {
      const profileName = "employee-default";

      let result = await runCli(["profile", "create", profileName]);
      expect(result.exitCode).toBe(0);

      result = await runCli(
        ["config", "set", "application-id", "app_test_employee", "--profile", profileName],
        {
          TERMINAL_ENABLE_ADMIN: "1",
        },
      );
      expect(result.exitCode).toBe(0);

      result = await runCli(["profile", "use", profileName]);
      expect(result.exitCode).toBe(0);

      const { stdout, exitCode } = await runCli(["admin", "whoami"], {
        TERMINAL_ENABLE_ADMIN: "1",
      });

      expect(exitCode).toBe(0);
      expect(stdout).toContain(`"profileName": "${profileName}"`);
      expect(stdout).toContain('"adminApplicationId": "app_test_employee"');
    });
  });
});
