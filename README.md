# Terminal CLI

A CLI for the [Terminal Telematics API](https://withterminal.com).

Note: This CLI is still experimental and we may change the command structure or naming before a 1.0 release.

## Installation

```bash
# Install globally from npm
npm install -g @terminal-api/cli
# or
pnpm add -g @terminal-api/cli
# or
bun install -g @terminal-api/cli
```

## Quick Start

After installing, configure your API key:

```bash
terminal config set api-key sk_prod_xxx
```

Now you can make API calls or start the interactive TUI:

**API Calls**

```bash
terminal list-connections --format table
```

**Interactive TUI**

```bash
terminal
```

Run `terminal` without arguments to launch the interactive terminal UI for browsing and executing API commands.

## Configuration

Set your API credentials:

```bash
terminal config set api-key sk_prod_xxx
terminal config set connection-token con_tkn_xxx
terminal config set base-url https://api.withterminal.com/tsp/v1
```

Or use environment variables:

```bash
export TERMINAL_API_KEY=sk_prod_xxx
export TERMINAL_CONNECTION_TOKEN=con_tkn_xxx
export TERMINAL_BASE_URL=https://api.withterminal.com/tsp/v1
```

View current config:

```bash
terminal config show
terminal config path
```

### Profiles

Manage multiple configurations with profiles:

```bash
# Create a profile
terminal profile create sandbox

# Set values for a profile
terminal config set api-key sk_sandbox_xxx --profile sandbox
terminal config set environment sandbox --profile sandbox

# Use a profile
terminal list-vehicles --profile sandbox

# Set default profile
terminal profile use sandbox

# List all profiles
terminal profile list
```

## Usage

```bash
terminal <command> [options]
```

### Global Options

| Option                       | Description                                                |
| ---------------------------- | ---------------------------------------------------------- |
| `--format <format>`          | Output format: `json`, `pretty`, `table` (default: `json`) |
| `--api-key <key>`            | API key override                                           |
| `--connection-token <token>` | Connection token override                                  |
| `--profile <name>`           | Use a specific config profile                              |
| `--all`                      | Auto-paginate and fetch all results                        |
| `--help`, `-h`               | Show help                                                  |
| `--version`, `-v`            | Show version                                               |

### Examples

```bash
# List vehicles with table output
terminal list-vehicles --format table

# Get a specific vehicle
terminal get-vehicle --id vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC

# List all drivers (auto-paginate)
terminal list-drivers --all

# List providers (no connection token required)
terminal list-providers

# Get current connection details
terminal get-current-connection --format pretty

# View response schema for a command
terminal list-vehicles schema
```

### Available Commands

Run `terminal --help` to see all available commands, organized by category:

- **authentication** - Token exchange
- **connections** - Manage connections
- **data-management** - Sync history, passthrough requests
- **devices** - List devices
- **drivers** - List/get drivers
- **fault-codes** - Fault code events
- **groups** - List groups
- **hours-of-service** - HOS logs and available time
- **ifta** - IFTA summaries
- **issues** - List/resolve issues
- **providers** - List providers
- **safety** - Safety events and camera media
- **trailers** - Trailers and locations
- **trips** - Historical trips
- **vehicle-utilization** - Utilization metrics
- **vehicles** - Vehicles, locations, and stats

## Shell Completions

```bash
# Bash - add to ~/.bashrc
eval "$(terminal completions bash)"

# Zsh - add to ~/.zshrc
eval "$(terminal completions zsh)"

# Fish
terminal completions fish > ~/.config/fish/completions/terminal.fish
```

## AI Agent Skills & Commands

The `ai/` folder contains ready-to-use skills and commands for AI coding assistants. These help you query Terminal API data using natural language.

| Tool        | Type    | Install Command                              |
| ----------- | ------- | -------------------------------------------- |
| Cursor      | Command | `cp -r ai/cursor/commands .cursor/commands`  |
| Claude Code | Skill   | `cp -r ai/claude-code/skills .claude/skills` |
| OpenCode    | Skill   | `cp -r ai/opencode/skill .opencode/skill`    |

Example queries:

- "How many safety events for driver X this week?"
- "Where was vehicle ABC on January 2nd?"
- "Which vehicles have active movement?"

See [`ai/README.md`](ai/README.md) for full setup instructions.

## Development

```bash
# Run CLI in dev mode (with watch)
bun run dev

# Regenerate commands from OpenAPI spec
bun run generate

# Run all checks (typecheck, lint, format, test)
bun run check

# Individual checks
bun run typecheck
bun run lint
bun run format
bun test

# Build
bun run build

# Link to use globally
bun link
```

## Architecture

The CLI is primarily driven by the OpenAPI spec at `https://api.withterminal.com/tsp/openapi`:

```
src/
  cli.ts              # Main CLI entrypoint
  lib/
    client.ts         # HTTP client with auth
    config.ts         # Config management (~/.terminal/config.json)
    output.ts         # Output formatting
    completions.ts    # Shell completion generators
  tui/                # Interactive terminal UI

scripts/
  generate.ts         # OpenAPI spec parser & code generator

generated/            # Auto-generated command files
  index.ts
  vehicles.ts
  drivers.ts
  ...
```

To add new commands, update the OpenAPI spec and run `bun run generate`.
