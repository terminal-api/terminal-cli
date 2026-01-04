import type { Command, CommandArg } from "../../generated/index.ts";
import type { AppState } from "./state.ts";
import type { UiComponents } from "./types.ts";

export function getRequiredArgs(cmd: Command): CommandArg[] {
  return cmd.args.filter((arg) => arg.required);
}

export function getCurrentArg(state: AppState): CommandArg | null {
  if (!state.selectedCommand) return null;
  const requiredArgs = getRequiredArgs(state.selectedCommand);
  return requiredArgs[state.currentArgIndex] ?? null;
}

export function recordArgValue(state: AppState, value: unknown): { done: boolean } {
  const currentArg = getCurrentArg(state);
  if (!currentArg) {
    return { done: true };
  }

  state.collectedArgs[currentArg.name] = value;

  const requiredArgs = getRequiredArgs(state.selectedCommand!);
  if (state.currentArgIndex < requiredArgs.length - 1) {
    state.currentArgIndex++;
    return { done: false };
  }

  return { done: true };
}

export function showCurrentArgInput(state: AppState, components: UiComponents): void {
  const currentArg = getCurrentArg(state);
  if (!currentArg) return;

  const { argLabel, argInput, argEnumSelect } = components;

  const requiredMark = currentArg.required ? " (required)" : "";
  const enumInfo = currentArg.enum ? ` [${currentArg.enum.join(", ")}]` : "";
  argLabel.content = `${currentArg.name}${requiredMark}${enumInfo}\n${currentArg.description || "No description"}`;

  if (currentArg.enum && currentArg.enum.length > 0) {
    argInput.visible = false;
    argEnumSelect.visible = true;
    argEnumSelect.options = currentArg.enum.map((value: string) => ({
      name: value,
      description: "",
      value,
    }));
    argEnumSelect.focus();
  } else {
    argEnumSelect.visible = false;
    argInput.visible = true;
    argInput.value = "";
    argInput.focus();
  }
}
