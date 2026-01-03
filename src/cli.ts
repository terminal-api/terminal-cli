#!/usr/bin/env bun
/**
 * Terminal CLI - A CLI for the Terminal Telematics API
 *
 * This CLI is driven by the OpenAPI spec hosted at:
 * https://api.withterminal.com/tsp/openapi
 */

import { TerminalClient, ClientError } from "./lib/client.ts";
import { loadConfig, saveConfig, getConfigPath } from "./lib/config.ts";
import { print, printError, printSuccess, printInfo, type OutputFormat } from "./lib/output.ts";
import { commandGroups, findCommand, type Command } from "../generated/index.ts";
import {
  generateBashCompletions,
  generateZshCompletions,
  generateFishCompletions,
} from "./lib/completions.ts";

interface GlobalOptions {
  format: OutputFormat;
  apiKey?: string;
  connectionToken?: string;
  all?: boolean;
}

function parseArgs(args: string[]): {
  command: string[];
  options: Record<string, string | boolean>;
  positionalArgs: string[];
} {
  const options: Record<string, string | boolean> = {};
  const command: string[] = [];
  const positionalArgs: string[] = [];

  // Special handling for config command which has subcommands and positional args
  if (args[0] === "config") {
    command.push("config");
    if (args[1]) {
      command.push(args[1]);
    }
    // Rest are positional args for config
    for (let i = 2; i < args.length; i++) {
      const arg = args[i]!;
      if (arg.startsWith("-")) {
        // parse option
        if (arg.startsWith("--")) {
          const [key, value] = arg.slice(2).split("=");
          if (value !== undefined) {
            options[key!] = value;
          } else if (args[i + 1] && !args[i + 1]!.startsWith("-")) {
            options[key!] = args[i + 1]!;
            i++;
          } else {
            options[key!] = true;
          }
        } else {
          const key = arg.slice(1);
          if (args[i + 1] && !args[i + 1]!.startsWith("-")) {
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

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;

    if (arg.startsWith("--")) {
      collectingCommand = false;
      const [key, value] = arg.slice(2).split("=");
      if (value !== undefined) {
        options[key!] = value;
      } else if (args[i + 1] && !args[i + 1]!.startsWith("-")) {
        options[key!] = args[i + 1]!;
        i++;
      } else {
        options[key!] = true;
      }
    } else if (arg.startsWith("-")) {
      collectingCommand = false;
      const key = arg.slice(1);
      if (args[i + 1] && !args[i + 1]!.startsWith("-")) {
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
  --api-key <key>      API key (or set TERMINAL_API_KEY)
  --connection-token   Connection token (or set TERMINAL_CONNECTION_TOKEN)
  --all                Auto-paginate and fetch all results
  --help, -h           Show help

\x1b[1mCONFIG COMMANDS:\x1b[0m
  config show          Show current configuration
  config set <key>     Set a config value
  config path          Show config file path

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
\x1b[1mEXAMPLES:\x1b[0m
  terminal config set api-key sk_prod_xxx
  terminal config set connection-token con_tkn_xxx
  terminal list-vehicles --format table
  terminal get-vehicle vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC
  terminal list-drivers --limit 10
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
}

async function handleConfigCommand(
  subcommand: string,
  args: string[],
  _options: Record<string, string | boolean>,
): Promise<void> {
  switch (subcommand) {
    case "show": {
      const config = loadConfig();
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
        printError("Usage: terminal config set <key> <value>");
        printInfo("Available keys: api-key, connection-token, environment");
        return;
      }

      if (!value) {
        printError(`Missing value for ${key}`);
        return;
      }

      switch (key) {
        case "api-key":
          saveConfig({ apiKey: value });
          printSuccess(`API key saved`);
          break;
        case "connection-token":
          saveConfig({ connectionToken: value });
          printSuccess(`Connection token saved`);
          break;
        case "environment":
          if (value !== "prod" && value !== "sandbox") {
            printError("Environment must be 'prod' or 'sandbox'");
            return;
          }
          saveConfig({ environment: value });
          printSuccess(`Environment set to ${value}`);
          break;
        default:
          printError(`Unknown config key: ${key}`);
          printInfo("Available keys: api-key, connection-token, environment");
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

  // Create client with overrides
  const config: Record<string, string> = {};
  if (globalOptions.apiKey) {
    config["apiKey"] = globalOptions.apiKey;
  }
  if (globalOptions.connectionToken) {
    config["connectionToken"] = globalOptions.connectionToken;
  }

  const client = new TerminalClient(config);

  try {
    let result = await cmd.handler(client, args);

    // Auto-paginate if --all flag is set and response has pagination
    if (globalOptions.all && isPaginatedResponse(result)) {
      const allResults: unknown[] = [...(result.results ?? [])];
      let cursor = result.next;
      let pageCount = 1;

      while (cursor) {
        pageCount++;
        process.stderr.write(`\rFetching page ${pageCount}...`);

        const nextArgs = { ...args, cursor };
        const nextResult = await cmd.handler(client, nextArgs);

        if (isPaginatedResponse(nextResult)) {
          allResults.push(...(nextResult.results ?? []));
          cursor = nextResult.next;
        } else {
          break;
        }
      }

      if (pageCount > 1) {
        process.stderr.write(`\rFetched ${pageCount} pages, ${allResults.length} total results\n`);
      }

      // Return combined results without pagination cursor
      result = { results: allResults };
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

  if (rawArgs.length === 0 || rawArgs[0] === "--help" || rawArgs[0] === "-h") {
    showHelp();
    return;
  }

  if (rawArgs[0] === "--version" || rawArgs[0] === "-v") {
    console.log("terminal-cli 0.1.0");
    return;
  }

  const { command, options, positionalArgs } = parseArgs(rawArgs);

  // Extract global options
  const globalOptions: GlobalOptions = {
    format: (options["format"] as OutputFormat) ?? "json",
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
    return;
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
    return;
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
