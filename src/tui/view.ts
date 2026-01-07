import { StyledText, dim, white } from "@opentui/core";
import type { TuiContext } from "./types.ts";
import { isConnectionsView } from "./constants.ts";
import { getOptionalArgs, getRequiredArgs, updateArgsView } from "./args.ts";
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
    // Show hotkeys for error state - allow navigating back
    const hotkeys = [
      { key: "tab", action: "commands" },
      { key: "esc", action: "back" },
      { key: "ctrl+c", action: "quit" },
    ];
    statusBar.content = buildHotkeysContent(hotkeys);
    return;
  }

  let hotkeys: Array<{ key: string; action: string }>;

  if (state.currentView === "args") {
    if (state.argsPhase === "optional-list") {
      hotkeys = [
        { key: "s", action: "submit" },
        { key: "enter", action: "edit" },
        { key: "esc", action: "cancel" },
        { key: "ctrl+c", action: "quit" },
      ];
    } else if (state.argsPhase === "optional-edit") {
      hotkeys = [
        { key: "enter", action: "save" },
        { key: "esc", action: "back" },
        { key: "ctrl+c", action: "quit" },
      ];
    } else {
      hotkeys = [
        { key: "enter", action: "next" },
        { key: "esc", action: "cancel" },
        { key: "ctrl+c", action: "quit" },
      ];
    }
  } else if (state.currentView === "detail") {
    hotkeys = [
      { key: "i", action: "copy id" },
      { key: "c", action: "copy json" },
      { key: "esc", action: "back" },
      { key: "ctrl+c", action: "quit" },
    ];
  } else if (state.currentView === "results") {
    const actionLabel = isConnectionsView(state) ? "select" : "details";
    hotkeys = [
      { key: "/", action: "search" },
      { key: "enter", action: actionLabel },
      { key: "tab", action: "commands" },
      { key: "esc", action: "back" },
      { key: "ctrl+c", action: "quit" },
    ];
  } else {
    hotkeys = [
      { key: "/", action: "search" },
      { key: "enter", action: "select" },
      { key: "tab", action: "results" },
      { key: "ctrl+c", action: "quit" },
    ];
  }

  statusBar.content = buildHotkeysContent(hotkeys);
}

function updateErrorPanel(context: TuiContext): void {
  const { state, components } = context;
  const { errorContainer, errorTitle, errorStatus, errorMessage, errorDetail } = components;

  if (!state.error) {
    errorContainer.visible = false;
    return;
  }

  errorContainer.visible = true;
  errorTitle.content = "Request Failed";

  // Build status line with HTTP status and error code
  const statusParts: string[] = [];
  if (state.error.status) {
    statusParts.push(`HTTP ${state.error.status}`);
  }
  if (state.error.code) {
    statusParts.push(`Code: ${state.error.code}`);
  }
  errorStatus.content = statusParts.length > 0 ? statusParts.join("  |  ") : "";
  errorStatus.visible = statusParts.length > 0;

  // Show the error message
  errorMessage.content = state.error.message;

  // Show detail if available
  if (state.error.detail) {
    const detailStr =
      typeof state.error.detail === "string"
        ? state.error.detail
        : JSON.stringify(state.error.detail, null, 2);
    errorDetail.content = detailStr;
    errorDetail.visible = true;
  } else {
    errorDetail.visible = false;
  }
}

export function updateView(context: TuiContext): void {
  const { state, components } = context;
  const {
    commandSelect,
    commandFilterInput,
    resultsSelect,
    filterInput,
    detailContainer,
    detailPanel,
    argsContainer,
    titleDisplay,
    errorContainer,
  } = components;

  commandSelect.visible = false;
  commandFilterInput.visible = false;
  resultsSelect.visible = false;
  filterInput.visible = false;
  detailContainer.visible = false;
  argsContainer.visible = false;
  errorContainer.visible = false;

  if (state.currentView === "commands") {
    titleDisplay.content = "Select Command";
    commandFilterInput.visible = true;
    commandSelect.visible = true;
    if (!commandFilterInput.focused) {
      commandSelect.focus();
    }
  } else if (state.currentView === "args") {
    const cmdName = state.selectedCommand?.name ?? "Command";
    const requiredArgs = state.selectedCommand ? getRequiredArgs(state.selectedCommand) : [];
    const optionalArgs = state.selectedCommand ? getOptionalArgs(state.selectedCommand) : [];

    argsContainer.visible = true;
    updateArgsView(state, components);

    if (state.argsPhase === "required") {
      titleDisplay.content = `${cmdName} - Required ${state.currentArgIndex + 1}/${Math.max(1, requiredArgs.length)}`;
    } else if (state.argsPhase === "optional-edit") {
      const argName = state.editingOptionalArgName ?? "Optional";
      titleDisplay.content = `${cmdName} - Edit ${argName}`;
    } else {
      titleDisplay.content = `${cmdName} - Optional (${optionalArgs.length} fields)`;
    }
  } else if (state.currentView === "results") {
    const cmdName = state.selectedCommand?.name ?? "Results";
    const connectionsHint = isConnectionsView(state) ? " | Enter: set as active connection" : "";

    if (state.loading) {
      titleDisplay.content = `${cmdName} - Loading...`;
      resultsSelect.visible = false;
      filterInput.visible = false;
    } else if (state.error) {
      // Show error panel in results area
      titleDisplay.content = `${cmdName} - Error`;
      updateErrorPanel(context);
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
