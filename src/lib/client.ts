import { loadConfig, type Config } from "./config.ts";

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  requiresConnectionToken?: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  detail?: unknown;
}

export class TerminalClient {
  private config: Config;

  constructor(config?: Partial<Config>) {
    this.config = { ...loadConfig(), ...config };
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const { method, path, query, body, headers = {}, requiresConnectionToken } = options;

    // Build URL with query parameters
    // Ensure base URL ends with / for proper path joining
    const baseUrl = this.config.baseUrl.endsWith("/")
      ? this.config.baseUrl
      : this.config.baseUrl + "/";
    // Remove leading slash from path if present
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(cleanPath, baseUrl);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, String(value));
        }
      }
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Add authorization
    if (!this.config.apiKey) {
      throw new Error(
        "API key is required. Set TERMINAL_API_KEY or run: terminal config set api-key <key>",
      );
    }
    requestHeaders["Authorization"] = `Bearer ${this.config.apiKey}`;

    // Add connection token if required
    if (requiresConnectionToken) {
      if (!this.config.connectionToken) {
        throw new Error(
          "Connection token is required for this endpoint. Set TERMINAL_CONNECTION_TOKEN or run: terminal config set connection-token <token>",
        );
      }
      requestHeaders["Connection-Token"] = this.config.connectionToken;
    }

    const response = await fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseText = await response.text();

    if (!response.ok) {
      let error: ApiError;
      try {
        error = JSON.parse(responseText);
      } catch {
        error = {
          code: "unknown_error",
          message: responseText || `HTTP ${response.status}`,
        };
      }
      throw new ClientError(response.status, error);
    }

    if (!responseText) {
      return {} as T;
    }

    return JSON.parse(responseText) as T;
  }

  // Helper methods for common HTTP methods
  async get<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
    requiresConnectionToken = true,
  ): Promise<T> {
    return this.request<T>({
      method: "GET",
      path,
      query,
      requiresConnectionToken,
    });
  }

  async post<T>(
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
    requiresConnectionToken = true,
  ): Promise<T> {
    return this.request<T>({
      method: "POST",
      path,
      body,
      query,
      requiresConnectionToken,
    });
  }

  async patch<T>(
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
    requiresConnectionToken = true,
  ): Promise<T> {
    return this.request<T>({
      method: "PATCH",
      path,
      body,
      query,
      requiresConnectionToken,
    });
  }

  async delete<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
    requiresConnectionToken = true,
  ): Promise<T> {
    return this.request<T>({
      method: "DELETE",
      path,
      query,
      requiresConnectionToken,
    });
  }
}

export class ClientError extends Error {
  constructor(
    public status: number,
    public error: ApiError,
  ) {
    super(error.message);
    this.name = "ClientError";
  }
}

// Default singleton client
let defaultClient: TerminalClient | null = null;

export function getClient(): TerminalClient {
  if (!defaultClient) {
    defaultClient = new TerminalClient();
  }
  return defaultClient;
}
