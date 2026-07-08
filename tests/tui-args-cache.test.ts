import { describe, expect, test } from "bun:test";
import type { Command } from "../generated/index.ts";
import { createInitialState } from "../src/tui/state.ts";
import {
  clearCachedArgs,
  createArgsCache,
  getCachedArgs,
  saveArgsToCache,
} from "../src/tui/args-cache.ts";
import { initArgsStateForCommand } from "../src/tui/args.ts";

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
      args: [
        { name: "limit", type: "number", required: false, description: "" },
        { name: "cursor", type: "string", required: false, description: "" },
      ],
    });

    saveArgsToCache(cache, cmd, { limit: 50, cursor: "page_2" });

    expect(getCachedArgs(cache, cmd)).toEqual({ limit: 50 });
  });

  test("drops invalid enum values on restore", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "list-vehicles",
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

    cache.set("list-vehicles", { expand: "invalid" });
    expect(getCachedArgs(cache, cmd)).toEqual({});
  });

  test("clearCachedArgs removes command entry", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "get-vehicle",
      args: [{ name: "id", type: "string", required: true, description: "" }],
    });

    saveArgsToCache(cache, cmd, { id: "vcl_123" });
    clearCachedArgs(cache, cmd.name);

    expect(getCachedArgs(cache, cmd)).toEqual({});
  });

  test("initArgsStateForCommand restores cache and skips to optional-list", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "get-vehicle",
      args: [
        { name: "id", type: "string", required: true, description: "" },
        { name: "expand", type: "string", required: false, description: "" },
      ],
    });

    saveArgsToCache(cache, cmd, { id: "vcl_123", expand: "groups" });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, cache);

    expect(state.collectedArgs).toEqual({ id: "vcl_123", expand: "groups" });
    expect(state.argsPhase).toBe("optional-list");
  });

  test("initArgsStateForCommand prompts for missing required args", () => {
    const cache = createArgsCache();
    const cmd = makeCommand({
      name: "get-vehicle",
      args: [
        { name: "id", type: "string", required: true, description: "" },
        { name: "vehicleId", type: "string", required: true, description: "" },
      ],
    });

    saveArgsToCache(cache, cmd, { id: "vcl_123" });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, cache);

    expect(state.argsPhase).toBe("required");
    expect(state.currentArgIndex).toBe(1);
    expect(state.collectedArgs.id).toBe("vcl_123");
  });
});
