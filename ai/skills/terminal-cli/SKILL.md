---
name: terminal-cli
description: Query Terminal fleet telematics with the terminal CLI. Use for vehicles, drivers, locations, trips, safety, HOS, IFTA, diagnostics, connections, or CLI setup.
license: MIT
---

# Terminal CLI

Terminal provides one normalized API for fleet data from multiple telematics service providers. Use the `terminal` CLI to retrieve that data, then answer the user's operational question from the returned records.

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

The prerequisites are complete when `terminal config show` identifies the intended profile and `terminal list-providers` reaches the API.

## Query workflow

1. **Clarify the scope.** Establish the fleet connection, entity, and time range. Convert relative dates such as “this week” to explicit ISO 8601 boundaries and state the timezone assumption.
2. **Resolve names before querying detail.** If the user gives a driver, vehicle, or connection name rather than a Terminal ID, list the relevant resources first. Do not guess an ID when names are ambiguous.
3. **Inspect the command contract.** Use `terminal --help`, `terminal <command> --help`, or `terminal <command> schema` when an option or response shape is uncertain. Generated command-specific options use camelCase, such as `--driverIds` and `--startedAfter`.
4. **Request structured output.** Prefer JSON for analysis:

   ```bash
   terminal <command> [options] --format json
   ```

   Use `--limit` for a quick lookup. Use `--all` only when the answer requires the complete result set.

5. **Analyze the response.** Filter, aggregate, or join records needed to answer the question. Treat an empty result as “no matching records returned,” not proof that an event never occurred.
6. **Report the result.** Include the relevant count or records, identifiers needed for follow-up, explicit time range, and any assumptions. Include the command used, but redact credentials and connection tokens.

The query is complete when the answer is traceable to returned Terminal records and every material scope or pagination assumption is stated.

## Command map

| Need                      | Start with                                                         |
| ------------------------- | ------------------------------------------------------------------ |
| Vehicles and locations    | `list-vehicles`, `get-vehicle`, `list-latest-vehicle-locations`    |
| Drivers                   | `list-drivers`, `get-driver`                                       |
| Trips and utilization     | `list-trips`, `get-vehicle-utilization`                            |
| Safety and camera media   | `list-safety-events`, `get-safety-event`, `get-event-camera-media` |
| Hours of Service          | `list-hoslogs`, `list-hosdaily-logs`, `list-hosavailable-time`     |
| Diagnostics               | `list-fault-code-events`                                           |
| IFTA                      | `get-iftasummary`                                                  |
| Connections and providers | `list-connections`, `get-current-connection`, `list-providers`     |
| Sync health               | `list-issues`, `list-sync-history`, `get-sync-job-status`          |

Read [references/commands.md](references/commands.md) for the full command catalog, common filters, and pagination behavior.

## Worked queries

### Resolve a driver, then count safety events

```bash
terminal list-drivers --limit 100 --format json
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
terminal list-vehicles --limit 100 --format json
terminal list-historical-vehicle-locations \
  --vehicleId vcl_xxx \
  --startAt 2026-08-20T00:00:00Z \
  --endAt 2026-08-21T00:00:00Z \
  --all \
  --format json
```

Use a half-open day range when possible and state the timezone used to derive it.

### Fetch every trip in a bounded period

```bash
terminal list-trips \
  --startedAfter 2026-08-01T00:00:00Z \
  --startedBefore 2026-09-01T00:00:00Z \
  --all \
  --format json
```

Use `--all` only because a complete monthly total requires every page.

## Troubleshooting

- **CLI not found:** install `@terminal-api/cli` or use the repository development command documented in [references/config.md](references/config.md).
- **Missing API key:** set `TERMINAL_API_KEY` or use `terminal config set api-key`.
- **Missing connection token:** choose the intended connection and set `TERMINAL_CONNECTION_TOKEN`, `terminal config set connection-token`, or the global `--connection-token` override.
- **401/403:** verify the selected profile and credential. Do not ask the user to paste a secret into chat when a local environment variable or config command is available.
- **Empty data:** confirm connection, entity ID, UTC boundaries, filters, and pagination. Retry with a small unfiltered request when safe.
- **Unknown command or option:** run the command's `--help`; the CLI is generated from the current Terminal OpenAPI specification and may evolve.
- **Connectivity:** `terminal list-providers --format json` does not require a connection token and isolates API-key or network problems.
