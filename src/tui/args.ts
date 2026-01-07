import type { SelectOption } from "@opentui/core";
import type { Command, CommandArg } from "../../generated/index.ts";
import type { AppState } from "./state.ts";
import type { UiComponents } from "./types.ts";

const SUBMIT_OPTION_VALUE = "__submit__";
const UNSET_OPTION_VALUE = "__unset__";

export function getRequiredArgs(cmd: Command): CommandArg[] {
  return cmd.args.filter((arg) => arg.required);
}

export function getOptionalArgs(cmd: Command): CommandArg[] {
  return cmd.args.filter((arg) => !arg.required);
}

export function shouldPromptForArgs(cmd: Command): boolean {
  return cmd.args.length > 0;
}

export function initArgsStateForCommand(state: AppState, cmd: Command): void {
  state.collectedArgs = {};
  state.currentArgIndex = 0;
  state.optionalArgIndex = 0;
  state.editingOptionalArgName = null;

  const requiredArgs = getRequiredArgs(cmd);
  state.argsPhase = requiredArgs.length > 0 ? "required" : "optional-list";
}

export function cancelArgsFlow(state: AppState): void {
  state.collectedArgs = {};
  state.currentArgIndex = 0;
  state.optionalArgIndex = 0;
  state.editingOptionalArgName = null;
  state.argsPhase = "required";
}

export function getActiveArg(state: AppState): CommandArg | null {
  const cmd = state.selectedCommand;
  if (!cmd) return null;

  const requiredArgs = getRequiredArgs(cmd);
  const optionalArgs = getOptionalArgs(cmd);

  if (state.argsPhase === "required") {
    return requiredArgs[state.currentArgIndex] ?? null;
  }

  if (state.argsPhase === "optional-edit" && state.editingOptionalArgName) {
    return optionalArgs.find((arg) => arg.name === state.editingOptionalArgName) ?? null;
  }

  return null;
}

function stringifyExistingValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
}

function buildArgLabelContent(params: {
  phase: "required" | "optional-edit";
  arg: CommandArg;
  requiredArgs: CommandArg[];
  optionalArgs: CommandArg[];
}): string {
  const { phase, arg, requiredArgs, optionalArgs } = params;

  const requiredNames = requiredArgs.map((a) => a.name).join(", ") || "(none)";
  const optionalNames = optionalArgs.map((a) => a.name).join(", ") || "(none)";
  const kind = phase === "required" ? "Required field" : "Optional field";

  const hint = phase === "required" ? "Enter to continue" : "Enter to save (empty to unset)";

  const enumInfo = arg.enum ? `\nAllowed: ${arg.enum.join(", ")}` : "";

  return [
    `Required: ${requiredNames}`,
    `Optional: ${optionalNames}`,
    "",
    `${kind}: ${arg.name}${arg.required ? " (required)" : " (optional)"}`,
    arg.description || "No description",
    enumInfo,
    "",
    hint,
  ].join("\n");
}

function buildOptionalListLabelContent(params: {
  requiredArgs: CommandArg[];
  optionalArgs: CommandArg[];
  state: AppState;
}): string {
  const { requiredArgs, optionalArgs, state } = params;

  const requiredSummary =
    requiredArgs.length === 0
      ? "(none)"
      : requiredArgs
          .map((arg) => (arg.name in state.collectedArgs ? `${arg.name} ✓` : `${arg.name} ✗`))
          .join(", ");

  const optionalSummary =
    optionalArgs.length === 0 ? "(none)" : optionalArgs.map((a) => a.name).join(", ");

  return [
    `Required: ${requiredSummary}`,
    `Optional: ${optionalSummary}`,
    "",
    "Select an optional field to set, or choose Submit.",
  ].join("\n");
}

function buildOptionalArgsOptions(cmd: Command, state: AppState): SelectOption[] {
  const options: SelectOption[] = [
    {
      name: "Submit",
      description: "Run command with current inputs",
      value: SUBMIT_OPTION_VALUE,
    },
  ];

  const optionalArgs = getOptionalArgs(cmd);

  for (const arg of optionalArgs) {
    const hasValue = arg.name in state.collectedArgs;
    options.push({
      name: hasValue ? `${arg.name} ✓` : arg.name,
      description: arg.description || "",
      value: arg.name,
    });
  }

  return options;
}

export function updateArgsView(state: AppState, components: UiComponents): void {
  const cmd = state.selectedCommand;
  if (!cmd) return;

  const requiredArgs = getRequiredArgs(cmd);
  const optionalArgs = getOptionalArgs(cmd);
  const { argLabel, argInput, argEnumSelect, optionalArgsSelect } = components;

  argInput.visible = false;
  argEnumSelect.visible = false;
  optionalArgsSelect.visible = false;

  if (state.argsPhase === "required") {
    if (requiredArgs.length === 0) {
      state.argsPhase = "optional-list";
      updateArgsView(state, components);
      return;
    }

    const currentArg = requiredArgs[state.currentArgIndex];
    if (!currentArg) {
      state.argsPhase = "optional-list";
      updateArgsView(state, components);
      return;
    }

    argLabel.content = buildArgLabelContent({
      phase: "required",
      arg: currentArg,
      requiredArgs,
      optionalArgs,
    });

    showArgEditor(state, components, currentArg);
    return;
  }

  if (state.argsPhase === "optional-list") {
    argLabel.content = buildOptionalListLabelContent({ requiredArgs, optionalArgs, state });

    const options = buildOptionalArgsOptions(cmd, state);
    optionalArgsSelect.options = options;
    optionalArgsSelect.visible = true;

    const maxIndex = Math.max(0, options.length - 1);
    state.optionalArgIndex = Math.max(0, Math.min(state.optionalArgIndex, maxIndex));
    optionalArgsSelect.setSelectedIndex(state.optionalArgIndex);
    optionalArgsSelect.focus();
    return;
  }

  if (state.argsPhase === "optional-edit") {
    const currentArg = getActiveArg(state);
    if (!currentArg) {
      state.argsPhase = "optional-list";
      state.editingOptionalArgName = null;
      updateArgsView(state, components);
      return;
    }

    argLabel.content = buildArgLabelContent({
      phase: "optional-edit",
      arg: currentArg,
      requiredArgs,
      optionalArgs,
    });

    showArgEditor(state, components, currentArg);
  }
}

function showArgEditor(state: AppState, components: UiComponents, arg: CommandArg): void {
  const { argInput, argEnumSelect } = components;

  const existingValue = state.collectedArgs[arg.name];

  if (arg.enum && arg.enum.length > 0) {
    argInput.visible = false;

    const options: SelectOption[] = [];
    if (!arg.required && state.argsPhase === "optional-edit") {
      options.push({
        name: "(unset)",
        description: "Clear this optional field",
        value: UNSET_OPTION_VALUE,
      });
    }

    options.push(
      ...arg.enum.map((value) => ({
        name: value,
        description: "",
        value,
      })),
    );

    argEnumSelect.options = options;
    argEnumSelect.visible = true;

    const existingStr = stringifyExistingValue(existingValue);
    const selectedIndex = options.findIndex((o) => o.value === existingStr);
    argEnumSelect.setSelectedIndex(Math.max(0, selectedIndex));
    argEnumSelect.focus();
    return;
  }

  argEnumSelect.visible = false;
  argInput.visible = true;
  argInput.value = state.argsPhase === "optional-edit" ? stringifyExistingValue(existingValue) : "";
  argInput.focus();
}

export type ParseResult = { ok: true; value: unknown } | { ok: false; error: string };

export function parseArgInputValue(arg: CommandArg, raw: string): ParseResult {
  const trimmed = raw.trim();

  // When editing optionals, empty means "unset".
  if (!trimmed) {
    return { ok: true, value: undefined };
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return { ok: true, value: JSON.parse(trimmed) };
    } catch {
      return { ok: false, error: "Invalid JSON" };
    }
  }

  if (arg.type === "number") {
    const num = Number(trimmed);
    if (Number.isNaN(num)) {
      return { ok: false, error: "Expected a number" };
    }
    return { ok: true, value: num };
  }

  if (arg.type === "boolean") {
    if (trimmed === "true") return { ok: true, value: true };
    if (trimmed === "false") return { ok: true, value: false };
    return { ok: false, error: "Expected true or false" };
  }

  if (arg.type === "array") {
    const parts = trimmed
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    return { ok: true, value: parts };
  }

  if (arg.type === "object") {
    return { ok: false, error: "Expected a JSON object" };
  }

  return { ok: true, value: trimmed };
}

export type SubmitResult =
  | { kind: "error"; message: string }
  | { kind: "continue" }
  | { kind: "optional-list" };

export function submitActiveArg(state: AppState, rawValue: string): SubmitResult {
  const arg = getActiveArg(state);
  if (!arg) {
    return { kind: "optional-list" };
  }

  if (state.argsPhase === "required" && !rawValue.trim()) {
    return { kind: "error", message: `${arg.name} is required` };
  }

  const parsed = parseArgInputValue(arg, rawValue);
  if (!parsed.ok) {
    return { kind: "error", message: `${arg.name}: ${parsed.error}` };
  }

  if (state.argsPhase === "required") {
    state.collectedArgs[arg.name] = parsed.value;

    const cmd = state.selectedCommand!;
    const requiredArgs = getRequiredArgs(cmd);

    if (state.currentArgIndex < requiredArgs.length - 1) {
      state.currentArgIndex++;
      return { kind: "continue" };
    }

    state.argsPhase = "optional-list";
    return { kind: "optional-list" };
  }

  if (state.argsPhase === "optional-edit") {
    if (parsed.value === undefined) {
      delete state.collectedArgs[arg.name];
    } else {
      state.collectedArgs[arg.name] = parsed.value;
    }

    state.argsPhase = "optional-list";
    state.editingOptionalArgName = null;
    return { kind: "optional-list" };
  }

  return { kind: "optional-list" };
}

export function handleOptionalListSelection(
  state: AppState,
  optionValue: unknown,
): {
  submit: boolean;
} {
  if (optionValue === SUBMIT_OPTION_VALUE) {
    return { submit: true };
  }

  if (typeof optionValue === "string") {
    state.argsPhase = "optional-edit";
    state.editingOptionalArgName = optionValue;
  }

  return { submit: false };
}

export function isUnsetEnumValue(value: unknown): boolean {
  return value === UNSET_OPTION_VALUE;
}
