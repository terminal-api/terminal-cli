import { InputRenderableEvents, SelectRenderableEvents, type KeyEvent } from "@opentui/core";
import type { TuiContext } from "./types.ts";
import { findCommandByName } from "./commands.ts";
import { executeCommand } from "./actions.ts";
import { recordArgValue, showCurrentArgInput, getRequiredArgs } from "./args.ts";
import { setActiveConnection } from "./connection.ts";
import { filterResults } from "./results.ts";
import { updateStatusBar, updateView } from "./view.ts";
import { copyToClipboard } from "./detail.ts";
import { isConnectionsView } from "./constants.ts";

export function setupHandlers(context: TuiContext): void {
  bindComponentHandlers(context);
  setupKeyHandlers(context);
}

function bindComponentHandlers(context: TuiContext): void {
  const { state, components } = context;
  const { commandSelect, filterInput, resultsSelect, argInput, argEnumSelect } = components;

  filterInput.on(InputRenderableEvents.CHANGE, (value: string) => {
    state.filterText = value;
    filterResults(context);
    updateStatusBar(context);
  });

  commandSelect.on(SelectRenderableEvents.ITEM_SELECTED, (_index: number, option) => {
    const cmd = findCommandByName(option.value as string);
    if (!cmd) {
      return;
    }

    state.selectedCommand = cmd;
    state.collectedArgs = {};
    state.currentArgIndex = 0;

    const requiredArgs = getRequiredArgs(cmd);
    if (requiredArgs.length > 0) {
      state.currentView = "args";
      updateView(context);
    } else {
      executeCommand(context, cmd);
    }
  });

  resultsSelect.on(SelectRenderableEvents.ITEM_SELECTED, (index: number) => {
    if (!state.filteredResults || !state.filteredResults[index]) {
      return;
    }

    const item = state.filteredResults[index] as Record<string, unknown>;
    state.selectedResultIndex = index;

    if (isConnectionsView(state)) {
      setActiveConnection(context, item);
      updateView(context);
      updateStatusBar(context);
      return;
    }

    state.selectedItem = item;
    state.currentView = "detail";
    updateView(context);
  });

  argInput.on(InputRenderableEvents.CHANGE, (value: string) => {
    if (!value.trim()) {
      return;
    }
    handleArgValue(context, value.trim());
  });

  argEnumSelect.on(SelectRenderableEvents.ITEM_SELECTED, (_index: number, option) => {
    handleArgValue(context, option.value);
  });
}

function handleArgValue(context: TuiContext, value: unknown): void {
  const { state, components } = context;
  const result = recordArgValue(state, value);

  if (result.done && state.selectedCommand) {
    executeCommand(context, state.selectedCommand);
    return;
  }

  showCurrentArgInput(state, components);
  updateStatusBar(context);
}

function setupKeyHandlers(context: TuiContext): void {
  const { renderer, state, components } = context;
  const { filterInput, resultsSelect, argInput, statusBar } = components;

  renderer.keyInput.on("keypress", (key: KeyEvent) => {
    if (key.name === "q" && !filterInput.focused) {
      renderer.stop();
      process.exit(0);
    }

    if (key.name === "tab") {
      if (state.currentView === "results") {
        state.currentView = "commands";
        state.results = null;
        state.filteredResults = null;
        state.filterText = "";
        state.selectedCommand = null;
        state.selectedResultIndex = 0;
        filterInput.value = "";
        resultsSelect.options = [];
      } else if (state.results && state.results.length > 0) {
        state.currentView = "results";
      }
      updateView(context);
      return;
    }

    if (key.name === "return" && filterInput.focused) {
      filterInput.blur();
      setTimeout(() => resultsSelect.focus(), 10);
      return;
    }

    if (key.name === "c" && state.currentView === "detail" && state.selectedItem) {
      const jsonText = JSON.stringify(state.selectedItem, null, 2);
      copyToClipboard(jsonText).then((success) => {
        statusBar.content = success ? "Copied to clipboard!" : "Failed to copy to clipboard";
      });
      return;
    }

    if (key.name === "escape") {
      if (filterInput.focused) {
        filterInput.blur();
        setTimeout(() => resultsSelect.focus(), 10);
      } else if (argInput.focused || state.currentView === "args") {
        state.currentView = "commands";
        state.collectedArgs = {};
        state.currentArgIndex = 0;
        updateView(context);
      } else if (state.currentView === "detail") {
        state.currentView = "results";
        state.selectedItem = null;
        updateView(context);
      } else if (state.currentView === "results") {
        state.currentView = "commands";
        state.results = null;
        state.filteredResults = null;
        state.filterText = "";
        state.selectedCommand = null;
        state.selectedResultIndex = 0;
        filterInput.value = "";
        resultsSelect.options = [];
        updateView(context);
      }
      return;
    }

    if (key.sequence === "/" && state.currentView === "results" && !filterInput.focused) {
      filterInput.focus();
      setTimeout(() => {
        if (filterInput.value === "/") {
          filterInput.value = "";
          state.filterText = "";
        }
      }, 10);
      return;
    }

    if (filterInput.focused && state.currentView === "results" && state.results) {
      setTimeout(() => {
        if (!filterInput.focused || state.currentView !== "results" || !state.results) {
          return;
        }

        let currentValue = filterInput.value;
        if (currentValue.startsWith("/")) {
          currentValue = currentValue.slice(1);
          filterInput.value = currentValue;
        }
        if (currentValue !== state.filterText) {
          state.filterText = currentValue;
          filterResults(context);
          updateStatusBar(context);
        }
      }, 0);
    }
  });
}
