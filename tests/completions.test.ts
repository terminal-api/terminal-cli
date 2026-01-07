import { describe, test, expect } from "bun:test";
import {
  generateBashCompletions,
  generateZshCompletions,
  generateFishCompletions,
} from "../src/lib/completions";
import { allCommands } from "../generated/index";

describe("shell completions", () => {
  describe("bash completions", () => {
    test("generates valid bash completion script", () => {
      const result = generateBashCompletions();

      // Check script structure
      expect(result).toContain("_terminal_completions()");
      expect(result).toContain("complete -F _terminal_completions terminal");
      expect(result).toContain("COMPREPLY=");
    });

    test("includes all API commands", () => {
      const result = generateBashCompletions();

      // Check that some API commands are included
      expect(result).toContain("list-vehicles");
      expect(result).toContain("list-drivers");
      expect(result).toContain("get-vehicle");
    });

    test("includes config subcommands", () => {
      const result = generateBashCompletions();

      expect(result).toContain("config)");
      expect(result).toContain("show");
      expect(result).toContain("set");
      expect(result).toContain("path");
    });

    test("includes profile subcommands", () => {
      const result = generateBashCompletions();

      expect(result).toContain("profile)");
      expect(result).toContain("list");
      expect(result).toContain("create");
      expect(result).toContain("delete");
      expect(result).toContain("use");
      expect(result).toContain("copy");
    });

    test("includes completions subcommands", () => {
      const result = generateBashCompletions();

      expect(result).toContain("completions)");
      expect(result).toContain("bash");
      expect(result).toContain("zsh");
      expect(result).toContain("fish");
    });

    test("includes format options", () => {
      const result = generateBashCompletions();

      expect(result).toContain("--format)");
      expect(result).toContain("json");
      expect(result).toContain("pretty");
      expect(result).toContain("table");
    });

    test("includes global options", () => {
      const result = generateBashCompletions();

      expect(result).toContain("--api-key");
      expect(result).toContain("--connection-token");
      expect(result).toContain("--profile");
      expect(result).toContain("--all");
      expect(result).toContain("--help");
      expect(result).toContain("--version");
    });
  });

  describe("zsh completions", () => {
    test("generates valid zsh completion script", () => {
      const result = generateZshCompletions();

      // Check zsh-specific structure
      expect(result).toContain("#compdef terminal");
      expect(result).toContain("_terminal()");
      expect(result).toContain("_arguments");
      expect(result).toContain('_terminal "$@"');
    });

    test("includes command descriptions", () => {
      const result = generateZshCompletions();

      // Commands should have descriptions in zsh format 'command:description'
      expect(result).toContain("'config:Manage configuration'");
      expect(result).toContain("'profile:Manage profiles'");
      expect(result).toContain("'completions:Generate shell completions'");
    });

    test("includes API commands with descriptions", () => {
      const result = generateZshCompletions();

      // Check that API commands are included with their descriptions
      for (const cmd of allCommands.slice(0, 5)) {
        expect(result).toContain(`'${cmd.name}:`);
      }
    });

    test("includes global options with descriptions", () => {
      const result = generateZshCompletions();

      expect(result).toContain("'--format[Output format]");
      expect(result).toContain("'--api-key[API key]");
      expect(result).toContain("'--connection-token[Connection token]");
      expect(result).toContain("'--all[Auto-paginate results]");
      expect(result).toContain("'--help[Show help]");
      expect(result).toContain("'--version[Show version]");
    });

    test("includes config subcommand completions", () => {
      const result = generateZshCompletions();

      expect(result).toContain("config)");
      expect(result).toContain("'show:Show current configuration'");
      expect(result).toContain("'set:Set a config value'");
      expect(result).toContain("'path:Show config file path'");
    });

    test("includes profile subcommand completions", () => {
      const result = generateZshCompletions();

      expect(result).toContain("profile)");
      expect(result).toContain("'list:List profiles'");
      expect(result).toContain("'create:Create a new profile'");
      expect(result).toContain("'delete:Delete a profile'");
      expect(result).toContain("'use:Set default profile'");
      expect(result).toContain("'copy:Copy a profile'");
    });
  });

  describe("fish completions", () => {
    test("generates valid fish completion script", () => {
      const result = generateFishCompletions();

      // Check fish-specific structure
      expect(result).toContain("complete -c terminal");
      expect(result).toContain("# Disable file completions");
      expect(result).toContain("complete -c terminal -f");
    });

    test("includes global options", () => {
      const result = generateFishCompletions();

      expect(result).toContain("-l format -d 'Output format'");
      expect(result).toContain("-l api-key -d 'API key'");
      expect(result).toContain("-l connection-token -d 'Connection token'");
      expect(result).toContain("-l all -d 'Auto-paginate results'");
      expect(result).toContain("-s h -l help -d 'Show help'");
      expect(result).toContain("-s v -l version -d 'Show version'");
    });

    test("includes format choices", () => {
      const result = generateFishCompletions();

      expect(result).toContain("-xa 'json pretty table'");
    });

    test("includes config commands", () => {
      const result = generateFishCompletions();

      expect(result).toContain("-a config -d 'Manage configuration'");
      expect(result).toContain("__fish_seen_subcommand_from config");
      expect(result).toContain("-a show -d 'Show current configuration'");
      expect(result).toContain("-a set -d 'Set a config value'");
      expect(result).toContain("-a path -d 'Show config file path'");
    });

    test("includes profile commands", () => {
      const result = generateFishCompletions();

      expect(result).toContain("-a profile -d 'Manage profiles'");
      expect(result).toContain("__fish_seen_subcommand_from profile");
      expect(result).toContain("-a list -d 'List profiles'");
      expect(result).toContain("-a create -d 'Create a new profile'");
      expect(result).toContain("-a delete -d 'Delete a profile'");
    });

    test("includes completions commands", () => {
      const result = generateFishCompletions();

      expect(result).toContain("-a completions -d 'Generate shell completions'");
      expect(result).toContain("__fish_seen_subcommand_from completions");
      expect(result).toContain("-a bash -d 'Bash completions'");
      expect(result).toContain("-a zsh -d 'Zsh completions'");
      expect(result).toContain("-a fish -d 'Fish completions'");
    });

    test("includes all API commands", () => {
      const result = generateFishCompletions();

      // Check that API commands are included
      for (const cmd of allCommands) {
        expect(result).toContain(`-a '${cmd.name}' -d '${cmd.description}'`);
      }
    });

    test("uses __fish_use_subcommand for top-level commands", () => {
      const result = generateFishCompletions();

      // API commands should use __fish_use_subcommand
      expect(result).toContain("__fish_use_subcommand");
    });
  });

  describe("completions include all commands", () => {
    test("all API commands are in bash completions", () => {
      const bash = generateBashCompletions();
      for (const cmd of allCommands) {
        expect(bash).toContain(cmd.name);
      }
    });

    test("all API commands are in zsh completions", () => {
      const zsh = generateZshCompletions();
      for (const cmd of allCommands) {
        expect(zsh).toContain(cmd.name);
      }
    });

    test("all API commands are in fish completions", () => {
      const fish = generateFishCompletions();
      for (const cmd of allCommands) {
        expect(fish).toContain(cmd.name);
      }
    });
  });
});
