import { describe, expect, test } from "bun:test";
import type { Command } from "../generated/index.ts";
import { createInitialState } from "../src/tui/state.ts";
import { createArgsCache } from "../src/tui/args-cache.ts";
import {
  buildOptionalArgsOptions,
  formatCollectedArgValue,
  handleOptionalListSelection,
  initArgsStateForCommand,
  submitActiveArg,
} from "../src/tui/args.ts";

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

describe("tui args flow", () => {
  test("initArgsStateForCommand starts optional-list when no required", () => {
    const cmd = makeCommand({
      args: [
        { name: "startFrom", type: "string", required: false, description: "" },
        { name: "days", type: "number", required: false, description: "" },
      ],
    });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, createArgsCache(), "");

    expect(state.argsPhase as string).toBe("optional-list");
  });

  test("required args require explicit submit then optional-list", () => {
    const cmd = makeCommand({
      args: [
        { name: "id", type: "string", required: true, description: "" },
        { name: "expand", type: "string", required: false, description: "" },
      ],
    });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, createArgsCache(), "");

    expect(state.argsPhase).toBe("required");

    const missing = submitActiveArg(state, "");
    expect(missing.kind).toBe("error");

    const ok = submitActiveArg(state, "vcl_123");
    expect(ok.kind).toBe("optional-list");
    expect(state.argsPhase as string).toBe("optional-list");
    expect(state.collectedArgs.id).toBe("vcl_123");
  });

  test("optional edit can unset field with empty", () => {
    const cmd = makeCommand({
      args: [{ name: "days", type: "number", required: false, description: "" }],
    });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, createArgsCache(), "");

    state.argsPhase = "optional-edit";
    state.editingOptionalArgName = "days";

    submitActiveArg(state, "7");
    expect(state.collectedArgs.days).toBe(7);
    expect(state.argsPhase as string).toBe("optional-list");

    state.argsPhase = "optional-edit";
    state.editingOptionalArgName = "days";
    submitActiveArg(state, "");

    expect("days" in state.collectedArgs).toBe(false);
    expect(state.argsPhase as string).toBe("optional-list");
  });

  test("handleOptionalListSelection enters optional-edit", () => {
    const cmd = makeCommand({
      args: [{ name: "startFrom", type: "string", required: false, description: "" }],
    });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, createArgsCache(), "");

    const res = handleOptionalListSelection(state, "startFrom");
    expect(res.submit).toBe(false);
    expect(res.clearSaved).toBe(false);
    expect(state.argsPhase).toBe("optional-edit");
    expect(state.editingOptionalArgName).toBe("startFrom");
  });

  test("handleOptionalListSelection submits on Submit option", () => {
    const cmd = makeCommand({
      args: [{ name: "startFrom", type: "string", required: false, description: "" }],
    });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, createArgsCache(), "");

    const res = handleOptionalListSelection(state, "__submit__");
    expect(res.submit).toBe(true);
    expect(res.clearSaved).toBe(false);
  });

  test("formatCollectedArgValue renders compact previews", () => {
    expect(formatCollectedArgValue("raw")).toBe("raw");
    expect(formatCollectedArgValue(7)).toBe("7");
    expect(formatCollectedArgValue(true)).toBe("true");
    expect(formatCollectedArgValue({ a: 1 })).toBe('{"a":1}');
    expect(formatCollectedArgValue("x".repeat(60)).endsWith("…")).toBe(true);
  });

  test("buildOptionalArgsOptions shows saved value previews", () => {
    const cmd = makeCommand({
      args: [
        { name: "startedAfter", type: "string", required: false, description: "ISO timestamp" },
        { name: "raw", type: "boolean", required: false, description: "Return raw payload" },
      ],
    });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd, createArgsCache(), "");
    state.collectedArgs.startedAfter = "2024-01-01T00:00:00Z";
    state.collectedArgs.raw = true;

    const options = buildOptionalArgsOptions(cmd, state, createArgsCache(), "");
    const startedAfter = options.find((option) => option.value === "startedAfter");
    const raw = options.find((option) => option.value === "raw");
    const unset = options.find((option) => option.value === "startFrom");

    expect(startedAfter?.name).toBe("startedAfter ✓");
    expect(startedAfter?.description).toBe("2024-01-01T00:00:00Z");
    expect(raw?.name).toBe("raw ✓");
    expect(raw?.description).toBe("true");
    expect(unset).toBeUndefined();
  });
});
