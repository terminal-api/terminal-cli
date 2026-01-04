import { loadConfig, type Config } from "./config.ts";

export interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  requiresConnectionToken?: boolean;
  timeoutMs?: number;
  maxRetries?: number;
  retryOn?: number[];
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
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    const retryOn = new Set(options.retryOn ?? DEFAULT_RETRY_STATUS);
    const shouldRetry = RETRYABLE_METHODS.has(method);

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

    const bodyText = body ? JSON.stringify(body) : undefined;
    let lastError: unknown;

    const attempts = shouldRetry ? maxRetries + 1 : 1;
    for (let attempt = 0; attempt < attempts; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      let response: Response;
      try {
        response = await fetch(url.toString(), {
          method,
          headers: requestHeaders,
          body: bodyText,
          signal: controller.signal,
        });
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error;

        if (attempt < attempts - 1 && shouldRetry) {
          await sleep(getRetryDelayMs(attempt));
          continue;
        }

        if (isAbortError(error)) {
          throw new Error(`Request timed out after ${timeoutMs}ms`);
        }

        throw error;
      }

      clearTimeout(timeoutId);

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
        const clientError = new ClientError(response.status, error);
        lastError = clientError;

        if (attempt < attempts - 1 && retryOn.has(response.status)) {
          const retryAfterHeader = response.headers.get("Retry-After");
          const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : Number.NaN;
          const retryAfterMs = Number.isFinite(retryAfterSeconds)
            ? retryAfterSeconds * 1000
            : undefined;
          const delayMs = Math.max(getRetryDelayMs(attempt), retryAfterMs ?? 0);
          await sleep(delayMs);
          continue;
        }

        throw clientError;
      }

      if (!responseText) {
        return {} as T;
      }

      try {
        return JSON.parse(responseText) as T;
      } catch {
        throw new Error("Failed to parse JSON response");
      }
    }

    throw lastError;
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

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_STATUS = [408, 429, 500, 502, 503, 504];
const RETRYABLE_METHODS = new Set<RequestOptions["method"]>(["GET", "PUT", "DELETE"]);

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const name = "name" in error ? String((error as { name?: string }).name) : "";
  return name === "AbortError";
}

function getRetryDelayMs(attempt: number): number {
  const baseDelayMs = 300;
  const maxDelayMs = 2_000;
  const exponentialDelay = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
  const jitter = Math.random() * exponentialDelay * 0.2;
  return Math.round(exponentialDelay + jitter);
}

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
