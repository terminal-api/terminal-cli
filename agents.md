# Agent Instructions

This document provides instructions for AI agents working on this codebase.

## After Making Changes

After making any code changes, always run the check script to verify your changes:

```bash
bun run check
```

This runs:

1. **Type checking** (`bun run typecheck`) - Ensures TypeScript types are correct
2. **Linting** (`bun run lint`) - Checks code style and catches common errors
3. **Formatting** (`bun run format:check`) - Verifies code formatting
4. **Tests** (`bun test`) - Runs the test suite

All four must pass before changes can be considered complete.

## Project Structure

- `src/` - Source code
  - `cli.ts` - Main CLI entrypoint
  - `lib/` - Core libraries (client, config, output, completions)
- `generated/` - Auto-generated command files from OpenAPI spec
- `scripts/` - Build and generation scripts
- `tests/` - Test files

## Common Tasks

### Regenerating Commands

If the OpenAPI spec changes, regenerate commands:

```bash
bun run generate
```

### Running Individual Checks

```bash
bun run typecheck  # Type checking only
bun run lint       # Linting only
bun run format:check  # Formatting check only
bun test           # Tests only
```

### Running the CLI

```bash
bun run dev <command>  # Development mode
```

## Test Structure

Tests use Bun's built-in test runner with a mock HTTP server:

- `tests/mock-server.ts` - Mock server with sample API responses
- `tests/client.test.ts` - HTTP client tests
- `tests/config.test.ts` - Configuration tests
- `tests/cli.test.ts` - CLI integration tests

## CI/CD

GitHub Actions runs `bun run check` on:

- Pushes to `main`
- Pull requests targeting `main`
