/**
 * Shell completion generators for terminal-cli
 */

import { commandGroups } from "../../generated/index.ts";
import { isAdminFeatureEnabled } from "./admin-auth.ts";

function getAllCommands(): string[] {
  const commands: string[] = ["config", "profile", "completions"];
  if (isAdminFeatureEnabled()) {
    commands.push("admin");
  }
  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      commands.push(cmd.name);
    }
  }
  return commands;
}

export function generateBashCompletions(): string {
  const commands = getAllCommands();
  const adminCase = isAdminFeatureEnabled()
    ? `    admin)
      COMPREPLY=( $(compgen -W "login logout whoami" -- "\${cur}") )
      return 0
      ;;
`
    : "";

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
    profile)
      COMPREPLY=( $(compgen -W "list show create delete use copy" -- "\${cur}") )
      return 0
      ;;
${adminCase}    completions)
      COMPREPLY=( $(compgen -W "bash zsh fish" -- "\${cur}") )
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
    COMPREPLY=( $(compgen -W "--format --api-key --connection-token --profile --all --help --version -h -v" -- "\${cur}") )
    return 0
  fi

  COMPREPLY=( $(compgen -W "\${commands}" -- "\${cur}") )
}

complete -F _terminal_completions terminal
`;
}

export function generateZshCompletions(): string {
  let commandList = "";
  const adminCommandLine = isAdminFeatureEnabled()
    ? "    'admin:Employee admin authentication'\n"
    : "";
  const adminArgsBlock = isAdminFeatureEnabled()
    ? `        admin)
          local -a admin_commands
          admin_commands=(
            'login:Sign in with Google for employee access'
            'logout:Clear stored employee tokens'
            'whoami:Show the current employee auth state'
          )
          _describe -t admin_commands 'admin subcommands' admin_commands
          ;;
`
    : "";
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
    'profile:Manage profiles'
${adminCommandLine}    'completions:Generate shell completions'
${commandList}  )

  _arguments -C \\
    '--format[Output format]:format:(json pretty table)' \\
    '--api-key[API key]:api-key:' \\
    '--connection-token[Connection token]:token:' \\
    '--profile[Profile name]:profile:' \\
    '--all[Auto-paginate results]' \\
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
        profile)
          local -a profile_commands
          profile_commands=(
            'list:List profiles'
            'show:Show profile details'
            'create:Create a new profile'
            'delete:Delete a profile'
            'use:Set default profile'
            'copy:Copy a profile'
          )
          _describe -t profile_commands 'profile subcommands' profile_commands
          ;;
${adminArgsBlock}        completions)
          local -a completion_shells
          completion_shells=(
            'bash:Generate bash completions'
            'zsh:Generate zsh completions'
            'fish:Generate fish completions'
          )
          _describe -t completion_shells 'completion shells' completion_shells
          ;;
      esac
      ;;
  esac
}

_terminal "$@"
`;
}

export function generateFishCompletions(): string {
  const adminCompletions = isAdminFeatureEnabled()
    ? `# Admin commands
complete -c terminal -n '__fish_use_subcommand' -a admin -d 'Employee admin authentication'
complete -c terminal -n '__fish_seen_subcommand_from admin' -a login -d 'Sign in with Google for employee access'
complete -c terminal -n '__fish_seen_subcommand_from admin' -a logout -d 'Clear stored employee tokens'
complete -c terminal -n '__fish_seen_subcommand_from admin' -a whoami -d 'Show the current employee auth state'

`
    : "";
  let completions = `# Fish completion for terminal-cli
# Add to ~/.config/fish/completions/terminal.fish:
#   terminal completions fish > ~/.config/fish/completions/terminal.fish

# Disable file completions
complete -c terminal -f

# Global options
complete -c terminal -l format -d 'Output format' -xa 'json pretty table'
complete -c terminal -l api-key -d 'API key'
complete -c terminal -l connection-token -d 'Connection token'
complete -c terminal -l profile -d 'Profile name'
complete -c terminal -l all -d 'Auto-paginate results'
complete -c terminal -s h -l help -d 'Show help'
complete -c terminal -s v -l version -d 'Show version'

# Config commands
complete -c terminal -n '__fish_use_subcommand' -a config -d 'Manage configuration'
complete -c terminal -n '__fish_seen_subcommand_from config' -a show -d 'Show current configuration'
complete -c terminal -n '__fish_seen_subcommand_from config' -a set -d 'Set a config value'
complete -c terminal -n '__fish_seen_subcommand_from config' -a path -d 'Show config file path'

# Profile commands
complete -c terminal -n '__fish_use_subcommand' -a profile -d 'Manage profiles'
complete -c terminal -n '__fish_seen_subcommand_from profile' -a list -d 'List profiles'
complete -c terminal -n '__fish_seen_subcommand_from profile' -a show -d 'Show profile details'
complete -c terminal -n '__fish_seen_subcommand_from profile' -a create -d 'Create a new profile'
complete -c terminal -n '__fish_seen_subcommand_from profile' -a delete -d 'Delete a profile'
complete -c terminal -n '__fish_seen_subcommand_from profile' -a use -d 'Set default profile'
complete -c terminal -n '__fish_seen_subcommand_from profile' -a copy -d 'Copy a profile'

${adminCompletions}# Completion commands
complete -c terminal -n '__fish_use_subcommand' -a completions -d 'Generate shell completions'
complete -c terminal -n '__fish_seen_subcommand_from completions' -a bash -d 'Bash completions'
complete -c terminal -n '__fish_seen_subcommand_from completions' -a zsh -d 'Zsh completions'
complete -c terminal -n '__fish_seen_subcommand_from completions' -a fish -d 'Fish completions'

# API commands
`;

  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      completions += `complete -c terminal -n '__fish_use_subcommand' -a '${cmd.name}' -d '${cmd.description}'\n`;
    }
  }

  return completions;
}
