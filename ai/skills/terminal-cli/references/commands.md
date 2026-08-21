# Terminal CLI discovery

Load this reference for how to discover commands, paginate, bound dates, and treat mutating operations. Do not treat this file as a command catalog. The installed CLI is generated from Terminal's OpenAPI spec and can change.

## Discover from help

Always start from this install:

```bash
terminal --help
terminal <command> --help
terminal <command> schema
```

- `terminal --help` lists grouped API commands and built-in subcommands (`config`, `profile`, …).
- `terminal <command> --help` is authoritative for required flags, enum values, and filters. Generated flags keep OpenAPI names, usually camelCase (`--driverIds`, `--startedAfter`).
- `terminal <command> schema` shows the expected response without calling the API.

If help and a remembered command disagree, follow help.

## Global options

These apply across API commands. Confirm remaining flags from command help.

| Option                         | Purpose                                          |
| ------------------------------ | ------------------------------------------------ |
| `--format json\|pretty\|table` | Select output format; use `json` for analysis    |
| `--api-key <key>`              | Override the configured API key for one call     |
| `--connection-token <token>`   | Override the configured connection token         |
| `--profile <name>`             | Select a configuration profile                   |
| `--all`                        | Follow pagination cursors and combine every page |
| `--help`                       | Show help                                        |
| `--version`                    | Show CLI version                                 |

Do not include `--api-key` or `--connection-token` in reported commands.

## Pagination

Use `--limit` for a small lookup when the command documents it. Use `--all` only when the answer needs every page.

Narrow by the filters shown in `--help` (dates, IDs, status) before requesting a full page set. `--all` can return a large payload.

## Date boundaries

Confirm each filter's format from `--help`. Typical patterns:

- timestamps: ISO 8601, preferably UTC (`2026-08-20T00:00:00Z`)
- calendar dates: `YYYY-MM-DD`
- months: `YYYY-MM`

Prefer explicit half-open ranges (start inclusive, next-period boundary as the end). Verify whether a given endpoint treats the end bound as inclusive before counting boundary events.

## Mutations

Commands that create, update, delete, resolve, retry, cancel, or otherwise change state require explicit user intent.

Before running one:

1. Confirm the command and flags from `--help`.
2. Identify the current connection and target resource.
3. Restate the change and wait for confirmation unless the user already asked for that exact mutation.
