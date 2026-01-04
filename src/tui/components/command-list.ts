import {
  SelectRenderable,
  type BoxRenderable,
  type CliRenderer,
  type SelectOption,
} from "@opentui/core";
import type { Theme } from "../theme.ts";

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
