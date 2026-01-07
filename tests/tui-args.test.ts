import { describe, expect, test } from "bun:test";
import type { Command } from "../generated/index.ts";
import { createInitialState } from "../src/tui/state.ts";
import {
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
    initArgsStateForCommand(state, cmd);

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
    initArgsStateForCommand(state, cmd);

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
    initArgsStateForCommand(state, cmd);

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
    initArgsStateForCommand(state, cmd);

    const res = handleOptionalListSelection(state, "startFrom");
    expect(res.submit).toBe(false);
    expect(state.argsPhase).toBe("optional-edit");
    expect(state.editingOptionalArgName).toBe("startFrom");
  });

  test("handleOptionalListSelection submits on Submit option", () => {
    const cmd = makeCommand({
      args: [{ name: "startFrom", type: "string", required: false, description: "" }],
    });

    const state = createInitialState();
    state.selectedCommand = cmd;
    initArgsStateForCommand(state, cmd);

    const res = handleOptionalListSelection(state, "__submit__");
    expect(res.submit).toBe(true);
  });
});
