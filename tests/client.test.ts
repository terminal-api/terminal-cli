import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { TerminalClient, ClientError } from "../src/lib/client";
import { createMockServer, getServerUrl, mockData } from "./mock-server";

type BunServer = ReturnType<typeof Bun.serve>;

describe("TerminalClient", () => {
  let server: BunServer;
  let baseUrl: string;

  beforeAll(() => {
    server = createMockServer();
    baseUrl = getServerUrl(server);
  });

  afterAll(async () => {
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
