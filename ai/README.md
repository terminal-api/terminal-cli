# Terminal CLI agent plugin

Use natural language to query fleet telematics through the [Terminal CLI](https://github.com/terminal-api/terminal-cli). The plugin bundles one portable [Agent Skill](https://agentskills.io) plus setup and query commands for clients that support them.

The same skill works with Cursor, Claude Code, OpenCode, Codex, and other Agent Skills clients. There are no copied provider-specific skill files.

## What is included

```text
ai/
├── plugin.json
├── .claude-plugin/plugin.json
├── .cursor-plugin/plugin.json
├── skills/
│   └── terminal-cli/
│       ├── SKILL.md
│       └── references/
└── commands/
    ├── terminal-cli.md
    └── terminal-setup.md
```

- `terminal-cli` skill: discovers the right CLI command, resolves entity names to IDs, handles time ranges and pagination, and summarizes records.
- `/terminal-cli`: explicitly run a fleet query in Cursor or Claude Code.
- `/terminal-setup`: install, configure, and smoke-test the CLI without exposing credentials.

## Prerequisites

Install the CLI:

```bash
npm install -g @terminal-api/cli
```

Configure an API key and, for most fleet queries, a connection token:

```bash
terminal config set api-key sk_prod_xxx
terminal config set connection-token con_tkn_xxx
terminal config show
```

Environment variables and named profiles are also supported. See [`skills/terminal-cli/references/config.md`](skills/terminal-cli/references/config.md).

## Install

### Any Agent Skills client

The [`skills`](https://github.com/vercel-labs/skills) CLI detects the skill in this repository and installs it for Cursor, Claude Code, OpenCode, Codex, and other supported agents:

```bash
npx skills add terminal-api/terminal-cli --skill terminal-cli
```

Install globally instead of into one project:

```bash
npx skills add -g terminal-api/terminal-cli --skill terminal-cli
```

### Claude Code marketplace

Add this repository's marketplace and install the plugin:

```text
/plugin marketplace add terminal-api/terminal-cli
/plugin install terminal-cli@terminal-cli
```

The skill is available as `/terminal-cli:terminal-cli`; the setup command is `/terminal-cli:terminal-setup`.

For local development:

```bash
claude --plugin-dir ./ai
```

### Cursor

This repository contains [`.cursor-plugin/marketplace.json`](../.cursor-plugin/marketplace.json), which points Cursor at the plugin in `ai/`. Add the repository as a team or local plugin source. Once the plugin is accepted into the public Cursor Marketplace, install **Terminal CLI** from **Customize → Marketplace**.

For a skill-only install before marketplace publication:

```bash
npx skills add terminal-api/terminal-cli --skill terminal-cli --agent cursor
```

### OpenCode

OpenCode supports the Agent Skills format directly:

```bash
npx skills add terminal-api/terminal-cli --skill terminal-cli --agent opencode
```

Manual project install:

```bash
mkdir -p .agents/skills
cp -R ai/skills/terminal-cli .agents/skills/
```

OpenCode discovers `.agents/skills/terminal-cli/SKILL.md` automatically.

## Claude Desktop for a team

Organization-managed plugins appear in claude.ai, the Chat tab in Claude Desktop, and Claude Cowork.

Requirements:

- Claude Team or Enterprise
- Organization owner or primary owner access
- Cowork and Skills enabled for the organization

### Upload the plugin

The fastest rollout is a plugin ZIP:

```bash
cd ai
zip -r ../terminal-cli-plugin.zip . -x "*.DS_Store"
```

In Claude, go to **Organization settings → Plugins → Add plugins → Upload a file**, create or choose a marketplace, and upload the ZIP. Set its installation preference:

- **Installed by default**: everyone receives it but may uninstall it.
- **Required**: everyone receives it and cannot remove it.
- **Available for install**: members choose it from the catalog.

Upload a new ZIP with the same plugin name and a bumped version to replace it.

### Keep it synced from GitHub

Claude organization marketplaces only connect to **private or internal** repositories. This public repository cannot be the organization marketplace source.

For ongoing updates:

1. Create a private repository such as `your-org/claude-plugins`.
2. Vendor or subtree this `ai/` directory as `plugins/terminal-cli/`.
3. Add `.claude-plugin/marketplace.json` with a plugin entry whose source is `./plugins/terminal-cli`.
4. Install the Claude GitHub App on that repository.
5. In **Organization settings → Plugins**, add `your-org/claude-plugins` as a GitHub source.
6. Choose the installation preference. An organization admin may override it by group on Enterprise.

Automatic sync requires repository admin access and the GitHub App's webhook permission. It runs when a pull request that bumps the plugin version merges to the default branch. Direct pushes do not trigger it.

### Skill-only organization install

To distribute only the skill, ZIP `skills/terminal-cli/` so `SKILL.md` is at the archive root, then upload it through **Organization settings → Skills**. This omits plugin namespacing and the bundled commands.

### Execution requirement

The skill calls the `terminal` executable. In Claude Desktop, use it in **Cowork**, where code execution and the locally installed CLI are available. Plain chat can load the instructions but cannot query fleet data without an execution environment.

Each member or managed Cowork environment still needs:

```bash
npm install -g @terminal-api/cli
terminal config set api-key <api-key>
terminal config set connection-token <connection-token>
```

Configure secrets locally; do not put them in the plugin or marketplace repository.

## Example prompts

- “How many safety events did driver John Smith have this week?”
- “Where was vehicle ABC-1234 on August 20?”
- “Which vehicles are moving right now?”
- “Show HOS violations for the last seven days.”
- “List active fault codes for vehicle `vcl_…`.”
- “Summarize IFTA mileage for last quarter.”

In Cursor or Claude Code, you can invoke the command explicitly:

```text
/terminal-cli How many safety events did driver John Smith have this week?
```

## Learn more

- [Terminal CLI](../README.md)
- [Terminal API documentation](https://docs.withterminal.com)
- [Agent Skills specification](https://agentskills.io/specification)
- [Agent Plugins specification](https://agent-plugins.org)
