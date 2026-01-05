# terminal-cli

A CLI for the [Terminal Telematics API](https://withterminal.com), auto-generated from the OpenAPI spec.

## Quick Start

Requires [Bun](https://bun.sh) runtime.

```bash
# Clone and install
git clone https://github.com/terminal-api/terminal-cli.git
cd terminal-cli
bun install

# Build and link globally
bun run build && bun link
```

After linking, the `terminal` command is available globally. Configure your API key:

```bash
terminal config set api-key sk_prod_xxx
```

Now you can make API calls or start the interactive TUI:

API Calls

```bash
terminal list-connections --format table
```

TUI

```base
terminal
```

To rebuild after making changes:

```bash
bun run build
```

To unlink:

```bash
bun unlink
```

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
```

## Architecture

The CLI is entirely driven by the OpenAPI spec at `https://api.withterminal.com/tsp/openapi`:

```
src/
  cli.ts              # Main CLI entrypoint
  lib/
    client.ts         # HTTP client with auth
    config.ts         # Config management (~/.terminal/config.json)
    output.ts         # Output formatting
    completions.ts    # Shell completion generators

scripts/
  generate.ts         # OpenAPI spec parser & code generator

generated/            # Auto-generated command files
  index.ts
  vehicles.ts
  drivers.ts
  ...
```

To add new commands, update the OpenAPI spec and run `bun run generate`.
