# Terminal CLI command reference

Load this reference to choose a command or common filter. The CLI is generated from Terminal's current OpenAPI specification, so `terminal --help` and `terminal <command> --help` remain authoritative.

## Global options

Global options work with API commands:

| Option                       | Purpose                                            |
| ---------------------------- | -------------------------------------------------- | ------ | --------------------------------------------------- |
| `--format json               | pretty                                             | table` | Select output format; use `json` for agent analysis |
| `--api-key <key>`            | Override the configured API key for one invocation |
| `--connection-token <token>` | Override the configured connection token           |
| `--profile <name>`           | Select a configuration profile                     |
| `--all`                      | Follow pagination cursors and combine every page   |
| `--help`                     | Show command help                                  |
| `--version`                  | Show CLI version                                   |

List endpoints generally accept `--limit` and `--cursor`, but use each command's `--help` to confirm. Generated command-specific flags preserve the OpenAPI argument name in camelCase.

Show a response schema without calling the API:

```bash
terminal list-vehicles schema
```

## Resource commands

### Authentication

- `public-token-exchange --publicToken <value>` — exchange a public token

### Connections

- `list-connections` — list accessible fleet/provider connections
- `get-current-connection` — inspect the connection selected by the active token
- `update-current-connection` — update connection state and options
- `delete-current-connection` — remove the current connection

Useful `list-connections` filters include `--externalId`, `--dotNumber`, `--tag`, `--status`, `--provider`, `--updatedAfter`, and `--updatedBefore`.

### Vehicles

- `list-vehicles` — list normalized vehicle records
- `get-vehicle --id <vehicleId>` — retrieve one vehicle
- `list-latest-vehicle-locations` — latest known locations
- `list-historical-vehicle-locations --vehicleId <id>` — location breadcrumbs
- `list-historical-vehicle-stats --vehicleId <id>` — odometer, fuel, engine hours, and related stats
- `get-vehicle-utilization` — utilization over a date range

Useful filters:

- locations: `--vehicleIds`, `--driverIds`
- historical locations/stats: `--startAt`, `--endAt`
- utilization: `--startDate`, `--endDate`, `--vehicleIds`

### Drivers

- `list-drivers` — list drivers
- `get-driver --id <driverId>` — retrieve one driver

### Trips

- `list-trips` — list trips with times, distance, and associated resources

Useful filters include `--startedAfter`, `--startedBefore`, `--endedAfter`, `--endedBefore`, `--driverIds`, and `--vehicleIds`.

### Safety

- `list-safety-events` — list safety events
- `get-safety-event --id <eventId>` — retrieve one event
- `get-event-camera-media --id <eventId>` — retrieve camera media metadata for an event

Useful list filters include `--startedAfter`, `--startedBefore`, `--driverIds`, and `--vehicleIds`.

### Hours of Service

- `list-hoslogs` — HOS status/log intervals
- `list-hosdaily-logs` — daily HOS summaries
- `list-hosavailable-time` — remaining drive/on-duty time

Useful filters:

- HOS logs: `--startedAfter`, `--startedBefore`, `--driverIds`
- daily logs: `--startDate`, `--endDate`, `--driverIds`
- available time: `--driverIds`

### Fault codes

- `list-fault-code-events` — active and historical diagnostic events

Useful filters include `--startAt`, `--endAt`, and `--vehicleIds`.

### IFTA

- `get-iftasummary --startMonth <YYYY-MM> --endMonth <YYYY-MM>` — jurisdictional IFTA summary

Use `--groupBy` only after checking its accepted values with `--help`.

### Trailers, devices, and groups

- `list-trailers`
- `list-latest-trailer-locations`
- `list-devices`
- `list-groups`

### Providers

- `list-providers` — list supported telematics providers; no connection token required

### Issues and data management

- `list-issues` — list data synchronization issues
- `resolve-issue --issueId <id>` — resolve an issue
- `list-sync-history` — list sync jobs
- `request-sync` — request historical synchronization
- `get-sync-job-status --id <id>` — inspect one sync job
- `retry-sync --id <id>` — retry a sync job
- `cancel-sync --id <id>` — cancel a sync job
- `passthrough --method <method> --path <path>` — make a provider passthrough request

Mutating commands require explicit user intent. Show the targeted connection and resource before running `resolve-issue`, `request-sync`, `retry-sync`, `cancel-sync`, `update-current-connection`, or `delete-current-connection`.

### Links

- `create-short-link` — create a hosted connection link

## Pagination

For a quick lookup:

```bash
terminal list-vehicles --limit 10 --format json
```

For a complete aggregate:

```bash
terminal list-vehicles --all --format json
```

`--all` follows response cursors and combines records. It can produce a large response; first narrow by date, entity IDs, or other supported filters.

## Date boundaries

- Timestamp filters use ISO 8601, preferably UTC (`2026-08-20T00:00:00Z`).
- Date filters use `YYYY-MM-DD`.
- IFTA month filters use `YYYY-MM`.
- Prefer explicit half-open ranges: start inclusive and next-period boundary as the end. Verify endpoint semantics before treating boundary events as included or excluded.
