import {
  InputRenderable,
  SelectRenderable,
  type BoxRenderable,
  type CliRenderer,
} from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createSearchInput(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): InputRenderable {
  const filterInput = new InputRenderable(renderer, {
    id: "search-input",
    width: "100%",
    height: 1,
    placeholder: "Type to search...",
    backgroundColor: theme.colors.inputBackground,
    focusedBackgroundColor: theme.colors.inputFocusedBackground,
    marginBottom: 1,
    visible: false,
  });
  contentArea.add(filterInput);

  return filterInput;
}

export function createResultsList(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): SelectRenderable {
  const resultsSelect = new SelectRenderable(renderer, {
    id: "results-select",
    width: "100%",
    height: theme.sizes.listHeight,
    options: [],
    backgroundColor: theme.colors.panelBackground,
    focusedBackgroundColor: theme.colors.panelFocusedBackground,
    textColor: theme.colors.textPrimary,
    focusedTextColor: theme.colors.textBright,
    selectedBackgroundColor: theme.colors.selectionGreen,
    selectedTextColor: theme.colors.textBright,
    descriptionColor: theme.colors.textMuted,
    selectedDescriptionColor: theme.colors.textPrimary,
    showDescription: true,
    showScrollIndicator: true,
    wrapSelection: true,
    visible: false,
  });
  contentArea.add(resultsSelect);

  return resultsSelect;
}
