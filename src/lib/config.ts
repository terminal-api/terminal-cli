import { homedir } from "os";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";

export interface ProfileConfig {
  apiKey?: string;
  connectionToken?: string;
  baseUrl?: string;
  environment?: "prod" | "sandbox";
}

export interface ConfigFile {
  defaultProfile: string;
  profiles: Record<string, ProfileConfig>;
}

export interface Config {
  apiKey?: string;
  connectionToken?: string;
  baseUrl: string;
  environment: "prod" | "sandbox";
}

const CONFIG_DIR = join(homedir(), ".terminal");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const DEFAULT_PROFILE = "default";

function getBaseUrl(environment: "prod" | "sandbox"): string {
  return environment === "sandbox"
    ? "https://api.sandbox.withterminal.com/tsp/v1"
    : "https://api.withterminal.com/tsp/v1";
}

function loadConfigFile(): ConfigFile {
  if (existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as ConfigFile;
    } catch {
      // Ignore invalid config file
    }
  }

  return {
    defaultProfile: DEFAULT_PROFILE,
    profiles: { [DEFAULT_PROFILE]: {} },
  };
}

function saveConfigFile(configFile: ConfigFile): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(configFile, null, 2));
}

export function loadConfig(profileName?: string): Config {
  // Environment variables take precedence
  const envApiKey = process.env["TERMINAL_API_KEY"];
  const envConnectionToken = process.env["TERMINAL_CONNECTION_TOKEN"];
  const envBaseUrl = process.env["TERMINAL_BASE_URL"];
  const envEnvironment = process.env["TERMINAL_ENVIRONMENT"] as "prod" | "sandbox" | undefined;
  const envProfile = process.env["TERMINAL_PROFILE"];

  const configFile = loadConfigFile();
  const selectedProfile = profileName ?? envProfile ?? configFile.defaultProfile;
  const profile = configFile.profiles[selectedProfile] ?? {};

  const environment = envEnvironment ?? profile.environment ?? "prod";
  const baseUrl = envBaseUrl ?? profile.baseUrl ?? getBaseUrl(environment);

  return {
    apiKey: envApiKey ?? profile.apiKey,
    connectionToken: envConnectionToken ?? profile.connectionToken,
    baseUrl,
    environment,
  };
}

export function saveConfig(config: Partial<ProfileConfig>, profileName?: string): void {
  const configFile = loadConfigFile();
  const targetProfile = profileName ?? configFile.defaultProfile;

  if (!configFile.profiles[targetProfile]) {
    configFile.profiles[targetProfile] = {};
  }

  configFile.profiles[targetProfile] = {
    ...configFile.profiles[targetProfile],
    ...config,
  };

  saveConfigFile(configFile);
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}

// Profile management functions
export function listProfiles(): { name: string; isDefault: boolean }[] {
  const configFile = loadConfigFile();
  return Object.keys(configFile.profiles).map((name) => ({
    name,
    isDefault: name === configFile.defaultProfile,
  }));
}

export function getProfile(profileName: string): ProfileConfig | null {
  const configFile = loadConfigFile();
  return configFile.profiles[profileName] ?? null;
}

export function createProfile(profileName: string, config: ProfileConfig = {}): boolean {
  const configFile = loadConfigFile();

  if (configFile.profiles[profileName]) {
    return false; // Profile already exists
  }

  configFile.profiles[profileName] = config;
  saveConfigFile(configFile);
  return true;
}

export function deleteProfile(profileName: string): boolean {
  const configFile = loadConfigFile();

  if (profileName === configFile.defaultProfile) {
    return false; // Can't delete default profile
  }

  if (!configFile.profiles[profileName]) {
    return false; // Profile doesn't exist
  }

  delete configFile.profiles[profileName];
  saveConfigFile(configFile);
  return true;
}

export function setDefaultProfile(profileName: string): boolean {
  const configFile = loadConfigFile();

  if (!configFile.profiles[profileName]) {
    return false; // Profile doesn't exist
  }

  configFile.defaultProfile = profileName;
  saveConfigFile(configFile);
  return true;
}

export function copyProfile(sourceName: string, targetName: string): boolean {
  const configFile = loadConfigFile();

  if (!configFile.profiles[sourceName]) {
    return false; // Source doesn't exist
  }

  if (configFile.profiles[targetName]) {
    return false; // Target already exists
  }

  configFile.profiles[targetName] = { ...configFile.profiles[sourceName] };
  saveConfigFile(configFile);
  return true;
}
