---
name: terminal-setup
description: Install, configure, and verify the Terminal CLI safely
argument-hint: [optional profile or environment]
---

# Set up the Terminal CLI

Use the bundled `terminal-cli` skill and its `references/config.md` guide. Configure the environment requested in:

`$ARGUMENTS`

1. Run `terminal --version`.
2. If the CLI is absent, ask before installing `@terminal-api/cli` globally.
3. Run `terminal config show` and identify the active profile.
4. If the API key is missing, tell the user how to set it locally with `TERMINAL_API_KEY` or `terminal config set api-key`. Do not ask them to paste the secret into chat.
5. Run `terminal list-providers --format json` to test API-key and network access.
6. If the user needs connection-scoped data, run `terminal list-connections --format table`, have them choose when more than one fleet matches, then configure the token locally.
7. Run `terminal get-current-connection --format json` and `terminal list-vehicles --limit 1 --format json`.

Finish with the selected profile, environment, connection identity, and smoke-test result. Never print an unmasked API key or connection token.

