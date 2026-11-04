---
name: terminal-cli
description: Query fleet and telematics data with the Terminal CLI
argument-hint: [question about vehicles, drivers, trips, safety, HOS, or fleet data]
---

# Query Terminal fleet data

Use the bundled `terminal-cli` skill and follow its query workflow for:

`$ARGUMENTS`

Discover commands from `terminal --help` and `terminal <command> --help` on this install. Resolve user-facing names to Terminal IDs before detail queries, use explicit time boundaries, prefer JSON output for analysis, and account for pagination. Return the answer, important IDs and assumptions, and the redacted command used.

If the CLI or credentials are not ready, invoke the `terminal-setup` command workflow before querying.
