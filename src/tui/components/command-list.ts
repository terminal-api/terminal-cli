import {
  InputRenderable,
  SelectRenderable,
  type BoxRenderable,
  type CliRenderer,
  type SelectOption,
} from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createCommandFilterInput(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): InputRenderable {
  const commandFilterInput = new InputRenderable(renderer, {
    id: "command-filter-input",
    width: "100%",
    height: 1,
    placeholder: "Type to search commands...",
    backgroundColor: theme.colors.inputBackground,
    focusedBackgroundColor: theme.colors.inputFocusedBackground,
    marginBottom: 1,
    visible: false,
  });
  contentArea.add(commandFilterInput);

  return commandFilterInput;
}

export function createCommandList(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
  options: SelectOption[],
): SelectRenderable {
  const commandSelect = new SelectRenderable(renderer, {
    id: "command-select",
    width: "100%",
    height: theme.sizes.listHeight,
    options,
    backgroundColor: theme.colors.panelBackground,
    focusedBackgroundColor: theme.colors.panelFocusedBackground,
    textColor: theme.colors.textPrimary,
    focusedTextColor: theme.colors.textBright,
    selectedBackgroundColor: theme.colors.selectionBlue,
    selectedTextColor: theme.colors.textBright,
    descriptionColor: theme.colors.textMuted,
    selectedDescriptionColor: theme.colors.textPrimary,
    showDescription: true,
    showScrollIndicator: true,
    wrapSelection: true,
  });
  contentArea.add(commandSelect);

  return commandSelect;
}
