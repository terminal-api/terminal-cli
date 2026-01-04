import { StyledText, dim, white } from "@opentui/core";
import type { TuiContext } from "./types.ts";
import { isConnectionsView } from "./constants.ts";
import { getRequiredArgs, showCurrentArgInput } from "./args.ts";
import { resultsToOptions } from "./results.ts";
import { formatDetail } from "./detail.ts";

function buildHotkeysContent(hotkeys: Array<{ key: string; action: string }>) {
  const chunks = hotkeys.flatMap(({ key, action }, index) => {
    const parts = [white(key), dim(` ${action}`)];
    if (index < hotkeys.length - 1) {
      parts.push(dim("    "));
    }
    return parts;
  });

  return new StyledText([dim("  "), ...chunks]);
}

export function updateStatusBar(context: TuiContext): void {
  const { state, components } = context;
  const { statusBar } = components;

  if (state.loading) {
    statusBar.content = "Loading...";
    return;
  }
  if (state.error) {
    statusBar.content = `Error: ${state.error}`;
    return;
  }

  let hotkeys: Array<{ key: string; action: string }>;

  if (state.currentView === "args") {
    hotkeys = [
      { key: "enter", action: "submit" },
      { key: "esc", action: "cancel" },
      { key: "q", action: "quit" },
    ];
  } else if (state.currentView === "detail") {
    hotkeys = [
      { key: "c", action: "copy" },
      { key: "esc", action: "back" },
      { key: "q", action: "quit" },
    ];
  } else if (state.currentView === "results") {
    const actionLabel = isConnectionsView(state) ? "select" : "details";
    hotkeys = [
      { key: "/", action: "search" },
      { key: "enter", action: actionLabel },
      { key: "tab", action: "commands" },
      { key: "esc", action: "back" },
      { key: "q", action: "quit" },
    ];
  } else {
    hotkeys = [
      { key: "enter", action: "select" },
      { key: "tab", action: "results" },
      { key: "q", action: "quit" },
    ];
  }

  statusBar.content = buildHotkeysContent(hotkeys);
}

export function updateView(context: TuiContext): void {
  const { state, components } = context;
  const {
    commandSelect,
    resultsSelect,
    filterInput,
    detailContainer,
    detailPanel,
    argsContainer,
    titleDisplay,
  } = components;

  commandSelect.visible = false;
  resultsSelect.visible = false;
  filterInput.visible = false;
  detailContainer.visible = false;
  argsContainer.visible = false;

  if (state.currentView === "commands") {
    titleDisplay.content = "Select Command";
    commandSelect.visible = true;
    commandSelect.focus();
  } else if (state.currentView === "args") {
    const cmdName = state.selectedCommand?.name ?? "Command";
    const requiredArgs = state.selectedCommand ? getRequiredArgs(state.selectedCommand) : [];
    titleDisplay.content = `${cmdName} - Argument ${state.currentArgIndex + 1}/${requiredArgs.length}`;
    argsContainer.visible = true;
    showCurrentArgInput(state, components);
  } else if (state.currentView === "results") {
    const cmdName = state.selectedCommand?.name ?? "Results";
    const connectionsHint = isConnectionsView(state) ? " | Enter: set as active connection" : "";

    if (state.loading) {
      titleDisplay.content = `${cmdName} - Loading...`;
      resultsSelect.visible = false;
      filterInput.visible = false;
    } else {
      const resultCount = state.filteredResults?.length ?? 0;
      titleDisplay.content = `${cmdName} (${resultCount} items)${connectionsHint}`;
      const currentOptions = resultsToOptions(
        state.filteredResults ?? [],
        isConnectionsView(state),
      );
      resultsSelect.options = currentOptions;

      const maxIndex = currentOptions.length - 1;
      const nextIndex = maxIndex >= 0 ? Math.min(state.selectedResultIndex, maxIndex) : 0;
      state.selectedResultIndex = nextIndex;
      if (currentOptions.length > 0) {
        resultsSelect.setSelectedIndex(nextIndex);
      }

      if (resultCount === 0) {
        resultsSelect.visible = false;
        filterInput.visible = false;
      } else {
        resultsSelect.visible = true;
        filterInput.visible = true;
        if (!filterInput.focused) {
          resultsSelect.focus();
        }
      }
    }
  } else if (state.currentView === "detail") {
    titleDisplay.content = "Item Detail (Escape to go back)";
    detailContainer.visible = true;

    if (state.selectedItem) {
      detailPanel.content = formatDetail(state.selectedItem);
    }
  }

  updateStatusBar(context);
}
