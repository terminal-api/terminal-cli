# AI Agent Skills & Commands for Terminal CLI

Ready-to-use skills and commands for AI coding assistants that help you query and explore data from the [Terminal Telematics API](https://withterminal.com).

## Supported Tools

| Tool                                      | Type    | Auto-Discovery                            |
| ----------------------------------------- | ------- | ----------------------------------------- |
| **[Cursor](https://cursor.com)**          | Command | No - invoke with `/terminal-cli`          |
| **[Claude Code](https://claude.ai/code)** | Skill   | Yes - AI automatically uses when relevant |
| **[OpenCode](https://opencode.ai)**       | Skill   | Yes - AI automatically uses when relevant |

## Installation

Copy the appropriate folder into your project (or home directory for global access):

### Cursor (Command)

```bash
# Project-level (recommended)
cp -r ai/cursor/commands .cursor/commands

# Or global (available in all projects)
cp -r ai/cursor/commands ~/.cursor/commands
```

Usage: Type `/terminal-cli` in chat to invoke.

### Claude Code (Skill)

```bash
# Project-level (recommended)
cp -r ai/claude-code/skills .claude/skills

# Or global (available in all projects)
cp -r ai/claude-code/skills ~/.claude/skills
```

Usage: The AI will automatically use this skill when you ask about fleet/telematics data.

### OpenCode (Skill)

```bash
# Project-level (recommended)
cp -r ai/opencode/skill .opencode/skill

# Or global (available in all projects)
cp -r ai/opencode/skill ~/.config/opencode/skill
```

Usage: The AI will automatically use this skill when you ask about fleet/telematics data.

## Prerequisites

Ensure the Terminal CLI is installed and configured:

```bash
# Install the CLI
npm install -g @terminal-api/cli

# Configure your API key
terminal config set api-key sk_prod_xxx

# Configure a connection token (required for most queries)
terminal config set connection-token con_tkn_xxx
```

## Example Queries

Once installed, ask your AI assistant questions like:

- "How many safety events occurred for driver John Smith this week?"
- "Where was vehicle ABC-1234 on January 2nd?"
- "Which vehicles have active movement right now?"
- "Show me all HOS violations for the past 7 days"
- "List all fault codes for vehicle ID vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC"
- "What's the IFTA summary for last quarter?"

For **Cursor**, prefix with `/terminal-cli`:

```
/terminal-cli How many safety events for driver X this week?
```

For **Claude Code** and **OpenCode**, just ask naturally - the skill is discovered automatically.

## Connection Tokens

Most Terminal API queries require a connection token that identifies the fleet/TSP connection. If you haven't configured one, the AI will prompt you to provide it.

You can also pass a connection token per-query:

```bash
terminal list-vehicles --connection-token con_tkn_xxx
```

## Learn More

- [Terminal API Documentation](https://docs.withterminal.com)
- [Cursor Commands Docs](https://cursor.com/docs/agent/chat/commands)
- [Claude Code Skills](https://docs.anthropic.com/en/docs/claude-code/skills)
- [OpenCode Skills](https://opencode.ai/docs/skills/)
