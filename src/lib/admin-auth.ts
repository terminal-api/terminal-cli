import { Buffer } from "buffer";
import { saveConfig, type Config } from "./config.ts";

const GOOGLE_OAUTH_SCOPE = "openid email profile";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const OAUTH_CALLBACK_PATH = "/oauth/callback";
const CALLBACK_TIMEOUT_MS = 5 * 60 * 1000;
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;
interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  id_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}

export interface GoogleSession {
  accessToken: string;
  refreshToken?: string;
  accessTokenExpiresAt?: string;
  email?: string;
  clientId?: string;
  clientSecret?: string;
}

function getGoogleAuthorizationUrl(): string {
  return process.env["TERMINAL_ADMIN_GOOGLE_AUTH_URL"] ?? GOOGLE_AUTH_URL;
}

function getGoogleTokenUrl(): string {
  return process.env["TERMINAL_ADMIN_GOOGLE_TOKEN_URL"] ?? GOOGLE_TOKEN_URL;
}

export function getDefaultAdminGoogleClientId(): string | undefined {
  return process.env["TERMINAL_ADMIN_GOOGLE_CLIENT_ID"];
}

export function getDefaultAdminApplicationId(): string | undefined {
  return process.env["TERMINAL_ADMIN_APPLICATION_ID"];
}

function base64UrlEncode(input: ArrayBuffer | Uint8Array): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/u, "");
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding === 0 ? normalized : normalized + "=".repeat(4 - padding);
  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2 || !parts[1]) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function createPkcePair(): Promise<{ verifier: string; challenge: string }> {
  const random = new Uint8Array(32);
  crypto.getRandomValues(random);
  const verifier = base64UrlEncode(random);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return {
    verifier,
    challenge: base64UrlEncode(digest),
  };
}

function createState(): string {
  const random = new Uint8Array(16);
  crypto.getRandomValues(random);
  return base64UrlEncode(random);
}

async function fetchGoogleTokens(
  params: Record<string, string>,
): Promise<Required<Pick<GoogleTokenResponse, "access_token">> & GoogleTokenResponse> {
  const response = await fetch(getGoogleTokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  const payload = (await response.json().catch(() => ({}))) as GoogleTokenResponse;

  if (!response.ok || !payload.access_token) {
    const detail = payload.error_description ?? payload.error ?? `HTTP ${response.status}`;
    throw new Error(`Google token exchange failed: ${detail}`);
  }

  return payload as Required<Pick<GoogleTokenResponse, "access_token">> & GoogleTokenResponse;
}

function computeExpiresAt(expiresInSeconds?: number): string | undefined {
  if (!expiresInSeconds || !Number.isFinite(expiresInSeconds)) {
    return undefined;
  }
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString();
}

function extractEmail(idToken?: string): string | undefined {
  const payload = idToken ? decodeJwtPayload(idToken) : null;
  const email = payload?.["email"];
  return typeof email === "string" ? email : undefined;
}

async function openBrowser(url: string): Promise<boolean> {
  const command =
    process.platform === "darwin"
      ? ["open", url]
      : process.platform === "win32"
        ? ["cmd", "/c", "start", "", url]
        : ["xdg-open", url];

  try {
    const proc = Bun.spawn(command, {
      stdin: "ignore",
      stdout: "ignore",
      stderr: "ignore",
    });

    return (await proc.exited) === 0;
  } catch {
    return false;
  }
}

export function isAdminFeatureEnabled(): boolean {
  return process.env["TERMINAL_ENABLE_ADMIN"] === "1";
}

export function isAdminSessionExpired(config: Pick<Config, "adminAccessTokenExpiresAt">): boolean {
  if (!config.adminAccessTokenExpiresAt) {
    return false;
  }

  const expiresAt = Date.parse(config.adminAccessTokenExpiresAt);
  if (!Number.isFinite(expiresAt)) {
    return false;
  }

  return expiresAt <= Date.now() + TOKEN_EXPIRY_BUFFER_MS;
}

export async function refreshAdminSession(
  config: Pick<
    Config,
    | "adminGoogleClientId"
    | "adminGoogleClientSecret"
    | "adminRefreshToken"
    | "profileName"
    | "authMode"
    | "adminEmail"
    | "adminApplicationId"
  >,
): Promise<GoogleSession> {
  if (!config.adminGoogleClientId || !config.adminRefreshToken) {
    throw new Error(
      "Stored admin session is incomplete. Run: terminal admin login --profile " +
        config.profileName,
    );
  }

  const payload = await fetchGoogleTokens({
    client_id: config.adminGoogleClientId,
    ...(config.adminGoogleClientSecret ? { client_secret: config.adminGoogleClientSecret } : {}),
    grant_type: "refresh_token",
    refresh_token: config.adminRefreshToken,
  });

  const session: GoogleSession = {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token ?? config.adminRefreshToken,
    accessTokenExpiresAt: computeExpiresAt(payload.expires_in),
    email: extractEmail(payload.id_token) ?? config.adminEmail,
    clientId: config.adminGoogleClientId,
    clientSecret: config.adminGoogleClientSecret,
  };

  if (!process.env["TERMINAL_ADMIN_ACCESS_TOKEN"] && !process.env["TERMINAL_ADMIN_REFRESH_TOKEN"]) {
    saveConfig(
      {
        authMode: config.authMode,
        adminAccessToken: session.accessToken,
        adminRefreshToken: session.refreshToken,
        adminAccessTokenExpiresAt: session.accessTokenExpiresAt,
        adminGoogleClientId: session.clientId,
        adminGoogleClientSecret: session.clientSecret,
        adminEmail: session.email,
        adminApplicationId: config.adminApplicationId,
      },
      config.profileName,
    );
  }

  return session;
}

export async function resolveAdminAccessToken(config: Config): Promise<GoogleSession> {
  if (!config.adminAccessToken) {
    if (!config.adminRefreshToken) {
      throw new Error(
        "Admin login is required. Run: terminal admin login" +
          (config.profileName ? ` --profile ${config.profileName}` : ""),
      );
    }

    return await refreshAdminSession(config);
  }

  if (!isAdminSessionExpired(config)) {
    return {
      accessToken: config.adminAccessToken,
      refreshToken: config.adminRefreshToken,
      accessTokenExpiresAt: config.adminAccessTokenExpiresAt,
      email: config.adminEmail,
      clientId: config.adminGoogleClientId,
      clientSecret: config.adminGoogleClientSecret,
    };
  }

  return await refreshAdminSession(config);
}

export async function loginWithGoogle(
  clientId: string,
  clientSecret?: string,
): Promise<GoogleSession & { authUrl: string }> {
  const { verifier, challenge } = await createPkcePair();
  const state = createState();

  let resolveCallback: ((code: string) => void) | undefined;
  let rejectCallback: ((error: Error) => void) | undefined;

  const callbackPromise = new Promise<string>((resolve, reject) => {
    resolveCallback = resolve;
    rejectCallback = reject;
  });

  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname !== OAUTH_CALLBACK_PATH) {
        return new Response("Not found", { status: 404 });
      }

      const responseState = url.searchParams.get("state");
      const error = url.searchParams.get("error");
      const code = url.searchParams.get("code");

      if (responseState !== state) {
        rejectCallback?.(new Error("Invalid OAuth state returned by Google"));
        return new Response("<h1>Authentication failed</h1><p>Invalid OAuth state.</p>", {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      if (error) {
        rejectCallback?.(new Error(`Google login failed: ${error}`));
        return new Response(`<h1>Authentication failed</h1><p>${error}</p>`, {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      if (!code) {
        rejectCallback?.(new Error("Google login failed: no authorization code returned"));
        return new Response("<h1>Authentication failed</h1><p>No code returned.</p>", {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      resolveCallback?.(code);

      return new Response(
        [
          "<!doctype html>",
          "<html><body>",
          "<h1>Terminal CLI authentication complete</h1>",
          "<p>You can close this window and return to the terminal.</p>",
          "<script>window.close()</script>",
          "</body></html>",
        ].join(""),
        {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        },
      );
    },
  });

  const redirectUri = `http://127.0.0.1:${server.port}${OAUTH_CALLBACK_PATH}`;
  const authUrl = new URL(getGoogleAuthorizationUrl());
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", GOOGLE_OAUTH_SCOPE);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);

  if (!(await openBrowser(authUrl.toString()))) {
    console.error("Could not open your browser automatically.");
    console.error(`Open this URL to continue admin login:\n${authUrl.toString()}`);
  }

  const timeout = setTimeout(() => {
    rejectCallback?.(new Error("Timed out waiting for Google login callback"));
  }, CALLBACK_TIMEOUT_MS);

  try {
    const code = await callbackPromise;
    const payload = await fetchGoogleTokens({
      client_id: clientId,
      ...(clientSecret ? { client_secret: clientSecret } : {}),
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });

    return {
      accessToken: payload.access_token,
      refreshToken: payload.refresh_token,
      accessTokenExpiresAt: computeExpiresAt(payload.expires_in),
      email: extractEmail(payload.id_token),
      clientId,
      clientSecret,
      authUrl: authUrl.toString(),
    };
  } finally {
    clearTimeout(timeout);
    void server.stop();
  }
}
