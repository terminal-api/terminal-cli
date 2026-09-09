---
name: terminal-cli
description: Query Terminal fleet telematics with the terminal CLI. Use for vehicles, drivers, locations, trips, safety, HOS, IFTA, diagnostics, connections, or CLI setup.
license: MIT
---

# Terminal CLI

Terminal provides one normalized API for fleet data from multiple telematics service providers. Use the `terminal` CLI to retrieve that data, then answer the user's operational question from the returned records.

The CLI is generated from Terminal's OpenAPI spec and can change. Treat installed CLI help as the source of truth for command names, flags, and schemas. Do not rely on remembered command lists.

## When to use

Use this skill when the user wants to:

- inspect vehicles, drivers, trailers, devices, groups, or connections
- find current or historical locations, trips, or utilization
- analyze safety events, Hours of Service, fault codes, or IFTA
- investigate sync issues or data availability
- install, configure, or troubleshoot the Terminal CLI

## Prerequisites

1. Run `terminal --version` to verify the CLI is installed.
2. If it is missing, ask before installing it globally:

   ```bash
   npm install -g @terminal-api/cli
   ```

3. Run `terminal config show`. The API key must be configured. Most resource queries also require a connection token.
4. If configuration is incomplete, follow [references/config.md](references/config.md). Never print or repeat an unmasked credential.

The prerequisites are complete when `terminal config show` identifies the intended profile and a provider list command from `terminal --help` reaches the API.

## Query workflow

1. **Clarify the scope.** Establish the fleet connection, entity, and time range. Convert relative dates such as “this week” to explicit ISO 8601 boundaries and state the timezone assumption.
2. **Discover the command from help.** Run `terminal --help` and pick the command that matches the question. Then run `terminal <command> --help` before the first invocation of that command. Use `terminal <command> schema` when the response shape is unclear. Read [references/commands.md](references/commands.md) for pagination, dates, and mutation rules.
3. **Resolve names before querying detail.** If the user gives a driver, vehicle, or connection name rather than a Terminal ID, list the relevant resources first. Confirm the ID from that list. Do not guess an ID when names are ambiguous.
4. **Request structured output.** Prefer JSON for analysis:

   ```bash
   terminal <command> [options] --format json
   ```

   Use `--limit` for a quick lookup when help documents it. Use `--all` only when the answer requires the complete result set.

5. **Analyze the response.** Filter, aggregate, or join records needed to answer the question. Treat an empty result as “no matching records returned,” not proof that an event never occurred.
6. **Report the result.** Include the relevant count or records, identifiers needed for follow-up, explicit time range, and any assumptions. Include the command used, but redact credentials and connection tokens.

The query is complete when the chosen command and flags came from this install's `--help`, the answer is traceable to returned Terminal records, and every material scope or pagination assumption is stated.

## Worked queries

These examples show the discovery loop. Command names and flags in the snippets are typical, not a catalog. Confirm them with `--help` on this install before running.

### Resolve a driver, then count safety events

```bash
terminal --help
terminal list-drivers --help
terminal list-drivers --limit 100 --format json
terminal list-safety-events --help
terminal list-safety-events \
  --driverIds drv_xxx \
  --startedAfter 2026-08-17T00:00:00Z \
  --startedBefore 2026-08-24T00:00:00Z \
  --all \
  --format json
```

Confirm the driver match before using the ID. Count the returned events and summarize categories or severity only when those fields are present.

### Find a vehicle's locations for a day

```bash
terminal --help
terminal list-vehicles --help
terminal list-vehicles --limit 100 --format json
terminal list-historical-vehicle-locations --help
terminal list-historical-vehicle-locations \
  --vehicleId vcl_xxx \
  --startAt 2026-08-20T00:00:00Z \
  --endAt 2026-08-21T00:00:00Z \
  --all \
  --format json
```

Use a half-open day range when possible and state the timezone used to derive it.

## Troubleshooting

- **CLI not found:** install `@terminal-api/cli` or use the repository development command documented in [references/config.md](references/config.md).
- **Missing API key:** set `TERMINAL_API_KEY` or use `terminal config set api-key`.
- **Missing connection token:** choose the intended connection and set `TERMINAL_CONNECTION_TOKEN`, `terminal config set connection-token`, or the global `--connection-token` override.
- **401/403:** verify the selected profile and credential. Do not ask the user to paste a secret into chat when a local environment variable or config command is available.
- **Empty data:** confirm connection, entity ID, UTC boundaries, filters, and pagination. Retry with a small unfiltered request when safe.
- **Unknown command or option:** run `terminal --help` or `terminal <command> --help` again. Do not fall back to a remembered command list.
- **Connectivity:** use `terminal --help` to find the providers command, then run it with `--format json`. That request does not require a connection token.
