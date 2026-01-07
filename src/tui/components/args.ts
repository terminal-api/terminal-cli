import {
  BoxRenderable,
  InputRenderable,
  SelectRenderable,
  TextRenderable,
  type CliRenderer,
} from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createArgsInput(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): {
  argsContainer: BoxRenderable;
  argLabel: TextRenderable;
  argInput: InputRenderable;
  argEnumSelect: SelectRenderable;
  optionalArgsSelect: SelectRenderable;
} {
  const argsContainer = new BoxRenderable(renderer, {
    id: "args-container",
    width: "100%",
    height: theme.sizes.listHeight,
    flexDirection: "column",
    padding: 1,
    visible: false,
  });
  contentArea.add(argsContainer);

  const argLabel = new TextRenderable(renderer, {
    id: "arg-label",
    content: "",
    width: "100%",
    height: 6,
    marginBottom: 1,
    fg: theme.colors.textMuted,
  });
  argsContainer.add(argLabel);

  const optionalArgsSelect = new SelectRenderable(renderer, {
    id: "optional-args-select",
    width: "100%",
    height: theme.sizes.enumListHeight,
    options: [],
    backgroundColor: theme.colors.panelBackground,
    focusedBackgroundColor: theme.colors.panelFocusedBackground,
    textColor: theme.colors.textPrimary,
    focusedTextColor: theme.colors.textBright,
    selectedBackgroundColor: theme.colors.selectionBlue,
    selectedTextColor: theme.colors.textBright,
    descriptionColor: theme.colors.textMuted,
    showDescription: true,
    visible: false,
  });
  argsContainer.add(optionalArgsSelect);

  const argInput = new InputRenderable(renderer, {
    id: "arg-input",
    width: "100%",
    height: 1,
    placeholder: "Enter value...",
    backgroundColor: theme.colors.inputBackground,
    focusedBackgroundColor: theme.colors.inputFocusedBackground,
    visible: false,
  });
  argsContainer.add(argInput);

  const argEnumSelect = new SelectRenderable(renderer, {
    id: "arg-enum-select",
    width: "100%",
    height: theme.sizes.enumListHeight,
    options: [],
    backgroundColor: theme.colors.panelBackground,
    focusedBackgroundColor: theme.colors.panelFocusedBackground,
    textColor: theme.colors.textPrimary,
    focusedTextColor: theme.colors.textBright,
    selectedBackgroundColor: theme.colors.selectionBlue,
    selectedTextColor: theme.colors.textBright,
    descriptionColor: theme.colors.textMuted,
    showDescription: true,
    visible: false,
  });
  argsContainer.add(argEnumSelect);

  return { argsContainer, argLabel, argInput, argEnumSelect, optionalArgsSelect };
}
