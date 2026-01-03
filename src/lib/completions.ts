/**
 * Shell completion generators for terminal-cli
 */

import { commandGroups } from "../../generated/index.ts";

function getAllCommands(): string[] {
  const commands: string[] = ["config"];
  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      commands.push(cmd.name);
    }
  }
  return commands;
}

export function generateBashCompletions(): string {
  const commands = getAllCommands();
  
  return `# Bash completion for terminal-cli
# Add to ~/.bashrc or ~/.bash_profile:
#   eval "$(terminal completions bash)"

_terminal_completions() {
  local cur prev commands
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"

  commands="${commands.join(" ")}"

  case "\${prev}" in
    terminal)
      COMPREPLY=( $(compgen -W "\${commands}" -- "\${cur}") )
      return 0
      ;;
    config)
      COMPREPLY=( $(compgen -W "show set path" -- "\${cur}") )
      return 0
      ;;
    set)
      if [[ "\${COMP_WORDS[1]}" == "config" ]]; then
        COMPREPLY=( $(compgen -W "api-key connection-token environment" -- "\${cur}") )
        return 0
      fi
      ;;
    --format)
      COMPREPLY=( $(compgen -W "json pretty table" -- "\${cur}") )
      return 0
      ;;
  esac

  # Options
  if [[ "\${cur}" == -* ]]; then
    COMPREPLY=( $(compgen -W "--format --api-key --connection-token --help --version" -- "\${cur}") )
    return 0
  fi

  COMPREPLY=( $(compgen -W "\${commands}" -- "\${cur}") )
}

complete -F _terminal_completions terminal
`;
}

export function generateZshCompletions(): string {
  let commandList = "";
  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      commandList += `    '${cmd.name}:${cmd.description}'\n`;
    }
  }

  return `#compdef terminal
# Zsh completion for terminal-cli
# Add to ~/.zshrc:
#   eval "$(terminal completions zsh)"

_terminal() {
  local -a commands
  commands=(
    'config:Manage configuration'
${commandList}  )

  _arguments -C \\
    '--format[Output format]:format:(json pretty table)' \\
    '--api-key[API key]:api-key:' \\
    '--connection-token[Connection token]:token:' \\
    '--help[Show help]' \\
    '--version[Show version]' \\
    '1:command:->command' \\
    '*::arg:->args'

  case "$state" in
    command)
      _describe -t commands 'terminal commands' commands
      ;;
    args)
      case "\${words[1]}" in
        config)
          local -a config_commands
          config_commands=(
            'show:Show current configuration'
            'set:Set a config value'
            'path:Show config file path'
          )
          _describe -t config_commands 'config subcommands' config_commands
          ;;
      esac
      ;;
  esac
}

_terminal "$@"
`;
}

export function generateFishCompletions(): string {
  let completions = `# Fish completion for terminal-cli
# Add to ~/.config/fish/completions/terminal.fish:
#   terminal completions fish > ~/.config/fish/completions/terminal.fish

# Disable file completions
complete -c terminal -f

# Global options
complete -c terminal -l format -d 'Output format' -xa 'json pretty table'
complete -c terminal -l api-key -d 'API key'
complete -c terminal -l connection-token -d 'Connection token'
complete -c terminal -s h -l help -d 'Show help'
complete -c terminal -s v -l version -d 'Show version'

# Config commands
complete -c terminal -n '__fish_use_subcommand' -a config -d 'Manage configuration'
complete -c terminal -n '__fish_seen_subcommand_from config' -a show -d 'Show current configuration'
complete -c terminal -n '__fish_seen_subcommand_from config' -a set -d 'Set a config value'
complete -c terminal -n '__fish_seen_subcommand_from config' -a path -d 'Show config file path'

# API commands
`;

  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      completions += `complete -c terminal -n '__fish_use_subcommand' -a '${cmd.name}' -d '${cmd.description}'\n`;
    }
  }

  return completions;
}
