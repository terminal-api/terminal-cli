import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { existsSync, rmSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

describe("config", () => {
  const testDir = join(tmpdir(), `terminal-cli-test-${Date.now()}`);

  // Store original env values
  const originalEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
    mkdirSync(testDir, { recursive: true });

    // Store and clear environment variables
    originalEnv.TERMINAL_API_KEY = process.env.TERMINAL_API_KEY;
    originalEnv.TERMINAL_CONNECTION_TOKEN = process.env.TERMINAL_CONNECTION_TOKEN;
    originalEnv.TERMINAL_BASE_URL = process.env.TERMINAL_BASE_URL;
    originalEnv.TERMINAL_ENVIRONMENT = process.env.TERMINAL_ENVIRONMENT;

    delete process.env.TERMINAL_API_KEY;
    delete process.env.TERMINAL_CONNECTION_TOKEN;
    delete process.env.TERMINAL_BASE_URL;
    delete process.env.TERMINAL_ENVIRONMENT;
  });

  afterEach(() => {
    // Restore original env values
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }

    // Clean up
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
  });

  describe("environment variables", () => {
    test("TERMINAL_API_KEY is read from environment", async () => {
      process.env.TERMINAL_API_KEY = "env-api-key";

      // Use dynamic import with cache busting
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.apiKey).toBe("env-api-key");
    });

    test("TERMINAL_CONNECTION_TOKEN is read from environment", async () => {
      process.env.TERMINAL_CONNECTION_TOKEN = "env-connection-token";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.connectionToken).toBe("env-connection-token");
    });

    test("TERMINAL_BASE_URL overrides default and file config", async () => {
      process.env.TERMINAL_BASE_URL = "https://custom.api.com";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.baseUrl).toBe("https://custom.api.com");
    });

    test("TERMINAL_ENVIRONMENT is read from environment", async () => {
      process.env.TERMINAL_ENVIRONMENT = "sandbox";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.environment).toBe("sandbox");
    });

    test("TERMINAL_BASE_URL with sandbox uses custom URL", async () => {
      process.env.TERMINAL_ENVIRONMENT = "sandbox";
      process.env.TERMINAL_BASE_URL = "https://api.sandbox.withterminal.com/tsp/v1";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.baseUrl).toBe("https://api.sandbox.withterminal.com/tsp/v1");
      expect(config.environment).toBe("sandbox");
    });
  });

  describe("default values", () => {
    test("defaults to prod environment", async () => {
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.environment).toBe("prod");
    });

    test("baseUrl is defined", async () => {
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      // Should have a baseUrl (either from file or default)
      expect(config.baseUrl).toBeDefined();
      expect(config.baseUrl).toContain("withterminal.com");
    });
  });

  describe("config file path", () => {
    test("getConfigPath returns path in home directory", async () => {
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const path = configModule.getConfigPath();

      expect(path).toContain(".terminal");
      expect(path).toContain("config.json");
    });
  });

  describe("environment precedence", () => {
    test("env API key overrides file config", async () => {
      process.env.TERMINAL_API_KEY = "env-override-key";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      // Env var should take precedence
      expect(config.apiKey).toBe("env-override-key");
    });

    test("env connection token overrides file config", async () => {
      process.env.TERMINAL_CONNECTION_TOKEN = "env-override-token";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.connectionToken).toBe("env-override-token");
    });
  });
});
