# Terminal CLI agent plugin

A portable [Agent Skill](https://agentskills.io) that queries fleet telematics through the Terminal CLI. Works with Cursor, Claude Code, OpenCode, Codex, and other Agent Skills clients.

- Skill: `terminal-cli` — discover commands from `terminal --help`
- Commands: `/terminal-cli`, `/terminal-setup`

## Prerequisites

```bash
npm install -g @terminal-api/cli
terminal config set api-key sk_prod_xxx
terminal config set connection-token con_tkn_xxx
```

See [`skills/terminal-cli/references/config.md`](skills/terminal-cli/references/config.md) for env vars and profiles.

## Install

```bash
npx skills add terminal-api/terminal-cli --skill terminal-cli
```

Use `-g` for a global install, or `--agent cursor` / `--agent opencode` to target one client.

**Claude Code**

```text
/plugin marketplace add terminal-api/terminal-cli
/plugin install terminal-cli@terminal-cli
```

Local: `claude --plugin-dir ./ai`

**Cursor** — add this repo as a plugin source, or use `npx skills add` above.

**OpenCode** — `npx skills add` above, or copy `ai/skills/terminal-cli` to `.agents/skills/`.

**Claude Desktop (team)** — zip `ai/` and upload it in Organization settings → Plugins. Or add a private GitHub marketplace that vendors this `ai/` folder. Use Cowork so the CLI can run.

## Examples

- How many safety events did driver John Smith have this week?
- Where was vehicle ABC-1234 on August 20?
- Which vehicles are moving right now?

```text
/terminal-cli How many safety events did driver John Smith have this week?
```

## Learn more

- [Terminal CLI](../README.md)
- [Terminal API docs](https://docs.withterminal.com)
