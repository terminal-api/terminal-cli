/**
 * Mock HTTP server for testing Terminal CLI
 * Uses response structures from the OpenAPI spec
 */

type BunServer = ReturnType<typeof Bun.serve>;

// Mock data based on OpenAPI spec schemas
export const mockData = {
  vehicles: [
    {
      id: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
      name: "Big Red",
      status: "active",
      sourceId: "src_123456",
      provider: "samsara",
      vin: "1HGCM82633A004352",
      make: "Peterbilt",
      model: "Model 579",
      year: 2016,
      groups: [],
      devices: [],
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
    {
      id: "vcl_02E9ARGIHWK969OCG3R8EW0OND",
      name: "Blue Thunder",
      status: "inactive",
      sourceId: "src_789012",
      provider: "geotab",
      vin: "2JGCM82633A004353",
      make: "Freightliner",
      model: "Cascadia",
      year: 2020,
      groups: ["grp_001"],
      devices: ["dvc_001"],
      createdAt: "2024-02-01T00:00:00.000Z",
      updatedAt: "2024-02-02T00:00:00.000Z",
    },
  ],

  drivers: [
    {
      id: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
      firstName: "John",
      lastName: "Doe",
      status: "active",
      sourceId: "src_drv_123",
      provider: "samsara",
      phone: "+1-555-123-4567",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  ],

  providers: [
    { code: "samsara", name: "Samsara" },
    { code: "geotab", name: "Geotab" },
    { code: "motive", name: "Motive" },
  ],

  connections: [
    {
      id: "conn_01D8ZQFGHVJ858NBF2Q7DV9MNC",
      provider: "samsara",
      status: "active",
      syncStatus: "synced",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  ],

  groups: [
    {
      id: "grp_01D8ZQFGHVJ858NBF2Q7DV9MNC",
      name: "Fleet A",
      sourceId: "src_grp_123",
      provider: "samsara",
    },
  ],
};

interface MockServerOptions {
  port?: number;
}

interface RouteHandler {
  (req: Request, params: Record<string, string>): Response;
}

interface Route {
  pattern: RegExp;
  handler: RouteHandler;
}

export function createMockServer(options: MockServerOptions = {}): BunServer {
  const port = options.port ?? 0; // 0 = random available port

  const routes: Route[] = [
    // List vehicles
    {
      pattern: /^\/tsp\/v1\/vehicles$/,
      handler: (req) => {
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get("limit") ?? "50");
        const cursor = url.searchParams.get("cursor");

        let startIndex = 0;
        if (cursor) {
          startIndex = parseInt(cursor);
        }

        const results = mockData.vehicles.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < mockData.vehicles.length;

        return Response.json({
          results,
          ...(hasMore && { next: String(startIndex + limit) }),
        });
      },
    },

    // Get vehicle by ID
    {
      pattern: /^\/tsp\/v1\/vehicles\/([^/]+)$/,
      handler: (_req, params) => {
        const vehicle = mockData.vehicles.find((v) => v.id === params.id);
        if (!vehicle) {
          return Response.json(
            { code: "not_found", message: "Vehicle not found" },
            { status: 404 },
          );
        }
        return Response.json(vehicle);
      },
    },

    // List drivers
    {
      pattern: /^\/tsp\/v1\/drivers$/,
      handler: (req) => {
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get("limit") ?? "50");
        const results = mockData.drivers.slice(0, limit);
        return Response.json({ results });
      },
    },

    // Get driver by ID
    {
      pattern: /^\/tsp\/v1\/drivers\/([^/]+)$/,
      handler: (_req, params) => {
        const driver = mockData.drivers.find((d) => d.id === params.id);
        if (!driver) {
          return Response.json({ code: "not_found", message: "Driver not found" }, { status: 404 });
        }
        return Response.json(driver);
      },
    },

    // List providers (no connection token required)
    {
      pattern: /^\/tsp\/v1\/providers$/,
      handler: () => {
        return Response.json({ results: mockData.providers });
      },
    },

    // List connections (no connection token required)
    {
      pattern: /^\/tsp\/v1\/connections$/,
      handler: () => {
        return Response.json({ results: mockData.connections });
      },
    },

    // Get current connection
    {
      pattern: /^\/tsp\/v1\/connections\/current$/,
      handler: () => {
        return Response.json(mockData.connections[0]);
      },
    },

    // List groups
    {
      pattern: /^\/tsp\/v1\/groups$/,
      handler: () => {
        return Response.json({ results: mockData.groups });
      },
    },
  ];

  const server = Bun.serve({
    port,
    fetch(req) {
      const url = new URL(req.url);
      const path = url.pathname;

      // Check authorization
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return Response.json(
          { code: "unauthorized", message: "Missing or invalid API key" },
          { status: 401 },
        );
      }

      // Check for endpoints that require connection token
      const requiresConnectionToken = !["/tsp/v1/providers", "/tsp/v1/connections"].some(
        (p) => path === p,
      );

      if (requiresConnectionToken) {
        const connectionToken = req.headers.get("Connection-Token");
        if (!connectionToken) {
          return Response.json(
            { code: "forbidden", message: "Connection token required" },
            { status: 403 },
          );
        }
      }

      // Find matching route
      for (const route of routes) {
        const match = path.match(route.pattern);
        if (match) {
          const params: Record<string, string> = {};
          if (match[1]) {
            params.id = match[1];
          }
          return route.handler(req, params);
        }
      }

      return Response.json(
        { code: "not_found", message: `Route not found: ${path}` },
        { status: 404 },
      );
    },
  });

  return server;
}

// Helper to get base URL from server
export function getServerUrl(server: BunServer): string {
  return `http://localhost:${server.port}/tsp/v1`;
}
