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
    originalEnv.TERMINAL_CONFIG_DIR = process.env.TERMINAL_CONFIG_DIR;
    originalEnv.TERMINAL_ADMIN_ACCESS_TOKEN = process.env.TERMINAL_ADMIN_ACCESS_TOKEN;
    originalEnv.TERMINAL_ADMIN_REFRESH_TOKEN = process.env.TERMINAL_ADMIN_REFRESH_TOKEN;
    originalEnv.TERMINAL_ADMIN_ACCESS_TOKEN_EXPIRES_AT =
      process.env.TERMINAL_ADMIN_ACCESS_TOKEN_EXPIRES_AT;
    originalEnv.TERMINAL_ADMIN_GOOGLE_CLIENT_ID = process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_ID;
    originalEnv.TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET =
      process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET;
    originalEnv.TERMINAL_ADMIN_EMAIL = process.env.TERMINAL_ADMIN_EMAIL;
    originalEnv.TERMINAL_ADMIN_APPLICATION_ID = process.env.TERMINAL_ADMIN_APPLICATION_ID;

    delete process.env.TERMINAL_API_KEY;
    delete process.env.TERMINAL_CONNECTION_TOKEN;
    delete process.env.TERMINAL_BASE_URL;
    delete process.env.TERMINAL_ENVIRONMENT;
    delete process.env.TERMINAL_ADMIN_ACCESS_TOKEN;
    delete process.env.TERMINAL_ADMIN_REFRESH_TOKEN;
    delete process.env.TERMINAL_ADMIN_ACCESS_TOKEN_EXPIRES_AT;
    delete process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_ID;
    delete process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET;
    delete process.env.TERMINAL_ADMIN_EMAIL;
    delete process.env.TERMINAL_ADMIN_APPLICATION_ID;

    // Use test directory for config to avoid reading real user config
    process.env.TERMINAL_CONFIG_DIR = testDir;
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

    test("TERMINAL_ENVIRONMENT sets sandbox baseUrl", async () => {
      process.env.TERMINAL_ENVIRONMENT = "sandbox";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.baseUrl).toBe("https://api.sandbox.withterminal.com/tsp/v1");
    });

    test("TERMINAL_BASE_URL overrides TERMINAL_ENVIRONMENT", async () => {
      process.env.TERMINAL_ENVIRONMENT = "sandbox";
      process.env.TERMINAL_BASE_URL = "https://custom.api.com";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.baseUrl).toBe("https://custom.api.com");
    });
  });

  describe("default values", () => {
    test("baseUrl defaults to production URL", async () => {
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      // Should default to production URL when no config exists
      expect(config.baseUrl).toBe("https://api.withterminal.com/tsp/v1");
    });

    test("authMode defaults to api-key", async () => {
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.authMode).toBe("api-key");
    });
  });

  describe("config file path", () => {
    test("getConfigPath returns config.json path", async () => {
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const path = configModule.getConfigPath();

      expect(path).toContain("config.json");
    });

    test("getConfigPath respects TERMINAL_CONFIG_DIR", async () => {
      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const path = configModule.getConfigPath();

      // Should use the test directory we set in beforeEach
      expect(path).toContain(testDir);
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

    test("admin env vars do not switch auth mode by themselves", async () => {
      process.env.TERMINAL_ADMIN_ACCESS_TOKEN = "google-access-token";
      process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_ID = "google-client-id";
      process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET = "google-client-secret";
      process.env.TERMINAL_ADMIN_APPLICATION_ID = "app_admin_123";

      const configModule = await import(`../src/lib/config.ts?t=${Date.now()}`);
      const config = configModule.loadConfig();

      expect(config.authMode).toBe("api-key");
      expect(config.adminAccessToken).toBe("google-access-token");
      expect(config.adminGoogleClientId).toBe("google-client-id");
      expect(config.adminGoogleClientSecret).toBe("google-client-secret");
      expect(config.adminApplicationId).toBe("app_admin_123");
    });
  });
});
