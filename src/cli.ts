#!/usr/bin/env bun
/**
 * Terminal CLI - A CLI for the Terminal Telematics API
 *
 * This CLI is driven by the OpenAPI spec hosted at:
 * https://api.withterminal.com/tsp/openapi
 */

import { TerminalClient, ClientError } from "./lib/client.ts";
import {
  loadConfig,
  saveConfig,
  getConfigPath,
  listProfiles,
  getProfile,
  createProfile,
  deleteProfile,
  setDefaultProfile,
  copyProfile,
} from "./lib/config.ts";
import { print, printError, printSuccess, printInfo, type OutputFormat } from "./lib/output.ts";
import { commandGroups, findCommand, type Command } from "../generated/index.ts";
import {
  generateBashCompletions,
  generateZshCompletions,
  generateFishCompletions,
} from "./lib/completions.ts";
import { startTui } from "./tui/app.ts";

interface GlobalOptions {
  format: OutputFormat;
  apiKey?: string;
  connectionToken?: string;
  profile?: string;
  all?: boolean;
}

function looksLikeNegativeNumber(value: string): boolean {
  return /^-\d+(\.\d+)?$/.test(value);
}

function isOptionValue(value: string | undefined): boolean {
  if (!value || value === "--") {
    return false;
  }
  if (!value.startsWith("-")) {
    return true;
  }
  return looksLikeNegativeNumber(value);
}

function parseArgs(args: string[]): {
  command: string[];
  options: Record<string, string | boolean>;
  positionalArgs: string[];
} {
  const options: Record<string, string | boolean> = {};
  const command: string[] = [];
  const positionalArgs: string[] = [];

  // Special handling for config/profile commands which have subcommands and positional args
  if (args[0] === "config" || args[0] === "profile") {
    command.push(args[0]);
    if (args[1]) {
      command.push(args[1]);
    }
    let parsingOptions = true;
    // Rest are positional args for config/profile
    for (let i = 2; i < args.length; i++) {
      const arg = args[i]!;
      if (parsingOptions && arg === "--") {
        parsingOptions = false;
        continue;
      }
      if (parsingOptions && arg.startsWith("-")) {
        // parse option
        if (arg.startsWith("--")) {
          const [key, value] = arg.slice(2).split("=");
          if (value !== undefined) {
            options[key!] = value;
          } else if (isOptionValue(args[i + 1])) {
            options[key!] = args[i + 1]!;
            i++;
          } else {
            options[key!] = true;
          }
        } else {
          const key = arg.slice(1);
          if (isOptionValue(args[i + 1])) {
            options[key] = args[i + 1]!;
            i++;
          } else {
            options[key] = true;
          }
        }
      } else {
        positionalArgs.push(arg);
      }
    }
    return { command, options, positionalArgs };
  }

  // Standard parsing for API commands
  let collectingCommand = true;
  let parsingOptions = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;

    if (parsingOptions && arg === "--") {
      collectingCommand = false;
      parsingOptions = false;
      continue;
    }

    if (parsingOptions && arg.startsWith("--")) {
      collectingCommand = false;
      const [key, value] = arg.slice(2).split("=");
      if (value !== undefined) {
        options[key!] = value;
      } else if (isOptionValue(args[i + 1])) {
        options[key!] = args[i + 1]!;
        i++;
      } else {
        options[key!] = true;
      }
    } else if (parsingOptions && arg.startsWith("-")) {
      collectingCommand = false;
      const key = arg.slice(1);
      if (isOptionValue(args[i + 1])) {
        options[key] = args[i + 1]!;
        i++;
      } else {
        options[key] = true;
      }
    } else if (collectingCommand) {
      command.push(arg);
    } else {
      positionalArgs.push(arg);
    }
  }

  return { command, options, positionalArgs };
}

function showHelp(): void {
  console.log(`
\x1b[1mTerminal CLI\x1b[0m - CLI for the Terminal Telematics API

\x1b[1mUSAGE:\x1b[0m
  terminal <command> [options]

\x1b[1mGLOBAL OPTIONS:\x1b[0m
  --format <format>    Output format: json, pretty, table (default: json)
  --profile <name>     Use a specific profile (or set TERMINAL_PROFILE)
  --api-key <key>      API key (or set TERMINAL_API_KEY)
  --connection-token   Connection token (or set TERMINAL_CONNECTION_TOKEN)
  --all                Auto-paginate and fetch all results
  --help, -h           Show help

\x1b[1mCONFIG COMMANDS:\x1b[0m
  config show          Show current configuration
  config set <key>     Set a config value
  config path          Show config file path

\x1b[1mPROFILE COMMANDS:\x1b[0m
  profile list         List all profiles
  profile show <name>  Show profile details
  profile create <name> Create a new profile
  profile delete <name> Delete a profile
  profile use <name>   Set default profile
  profile copy <src> <dst> Copy a profile

\x1b[1mCOMPLETIONS:\x1b[0m
  completions bash     Generate bash completions
  completions zsh      Generate zsh completions
  completions fish     Generate fish completions

\x1b[1mAPI COMMANDS:\x1b[0m`);

  for (const group of commandGroups) {
    console.log(`\n  \x1b[36m${group.name}\x1b[0m`);
    for (const cmd of group.commands) {
      const padding = 30 - cmd.name.length;
      console.log(`    ${cmd.name}${" ".repeat(Math.max(1, padding))}${cmd.description}`);
    }
  }

  console.log(`
\x1b[1mSUBCOMMANDS:\x1b[0m
  <command> schema       Show the response schema for a command

\x1b[1mEXAMPLES:\x1b[0m
  terminal config set api-key sk_prod_xxx
  terminal config set connection-token con_tkn_xxx
  terminal list-vehicles --format table
  terminal get-vehicle vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC
  terminal list-drivers --limit 10
  terminal list-vehicles schema
`);
}

function showCommandHelp(cmd: Command): void {
  console.log(`
\x1b[1m${cmd.name}\x1b[0m - ${cmd.description}

\x1b[1mUSAGE:\x1b[0m
  terminal ${cmd.name} [options]

\x1b[1mMETHOD:\x1b[0m ${cmd.method} ${cmd.path}

\x1b[1mREQUIRES CONNECTION TOKEN:\x1b[0m ${cmd.requiresConnectionToken ? "Yes" : "No"}
`);

  if (cmd.args.length > 0) {
    console.log("\x1b[1mARGUMENTS:\x1b[0m");
    for (const arg of cmd.args) {
      const required = arg.required ? " (required)" : "";
      const enumVals = arg.enum ? ` [${arg.enum.join(", ")}]` : "";
      console.log(`  --${arg.name}${required}${enumVals}`);
      if (arg.description) {
        console.log(`      ${arg.description}`);
      }
    }
  }

  console.log(`
\x1b[1mSUBCOMMANDS:\x1b[0m
  ${cmd.name} schema       Show the expected response schema

\x1b[1mGLOBAL OPTIONS:\x1b[0m
  --format <format>          Output format: json, pretty, table (default: json)
  --api-key <key>            API key override
  --connection-token <token> Connection token override
  --all                      Auto-paginate and fetch all results
  --profile <name>           Use a specific config profile
`);
}

async function handleConfigCommand(
  subcommand: string,
  args: string[],
  options: Record<string, string | boolean>,
): Promise<void> {
  const profileName = options["profile"] as string | undefined;

  switch (subcommand) {
    case "show": {
      const config = loadConfig(profileName);
      // Mask sensitive values
      const displayConfig = {
        ...config,
        apiKey: config.apiKey ? config.apiKey.slice(0, 10) + "..." : undefined,
        connectionToken: config.connectionToken
          ? config.connectionToken.slice(0, 15) + "..."
          : undefined,
      };
      console.log(JSON.stringify(displayConfig, null, 2));
      break;
    }

    case "set": {
      const key = args[0];
      const value = args[1];

      if (!key) {
        printError("Usage: terminal config set <key> <value> [--profile <name>]");
        printInfo("Available keys: api-key, connection-token, base-url, environment");
        return;
      }

      if (!value) {
        printError(`Missing value for ${key}`);
        return;
      }

      switch (key) {
        case "api-key":
          saveConfig({ apiKey: value }, profileName);
          printSuccess(`API key saved${profileName ? ` to profile '${profileName}'` : ""}`);
          break;
        case "connection-token":
          saveConfig({ connectionToken: value }, profileName);
          printSuccess(
            `Connection token saved${profileName ? ` to profile '${profileName}'` : ""}`,
          );
          break;
        case "base-url":
          saveConfig({ baseUrl: value }, profileName);
          printSuccess(`Base URL saved${profileName ? ` to profile '${profileName}'` : ""}`);
          break;
        case "environment":
          if (value !== "prod" && value !== "sandbox") {
            printError("Environment must be 'prod' or 'sandbox'");
            return;
          }
          saveConfig({ environment: value }, profileName);
          printSuccess(
            `Environment set to ${value}${profileName ? ` for profile '${profileName}'` : ""}`,
          );
          break;
        default:
          printError(`Unknown config key: ${key}`);
          printInfo("Available keys: api-key, connection-token, base-url, environment");
      }
      break;
    }

    case "path": {
      console.log(getConfigPath());
      break;
    }

    default:
      printError(`Unknown config subcommand: ${subcommand}`);
      printInfo("Available subcommands: show, set, path");
  }
}

async function handleProfileCommand(
  subcommand: string,
  args: string[],
  _options: Record<string, string | boolean>,
): Promise<void> {
  switch (subcommand) {
    case "list": {
      const profiles = listProfiles();
      for (const profile of profiles) {
        const marker = profile.isDefault ? " (default)" : "";
        console.log(`${profile.name}${marker}`);
      }
      break;
    }

    case "show": {
      const name = args[0];
      if (!name) {
        printError("Usage: terminal profile show <name>");
        return;
      }

      const profile = getProfile(name);
      if (!profile) {
        printError(`Profile '${name}' not found`);
        return;
      }

      // Mask sensitive values
      const displayProfile = {
        ...profile,
        apiKey: profile.apiKey ? profile.apiKey.slice(0, 10) + "..." : undefined,
        connectionToken: profile.connectionToken
          ? profile.connectionToken.slice(0, 15) + "..."
          : undefined,
      };
      console.log(JSON.stringify(displayProfile, null, 2));
      break;
    }

    case "create": {
      const name = args[0];
      if (!name) {
        printError("Usage: terminal profile create <name>");
        return;
      }

      if (createProfile(name)) {
        printSuccess(`Profile '${name}' created`);
        printInfo(`Set values with: terminal config set <key> <value> --profile ${name}`);
      } else {
        printError(`Profile '${name}' already exists`);
      }
      break;
    }

    case "delete": {
      const name = args[0];
      if (!name) {
        printError("Usage: terminal profile delete <name>");
        return;
      }

      if (deleteProfile(name)) {
        printSuccess(`Profile '${name}' deleted`);
      } else {
        printError(`Cannot delete profile '${name}' (doesn't exist or is default)`);
      }
      break;
    }

    case "use": {
      const name = args[0];
      if (!name) {
        printError("Usage: terminal profile use <name>");
        return;
      }

      if (setDefaultProfile(name)) {
        printSuccess(`Default profile set to '${name}'`);
      } else {
        printError(`Profile '${name}' not found`);
      }
      break;
    }

    case "copy": {
      const source = args[0];
      const target = args[1];

      if (!source || !target) {
        printError("Usage: terminal profile copy <source> <target>");
        return;
      }

      if (copyProfile(source, target)) {
        printSuccess(`Profile '${source}' copied to '${target}'`);
      } else {
        printError(`Failed to copy: source '${source}' doesn't exist or target '${target}' exists`);
      }
      break;
    }

    default:
      printError(`Unknown profile subcommand: ${subcommand}`);
      printInfo("Available subcommands: list, show, create, delete, use, copy");
  }
}

interface PaginatedResponse {
  results?: unknown[];
  next?: string;
}

function isPaginatedResponse(result: unknown): result is PaginatedResponse {
  return (
    typeof result === "object" &&
    result !== null &&
    "results" in result &&
    Array.isArray((result as PaginatedResponse).results)
  );
}

async function handleApiCommand(
  cmd: Command,
  options: Record<string, string | boolean>,
  globalOptions: GlobalOptions,
): Promise<void> {
  // Build args from options
  const args: Record<string, unknown> = {};

  for (const arg of cmd.args) {
    const value = options[arg.name];

    if (value !== undefined) {
      // Type conversion based on arg type
      switch (arg.type) {
        case "number":
          args[arg.name] = Number(value);
          break;
        case "boolean":
          args[arg.name] = value === true || value === "true";
          break;
        default:
          args[arg.name] = value;
      }
    } else if (arg.required) {
      printError(`Missing required argument: --${arg.name}`);
      showCommandHelp(cmd);
      process.exit(1);
    }
  }

  // Load config from profile, then apply CLI overrides
  const profileConfig = loadConfig(globalOptions.profile);
  const clientConfig: Record<string, string | undefined> = {
    apiKey: globalOptions.apiKey ?? profileConfig.apiKey,
    connectionToken: globalOptions.connectionToken ?? profileConfig.connectionToken,
    baseUrl: profileConfig.baseUrl,
  };

  const client = new TerminalClient(clientConfig);

  try {
    let result = await cmd.handler(client, args);

    // Auto-paginate if --all flag is set and response has pagination
    if (globalOptions.all && isPaginatedResponse(result)) {
      const allResults: unknown[] = [...(result.results ?? [])];
      let cursor = result.next;
      let pageCount = 1;
      const seenCursors = new Set<string>();
      const resultMeta = result as Record<string, unknown>;
      const showProgress = Boolean(process.stderr.isTTY);

      while (cursor) {
        if (seenCursors.has(cursor)) {
          process.stderr.write("\nPagination halted due to repeated cursor.\n");
          break;
        }
        seenCursors.add(cursor);
        pageCount++;
        if (showProgress) {
          process.stderr.write(`\rFetching page ${pageCount}...`);
        }

        const nextArgs = { ...args, cursor };
        const nextResult = await cmd.handler(client, nextArgs);

        if (isPaginatedResponse(nextResult)) {
          allResults.push(...(nextResult.results ?? []));
          cursor = nextResult.next;
        } else {
          break;
        }
      }

      if (pageCount > 1 && showProgress) {
        process.stderr.write(`\rFetched ${pageCount} pages, ${allResults.length} total results\n`);
      }

      // Return combined results without pagination cursor
      const mergedMeta = { ...resultMeta };
      delete mergedMeta.results;
      delete mergedMeta.next;
      result = { ...mergedMeta, results: allResults };
    }

    print(result, { format: globalOptions.format });
  } catch (error) {
    if (error instanceof ClientError) {
      printError(`API Error (${error.status}): ${error.error.message}`);
      if (error.error.detail) {
        console.error("Detail:", JSON.stringify(error.error.detail, null, 2));
      }
      process.exit(1);
    }
    throw error;
  }
}

async function main(): Promise<void> {
  const rawArgs = process.argv.slice(2);

  // Launch TUI if no arguments provided
  if (rawArgs.length === 0) {
    if (process.stdin.isTTY && process.stdout.isTTY) {
      await startTui();
    } else {
      showHelp();
    }
    return;
  }

  if (rawArgs[0] === "--help" || rawArgs[0] === "-h") {
    showHelp();
    return;
  }

  if (rawArgs[0] === "--version" || rawArgs[0] === "-v") {
    const { name, version } = await getCliVersion();
    console.log(`${name} ${version}`);
    return;
  }

  const { command, options, positionalArgs } = parseArgs(rawArgs);

  // Launch TUI with profile if only --profile is provided
  if (command.length === 0 && options["profile"]) {
    if (process.stdin.isTTY && process.stdout.isTTY) {
      await startTui(options["profile"] as string);
    } else {
      showHelp();
    }
    return;
  }

  // Extract global options
  const profileName = options["profile"] as string | undefined;
  const globalOptions: GlobalOptions = {
    format: (options["format"] as OutputFormat) ?? "json",
    profile: profileName,
    apiKey: options["api-key"] as string | undefined,
    connectionToken: options["connection-token"] as string | undefined,
    all: options["all"] === true,
  };

  // Handle help for specific command
  if (options["help"] || options["h"]) {
    if (command.length > 0) {
      const cmdName = command.join("-");
      const cmd = findCommand(cmdName);
      if (cmd) {
        showCommandHelp(cmd);
        return;
      }
    }
    showHelp();
    return;
  }

  if (command.length === 0) {
    showHelp();
    return;
  }

  // Handle config commands
  if (command[0] === "config") {
    const subcommand = command[1] ?? "show";
    await handleConfigCommand(subcommand, positionalArgs, options);
    process.exit(0);
  }

  // Handle profile commands
  if (command[0] === "profile") {
    const subcommand = command[1] ?? "list";
    await handleProfileCommand(subcommand, positionalArgs, options);
    process.exit(0);
  }

  // Handle completions command
  if (command[0] === "completions") {
    const shell = command[1] ?? "bash";
    switch (shell) {
      case "bash":
        console.log(generateBashCompletions());
        break;
      case "zsh":
        console.log(generateZshCompletions());
        break;
      case "fish":
        console.log(generateFishCompletions());
        break;
      default:
        printError(`Unknown shell: ${shell}`);
        printInfo("Available shells: bash, zsh, fish");
    }
    process.exit(0);
  }

  // Handle schema subcommand: <command> schema
  if (command.length >= 2 && command[command.length - 1] === "schema") {
    const cmdName = command.slice(0, -1).join("-");
    const cmd = findCommand(cmdName);
    if (cmd) {
      if (cmd.responseSchema) {
        print(cmd.responseSchema, { format: globalOptions.format });
      } else {
        printInfo(`No response schema available for '${cmdName}'`);
      }
      process.exit(0);
    }
    // Fall through to normal error handling if command not found
  }

  // Try to find API command
  // First try exact match
  let cmdName = command.join("-");
  let cmd = findCommand(cmdName);

  // If not found and we have multiple parts, try treating later parts as args
  if (!cmd && command.length > 1) {
    for (let i = command.length - 1; i >= 1; i--) {
      cmdName = command.slice(0, i).join("-");
      cmd = findCommand(cmdName);
      if (cmd) {
        // Add remaining parts as positional args for path params
        const remainingArgs = command.slice(i);
        const foundCmd = cmd;
        const pathParams = foundCmd.args.filter((a) => foundCmd.path.includes(`{${a.name}}`));
        for (let j = 0; j < remainingArgs.length && j < pathParams.length; j++) {
          options[pathParams[j]!.name] = remainingArgs[j]!;
        }
        break;
      }
    }
  }

  if (!cmd) {
    printError(`Unknown command: ${command.join(" ")}`);
    printInfo(`Run 'terminal --help' for available commands`);
    process.exit(1);
  }

  await handleApiCommand(cmd, options, globalOptions);
}

main().catch((error) => {
  printError(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function getCliVersion(): Promise<{ name: string; version: string }> {
  try {
    const pkgUrl = new URL("../package.json", import.meta.url);
    const pkgText = await Bun.file(pkgUrl).text();
    const pkg = JSON.parse(pkgText) as { name?: string; version?: string };
    return {
      name: pkg.name ?? "terminal-cli",
      version: pkg.version ?? "unknown",
    };
  } catch {
    return { name: "terminal-cli", version: "unknown" };
  }
}
