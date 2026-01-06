#!/usr/bin/env bun
/**
 * Terminal CLI - A CLI for the Terminal Telematics API
 *
 * This CLI is driven by the OpenAPI spec hosted at:
 * https://api.withterminal.com/tsp/openapi
 */

import { Command, Option } from "commander";
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
import { commandGroups, allCommands, type Command as ApiCommand } from "../generated/index.ts";
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

function showCommandHelp(cmd: ApiCommand): void {
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
  cmd: ApiCommand,
  options: Record<string, string | boolean | undefined>,
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
  const { version } = await getCliVersion();

  const program = new Command()
    .name("terminal")
    .description("CLI for the Terminal Telematics API")
    .version(version, "-v, --version")
    .allowUnknownOption(false)
    .allowExcessArguments(false);

  // Global options
  program
    .option("--format <format>", "Output format: json, pretty, table", "json")
    .option("--profile <name>", "Use a specific profile (or set TERMINAL_PROFILE)")
    .option("--api-key <key>", "API key (or set TERMINAL_API_KEY)")
    .option("--connection-token <token>", "Connection token (or set TERMINAL_CONNECTION_TOKEN)")
    .option("--all", "Auto-paginate and fetch all results");

  // Config commands
  const configCmd = program.command("config").description("Manage configuration");

  configCmd
    .command("show")
    .description("Show current configuration")
    .action(() => {
      const profileName = program.opts().profile as string | undefined;
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
    });

  configCmd
    .command("set <key> <value>")
    .description("Set a config value (keys: api-key, connection-token, base-url, environment)")
    .action((key: string, value: string) => {
      const profileName = program.opts().profile as string | undefined;
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
            process.exit(1);
          }
          saveConfig({ environment: value }, profileName);
          printSuccess(
            `Environment set to ${value}${profileName ? ` for profile '${profileName}'` : ""}`,
          );
          break;
        default:
          printError(`Unknown config key: ${key}`);
          printInfo("Available keys: api-key, connection-token, base-url, environment");
          process.exit(1);
      }
    });

  configCmd
    .command("path")
    .description("Show config file path")
    .action(() => {
      console.log(getConfigPath());
    });

  // Profile commands
  const profileCmd = program.command("profile").description("Manage profiles");

  profileCmd
    .command("list")
    .description("List all profiles")
    .action(() => {
      const profiles = listProfiles();
      for (const profile of profiles) {
        const marker = profile.isDefault ? " (default)" : "";
        console.log(`${profile.name}${marker}`);
      }
    });

  profileCmd
    .command("show <name>")
    .description("Show profile details")
    .action((name: string) => {
      const profile = getProfile(name);
      if (!profile) {
        printError(`Profile '${name}' not found`);
        process.exit(1);
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
    });

  profileCmd
    .command("create <name>")
    .description("Create a new profile")
    .action((name: string) => {
      if (createProfile(name)) {
        printSuccess(`Profile '${name}' created`);
        printInfo(`Set values with: terminal config set <key> <value> --profile ${name}`);
      } else {
        printError(`Profile '${name}' already exists`);
        process.exit(1);
      }
    });

  profileCmd
    .command("delete <name>")
    .description("Delete a profile")
    .action((name: string) => {
      if (deleteProfile(name)) {
        printSuccess(`Profile '${name}' deleted`);
      } else {
        printError(`Cannot delete profile '${name}' (doesn't exist or is default)`);
        process.exit(1);
      }
    });

  profileCmd
    .command("use <name>")
    .description("Set default profile")
    .action((name: string) => {
      if (setDefaultProfile(name)) {
        printSuccess(`Default profile set to '${name}'`);
      } else {
        printError(`Profile '${name}' not found`);
        process.exit(1);
      }
    });

  profileCmd
    .command("copy <source> <target>")
    .description("Copy a profile")
    .action((source: string, target: string) => {
      if (copyProfile(source, target)) {
        printSuccess(`Profile '${source}' copied to '${target}'`);
      } else {
        printError(`Failed to copy: source '${source}' doesn't exist or target '${target}' exists`);
        process.exit(1);
      }
    });

  // Completions commands
  const completionsCmd = program.command("completions").description("Generate shell completions");

  completionsCmd
    .command("bash")
    .description("Generate bash completions")
    .action(() => {
      console.log(generateBashCompletions());
    });

  completionsCmd
    .command("zsh")
    .description("Generate zsh completions")
    .action(() => {
      console.log(generateZshCompletions());
    });

  completionsCmd
    .command("fish")
    .description("Generate fish completions")
    .action(() => {
      console.log(generateFishCompletions());
    });

  // Register all API commands dynamically
  for (const apiCmd of allCommands) {
    const cmd = program
      .command(apiCmd.name)
      .description(apiCmd.description)
      .allowUnknownOption(false);

    // Add command-specific options from the API spec
    for (const arg of apiCmd.args) {
      const optionFlag = arg.required ? `--${arg.name} <value>` : `--${arg.name} [value]`;

      const opt = new Option(optionFlag, arg.description);

      // Add choices if enum is defined
      if (arg.enum) {
        opt.choices(arg.enum);
      }

      cmd.addOption(opt);
    }

    // Action handler for the API command
    cmd.action(async (cmdOptions: Record<string, string | boolean | undefined>) => {
      const globalOpts = program.opts();
      const globalOptions: GlobalOptions = {
        format: (globalOpts.format as OutputFormat) ?? "json",
        profile: globalOpts.profile as string | undefined,
        apiKey: globalOpts["apiKey"] as string | undefined,
        connectionToken: globalOpts["connectionToken"] as string | undefined,
        all: globalOpts.all === true,
      };

      await handleApiCommand(apiCmd, cmdOptions, globalOptions);
    });

    // Add schema subcommand for each API command
    cmd
      .command("schema")
      .description("Show the expected response schema")
      .action(() => {
        const globalOpts = program.opts();
        const format = (globalOpts.format as OutputFormat) ?? "json";
        if (apiCmd.responseSchema) {
          print(apiCmd.responseSchema, { format });
        } else {
          printInfo(`No response schema available for '${apiCmd.name}'`);
        }
      });
  }

  // Custom help formatting to match the original output
  program.configureHelp({
    sortSubcommands: false,
    sortOptions: false,
  });

  // Override the default help to show grouped API commands
  program.addHelpText("after", () => {
    let helpText = "\n\x1b[1mAPI COMMANDS:\x1b[0m";
    for (const group of commandGroups) {
      helpText += `\n\n  \x1b[36m${group.name}\x1b[0m`;
      for (const cmd of group.commands) {
        const padding = 30 - cmd.name.length;
        helpText += `\n    ${cmd.name}${" ".repeat(Math.max(1, padding))}${cmd.description}`;
      }
    }
    helpText += `

\x1b[1mSUBCOMMANDS:\x1b[0m
  <command> schema       Show the response schema for a command

\x1b[1mEXAMPLES:\x1b[0m
  terminal config set api-key sk_prod_xxx
  terminal config set connection-token con_tkn_xxx
  terminal list-vehicles --format table
  terminal get-vehicle --id vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC
  terminal list-drivers --limit 10
  terminal list-vehicles schema
`;
    return helpText;
  });

  // Handle no arguments - launch TUI
  if (process.argv.length <= 2) {
    if (process.stdin.isTTY && process.stdout.isTTY) {
      await startTui();
    } else {
      program.outputHelp();
    }
    return;
  }

  // Handle case where only --profile is provided - launch TUI with profile
  const rawArgs = process.argv.slice(2);
  if (rawArgs.length === 2 && rawArgs[0] === "--profile") {
    if (process.stdin.isTTY && process.stdout.isTTY) {
      await startTui(rawArgs[1]);
    } else {
      program.outputHelp();
    }
    return;
  }

  // Parse and execute
  await program.parseAsync(process.argv);
}

main().catch((error) => {
  printError(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
