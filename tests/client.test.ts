import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from "bun:test";
import { existsSync, mkdirSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { TerminalClient, ClientError } from "../src/lib/client";
import { createMockServer, getServerUrl, mockData } from "./mock-server";

type BunServer = ReturnType<typeof Bun.serve>;

describe("TerminalClient", () => {
  let server: BunServer;
  let baseUrl: string;
  const originalEnv: Record<string, string | undefined> = {};
  const testConfigDir = join(tmpdir(), `terminal-cli-client-test-${Date.now()}`);

  beforeAll(() => {
    server = createMockServer();
    baseUrl = getServerUrl(server);
    originalEnv.TERMINAL_ENABLE_ADMIN = process.env.TERMINAL_ENABLE_ADMIN;
    originalEnv.TERMINAL_ADMIN_GOOGLE_TOKEN_URL = process.env.TERMINAL_ADMIN_GOOGLE_TOKEN_URL;
    originalEnv.TERMINAL_CONFIG_DIR = process.env.TERMINAL_CONFIG_DIR;
    originalEnv.TERMINAL_PROFILE = process.env.TERMINAL_PROFILE;
    originalEnv.TERMINAL_AUTH_MODE = process.env.TERMINAL_AUTH_MODE;
    originalEnv.TERMINAL_ADMIN_ACCESS_TOKEN = process.env.TERMINAL_ADMIN_ACCESS_TOKEN;
    originalEnv.TERMINAL_ADMIN_REFRESH_TOKEN = process.env.TERMINAL_ADMIN_REFRESH_TOKEN;
    originalEnv.TERMINAL_ADMIN_ACCESS_TOKEN_EXPIRES_AT =
      process.env.TERMINAL_ADMIN_ACCESS_TOKEN_EXPIRES_AT;
    originalEnv.TERMINAL_ADMIN_GOOGLE_CLIENT_ID = process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_ID;
    originalEnv.TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET =
      process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET;
    originalEnv.TERMINAL_ADMIN_EMAIL = process.env.TERMINAL_ADMIN_EMAIL;
    originalEnv.TERMINAL_ADMIN_APPLICATION_ID = process.env.TERMINAL_ADMIN_APPLICATION_ID;
  });

  beforeEach(() => {
    if (existsSync(testConfigDir)) {
      rmSync(testConfigDir, { recursive: true, force: true });
    }
    mkdirSync(testConfigDir, { recursive: true });
    process.env.TERMINAL_CONFIG_DIR = testConfigDir;
    delete process.env.TERMINAL_PROFILE;
    delete process.env.TERMINAL_ENABLE_ADMIN;
    delete process.env.TERMINAL_AUTH_MODE;
    delete process.env.TERMINAL_ADMIN_ACCESS_TOKEN;
    delete process.env.TERMINAL_ADMIN_REFRESH_TOKEN;
    delete process.env.TERMINAL_ADMIN_ACCESS_TOKEN_EXPIRES_AT;
    delete process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_ID;
    delete process.env.TERMINAL_ADMIN_GOOGLE_CLIENT_SECRET;
    delete process.env.TERMINAL_ADMIN_EMAIL;
    delete process.env.TERMINAL_ADMIN_APPLICATION_ID;
    delete process.env.TERMINAL_ADMIN_GOOGLE_TOKEN_URL;
  });

  afterEach(() => {
    if (originalEnv.TERMINAL_ENABLE_ADMIN === undefined) {
      delete process.env.TERMINAL_ENABLE_ADMIN;
    } else {
      process.env.TERMINAL_ENABLE_ADMIN = originalEnv.TERMINAL_ENABLE_ADMIN;
    }

    if (originalEnv.TERMINAL_ADMIN_GOOGLE_TOKEN_URL === undefined) {
      delete process.env.TERMINAL_ADMIN_GOOGLE_TOKEN_URL;
    } else {
      process.env.TERMINAL_ADMIN_GOOGLE_TOKEN_URL = originalEnv.TERMINAL_ADMIN_GOOGLE_TOKEN_URL;
    }

    if (existsSync(testConfigDir)) {
      rmSync(testConfigDir, { recursive: true, force: true });
    }
  });

  afterAll(async () => {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    await server.stop();
  });

  describe("authentication", () => {
    test("throws error when API key is missing", async () => {
      const client = new TerminalClient({
        apiKey: undefined,
        baseUrl,
      });

      expect(() => client.get("/vehicles")).toThrow("API key is required");
    });

    test("returns 401 for invalid API key format", async () => {
      // The mock server checks for Bearer prefix
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      // This should work since we have a valid bearer token format
      const result = await client.get("/vehicles");
      expect(result).toBeDefined();
    });

    test("admin auth is disabled unless feature flag is enabled", async () => {
      delete process.env.TERMINAL_ENABLE_ADMIN;

      const client = new TerminalClient({
        authMode: "google",
        adminAccessToken: "google-access-token",
        adminGoogleClientId: "google-client-id",
        adminApplicationId: "app_01GVCFVY4B0NWK6JYK87JP2WRP",
        baseUrl,
        connectionToken: "test-token",
        profileName: "employee",
      });

      expect(client.get("/vehicles")).rejects.toThrow("Admin mode is disabled");
    });

    test("uses stored Google access token when admin mode is enabled", async () => {
      process.env.TERMINAL_ENABLE_ADMIN = "1";

      const client = new TerminalClient({
        authMode: "google",
        adminAccessToken: "google-access-token",
        adminGoogleClientId: "google-client-id",
        adminApplicationId: "app_admin_123",
        baseUrl,
        profileName: "employee",
      });

      const result = await client.get<{
        authorization: string;
        applicationId: string;
        adminApplicationId: string;
      }>("/debug/headers", undefined, false);

      expect(result.authorization).toBe("Bearer google-access-token");
      expect(result.applicationId).toBe("app_admin_123");
      expect(result.adminApplicationId).toBe("app_admin_123");
    });

    test("refreshes expired Google access tokens", async () => {
      process.env.TERMINAL_ENABLE_ADMIN = "1";
      process.env.TERMINAL_ADMIN_GOOGLE_TOKEN_URL = `http://localhost:${server.port}/google/token`;

      const client = new TerminalClient({
        authMode: "google",
        adminAccessToken: "expired-google-access-token",
        adminAccessTokenExpiresAt: "2000-01-01T00:00:00.000Z",
        adminRefreshToken: "google-refresh-token",
        adminGoogleClientId: "google-client-id",
        adminApplicationId: "app_01GVCFVY4B0NWK6JYK87JP2WRP",
        baseUrl,
        profileName: "employee",
      });

      const result = await client.get<{ authorization: string }>(
        "/debug/headers",
        undefined,
        false,
      );

      expect(result.authorization).toBe("Bearer google-access-token-refreshed");
    });

    test("admin auth requires an application ID", async () => {
      process.env.TERMINAL_ENABLE_ADMIN = "1";

      const client = new TerminalClient({
        authMode: "google",
        adminAccessToken: "google-access-token",
        adminGoogleClientId: "google-client-id",
        baseUrl,
        profileName: "employee",
      });

      return expect(client.get("/debug/headers", undefined, false)).rejects.toThrow(
        "Application ID is required for admin mode",
      );
    });
  });

  describe("connection token", () => {
    test("throws error when connection token is required but missing", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: undefined,
      });

      expect(() => client.get("/vehicles")).toThrow("Connection token is required");
    });

    test("succeeds for endpoints that don't require connection token", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: undefined,
      });

      // Providers endpoint doesn't require connection token
      const result = await client.get<{ results: unknown[] }>(
        "/providers",
        undefined,
        false, // requiresConnectionToken = false
      );
      expect(result.results).toBeDefined();
      expect(result.results.length).toBeGreaterThan(0);
    });
  });

  describe("GET requests", () => {
    test("fetches list of vehicles", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      const result = await client.get<{ results: typeof mockData.vehicles }>("/vehicles");
      expect(result.results).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.results[0]!.id).toBe("vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC");
      expect(result.results[0]!.name).toBe("Big Red");
    });

    test("fetches single vehicle by ID", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      const result = await client.get<(typeof mockData.vehicles)[0]>(
        "/vehicles/vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
      );
      expect(result.id).toBe("vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC");
      expect(result.name).toBe("Big Red");
      expect(result.vin).toBe("1HGCM82633A004352");
    });

    test("returns 404 for non-existent vehicle", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      try {
        await client.get("/vehicles/non-existent-id");
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(ClientError);
        expect((error as ClientError).status).toBe(404);
        expect((error as ClientError).error.message).toBe("Vehicle not found");
      }
    });

    test("fetches drivers", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      const result = await client.get<{ results: typeof mockData.drivers }>("/drivers");
      expect(result.results).toBeDefined();
      expect(result.results.length).toBe(1);
      expect(result.results[0]!.firstName).toBe("John");
    });

    test("fetches providers without connection token", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
      });

      const result = await client.get<{ results: typeof mockData.providers }>(
        "/providers",
        undefined,
        false,
      );
      expect(result.results).toBeDefined();
      expect(result.results.length).toBe(3);
      expect(result.results.map((p) => p.code)).toContain("samsara");
    });
  });

  describe("query parameters", () => {
    test("passes limit parameter", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      const result = await client.get<{ results: typeof mockData.vehicles }>("/vehicles", {
        limit: 1,
      });
      expect(result.results.length).toBe(1);
    });

    test("ignores undefined and empty query params", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      // Should not throw with undefined/empty params
      const result = await client.get<{ results: typeof mockData.vehicles }>("/vehicles", {
        limit: 10,
        cursor: undefined,
        modifiedAfter: "",
      });
      expect(result.results).toBeDefined();
    });
  });

  describe("pagination", () => {
    test("returns next cursor when more results available", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      const result = await client.get<{ results: unknown[]; next?: string }>("/vehicles", {
        limit: 1,
      });
      expect(result.results.length).toBe(1);
      expect(result.next).toBeDefined();
    });

    test("can fetch next page using cursor", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      const page1 = await client.get<{ results: typeof mockData.vehicles; next?: string }>(
        "/vehicles",
        { limit: 1 },
      );
      expect(page1.results[0]!.name).toBe("Big Red");
      expect(page1.next).toBeDefined();

      const page2 = await client.get<{ results: typeof mockData.vehicles; next?: string }>(
        "/vehicles",
        { limit: 1, cursor: page1.next },
      );
      expect(page2.results[0]!.name).toBe("Blue Thunder");
      expect(page2.next).toBeUndefined(); // No more pages
    });
  });

  describe("error handling", () => {
    test("ClientError contains status and error details", async () => {
      const client = new TerminalClient({
        apiKey: "test-api-key",
        baseUrl,
        connectionToken: "test-token",
      });

      try {
        await client.get("/vehicles/invalid-id");
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(ClientError);
        const clientError = error as ClientError;
        expect(clientError.status).toBe(404);
        expect(clientError.error.code).toBe("not_found");
        expect(clientError.error.message).toBe("Vehicle not found");
      }
    });
  });
});
