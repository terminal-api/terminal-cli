import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";

export interface Config {
  apiKey?: string;
  connectionToken?: string;
  baseUrl: string;
  environment: "prod" | "sandbox";
}

const CONFIG_DIR = join(homedir(), ".terminal");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

function getBaseUrl(environment: "prod" | "sandbox"): string {
  return environment === "sandbox"
    ? "https://api.sandbox.withterminal.com/tsp/v1"
    : "https://api.withterminal.com/tsp/v1";
}

export function loadConfig(): Config {
  // Environment variables take precedence
  const envApiKey = process.env["TERMINAL_API_KEY"];
  const envConnectionToken = process.env["TERMINAL_CONNECTION_TOKEN"];
  const envBaseUrl = process.env["TERMINAL_BASE_URL"];
  const envEnvironment = process.env["TERMINAL_ENVIRONMENT"] as
    | "prod"
    | "sandbox"
    | undefined;

  let fileConfig: Partial<Config> = {};

  if (existsSync(CONFIG_FILE)) {
    try {
      fileConfig = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
    } catch {
      // Ignore invalid config file
    }
  }

  const environment = envEnvironment ?? fileConfig.environment ?? "prod";
  const baseUrl = envBaseUrl ?? fileConfig.baseUrl ?? getBaseUrl(environment);

  return {
    apiKey: envApiKey ?? fileConfig.apiKey,
    connectionToken: envConnectionToken ?? fileConfig.connectionToken,
    baseUrl,
    environment,
  };
}

export function saveConfig(config: Partial<Config>): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  const existingConfig = loadConfig();
  const newConfig = { ...existingConfig, ...config };

  writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
