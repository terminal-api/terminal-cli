import { describe, expect, test } from "bun:test";
import type { Command } from "../generated/index.ts";
import { createInitialState } from "../src/tui/state.ts";
import {
  clearCachedArgs,
  createArgsCache,
  getCachedArgs,
  resolveArgsCacheScopeKey,
  saveArgsToCache,
} from "../src/tui/args-cache.ts";
import { initArgsStateForCommand } from "../src/tui/args.ts";

const CONNECTION_SCOPE = "conn_a";

function makeCommand(partial: Partial<Command>): Command {
  return {
    name: partial.name ?? "test",
    description: partial.description ?? "",
    method: partial.method ?? "POST",
    path: partial.path ?? "/test",
    requiresConnectionToken: partial.requiresConnectionToken ?? false,
    args: partial.args ?? [],
    handler: partial.handler ?? (async () => ({})),
    responseSchema: partial.responseSchema ?? null,
  };
}

describe("args cache", () => {
  test("save and restore cacheable args per command", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "list-vehicles",
      requiresConnectionToken: true,
      args: [
        { name: "limit", type: "number", required: false, description: "" },
        { name: "cursor", type: "string", required: false, description: "" },
      ],
    });

    saveArgsToCache(cache, CONNECTION_SCOPE, cmd, { limit: 50, cursor: "page_2" });

    expect(getCachedArgs(cache, CONNECTION_SCOPE, cmd)).toEqual({ limit: 50 });
  });

  test("account-level commands use global scope regardless of connection", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "list-connections",
      requiresConnectionToken: false,
      args: [{ name: "limit", type: "number", required: false, description: "" }],
    });

    expect(resolveArgsCacheScopeKey(cmd, "conn_a")).toBe("");

    saveArgsToCache(cache, "conn_a", cmd, { limit: 25 });
    saveArgsToCache(cache, "conn_b", cmd, { limit: 50 });

    expect(getCachedArgs(cache, "conn_a", cmd)).toEqual({ limit: 50 });
    expect(getCachedArgs(cache, "conn_b", cmd)).toEqual({ limit: 50 });
    expect(getCachedArgs(cache, "", cmd)).toEqual({ limit: 50 });
  });

  test("drops invalid enum values on restore", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "list-vehicles",
      requiresConnectionToken: true,
      args: [
        {
          name: "expand",
          type: "string",
          required: false,
          description: "",
          enum: ["groups", "devices"],
        },
      ],
    });

    cache.set(`${CONNECTION_SCOPE}\0list-vehicles`, { expand: "invalid" });
    expect(getCachedArgs(cache, CONNECTION_SCOPE, cmd)).toEqual({});
  });

  test("clearCachedArgs removes command entry", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "get-vehicle",
      requiresConnectionToken: true,
      args: [{ name: "id", type: "string", required: true, description: "" }],
    });

    saveArgsToCache(cache, CONNECTION_SCOPE, cmd, { id: "vcl_123" });
    clearCachedArgs(cache, CONNECTION_SCOPE, cmd);

    expect(getCachedArgs(cache, CONNECTION_SCOPE, cmd)).toEqual({});
  });

  test("cache is isolated per connection scope for connection commands", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "get-vehicle",
      requiresConnectionToken: true,
      args: [{ name: "id", type: "string", required: true, description: "" }],
    });

    saveArgsToCache(cache, "conn_a", cmd, { id: "vcl_a" });
    saveArgsToCache(cache, "conn_b", cmd, { id: "vcl_b" });

    expect(getCachedArgs(cache, "conn_a", cmd)).toEqual({ id: "vcl_a" });
    expect(getCachedArgs(cache, "conn_b", cmd)).toEqual({ id: "vcl_b" });
    expect(getCachedArgs(cache, "conn_c", cmd)).toEqual({});
  });

  test("initArgsStateForCommand restores cache and skips to optional-list", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "get-vehicle",
      requiresConnectionToken: true,
      args: [
        { name: "id", type: "string", required: true, description: "" },
        { name: "expand", type: "string", required: false, description: "" },
      ],
    });

    saveArgsToCache(cache, CONNECTION_SCOPE, cmd, { id: "vcl_123", expand: "groups" });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, cache, CONNECTION_SCOPE);

    expect(state.collectedArgs).toEqual({ id: "vcl_123", expand: "groups" });
    expect(state.argsPhase).toBe("optional-list");
  });

  test("initArgsStateForCommand prompts for missing required args", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "get-vehicle",
      requiresConnectionToken: true,
      args: [
        { name: "id", type: "string", required: true, description: "" },
        { name: "vehicleId", type: "string", required: true, description: "" },
      ],
    });

    saveArgsToCache(cache, CONNECTION_SCOPE, cmd, { id: "vcl_123" });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, cache, CONNECTION_SCOPE);

    expect(state.argsPhase).toBe("required");
    expect(state.currentArgIndex).toBe(1);
    expect(state.collectedArgs.id).toBe("vcl_123");
  });
});
