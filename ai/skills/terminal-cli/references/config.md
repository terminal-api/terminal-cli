# Terminal CLI configuration

Load this reference when the CLI is missing, credentials are incomplete, a connection must be selected, or the user works with multiple environments.

## Install and verify

Install the published CLI:

```bash
npm install -g @terminal-api/cli
terminal --version
```

When developing inside the `terminal-cli` repository, use:

```bash
bun run src/cli.ts --help
```

## Configuration precedence

Command-line overrides and environment variables take precedence over values stored in `~/.terminal/config.json`. Prefer environment variables for automation and profiles for repeat local use.

Never put live credentials in source files, committed shell history, plugin manifests, or examples.

### Stored configuration

```bash
terminal config set api-key sk_prod_xxx
terminal config set connection-token con_tkn_xxx
terminal config show
terminal config path
```

`config show` masks secrets. The config file is created with user-only permissions where the operating system supports them.

### Environment variables

```bash
export TERMINAL_API_KEY="sk_prod_xxx"
export TERMINAL_CONNECTION_TOKEN="con_tkn_xxx"
export TERMINAL_BASE_URL="https://api.withterminal.com/tsp/v1"
export TERMINAL_ENVIRONMENT="prod"
export TERMINAL_PROFILE="prod"
```

Use `https://api.sandbox.withterminal.com/tsp/v1` or `TERMINAL_ENVIRONMENT=sandbox` for the sandbox environment.

### Per-command overrides

Global options may be supplied on an individual request:

```bash
terminal list-vehicles \
  --profile sandbox \
  --connection-token con_tkn_xxx \
  --format json
```

Avoid exposing the resulting command when it contains a credential. Prefer the environment or stored profile for repeat use.

## Profiles

Profiles separate environments, customers, or connections:

```bash
terminal profile create sandbox
terminal config set api-key sk_sandbox_xxx --profile sandbox
terminal config set environment sandbox --profile sandbox
terminal config set connection-token con_tkn_xxx --profile sandbox
terminal profile use sandbox
terminal profile list
```

Select a profile without changing the default:

```bash
terminal list-vehicles --profile sandbox --format json
```

Before changing an existing default profile, confirm which environment or fleet the user intends to query.

## Selecting a connection

An API key identifies the Terminal application. A connection token identifies the downstream fleet connection used by most telematics endpoints.

List available connections:

```bash
terminal list-connections --format table
```

After the user selects the intended fleet, configure its connection token locally:

```bash
terminal config set connection-token con_tkn_xxx
terminal get-current-connection --format pretty
```

Do not infer a connection from a similarly named customer. If more than one connection matches, present the safe identifying fields and ask the user to choose.

## Smoke tests

Test API-key and network access without a connection token:

```bash
terminal list-providers --format json
```

Then test the selected connection:

```bash
terminal get-current-connection --format json
terminal list-vehicles --limit 1 --format json
```

Configuration is ready when the provider request succeeds and the connection-scoped request identifies the expected fleet, even if that fleet currently has no vehicles.

