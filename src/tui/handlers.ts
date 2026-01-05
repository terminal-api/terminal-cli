import {
  InputRenderableEvents,
  SelectRenderableEvents,
  type KeyEvent,
  type PasteEvent,
} from "@opentui/core";
import type { TuiContext } from "./types.ts";
import { findCommandByName, filterCommandOptions } from "./commands.ts";
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

function filterCommands(context: TuiContext): void {
  const { state, components } = context;
  const { commandSelect } = components;

  const filtered = filterCommandOptions(state.commandFilterText);
  commandSelect.options = filtered;

  if (filtered.length > 0) {
    commandSelect.setSelectedIndex(0);
  }
}

function bindComponentHandlers(context: TuiContext): void {
  const { state, components } = context;
  const { commandSelect, commandFilterInput, filterInput, resultsSelect, argInput, argEnumSelect } =
    components;

  commandFilterInput.on(InputRenderableEvents.CHANGE, (value: string) => {
    state.commandFilterText = value;
    filterCommands(context);
  });

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
  const { commandFilterInput, filterInput, commandSelect, resultsSelect, argInput, statusBar } =
    components;

  renderer.keyInput.on("paste", (event: PasteEvent) => {
    if (argInput.focused) {
      argInput.value = argInput.value + event.text;
    } else if (filterInput.focused) {
      filterInput.value = filterInput.value + event.text;
      state.filterText = filterInput.value;
      filterResults(context);
      updateStatusBar(context);
    } else if (commandFilterInput.focused) {
      commandFilterInput.value = commandFilterInput.value + event.text;
      state.commandFilterText = commandFilterInput.value;
      filterCommands(context);
    }
  });

  renderer.keyInput.on("keypress", (key: KeyEvent) => {
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

    if (key.name === "return" && commandFilterInput.focused) {
      commandFilterInput.blur();
      setTimeout(() => commandSelect.focus(), 10);
      return;
    }

    if (state.currentView === "detail" && state.selectedItem) {
      if (key.name === "c") {
        const jsonText = JSON.stringify(state.selectedItem, null, 2);
        copyToClipboard(jsonText).then((success) => {
          statusBar.content = success ? "Copied JSON to clipboard!" : "Failed to copy to clipboard";
        });
        return;
      }

      if (key.name === "i") {
        const id = state.selectedItem["id"];
        if (id) {
          copyToClipboard(String(id)).then((success) => {
            statusBar.content = success ? "Copied ID to clipboard!" : "Failed to copy to clipboard";
          });
        } else {
          statusBar.content = "No ID field found";
        }
        return;
      }
    }

    if (key.name === "i" && state.currentView === "detail" && state.selectedItem) {
      const id = state.selectedItem["id"];
      if (id) {
        copyToClipboard(String(id)).then((success) => {
          statusBar.content = success ? "Copied ID to clipboard!" : "Failed to copy to clipboard";
        });
      } else {
        statusBar.content = "No ID field found";
      }
      return;
    }

    if (key.name === "escape") {
      if (commandFilterInput.focused) {
        commandFilterInput.blur();
        commandFilterInput.value = "";
        state.commandFilterText = "";
        filterCommands(context);
        setTimeout(() => commandSelect.focus(), 10);
      } else if (filterInput.focused) {
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

    if (key.sequence === "/" && state.currentView === "commands" && !commandFilterInput.focused) {
      commandFilterInput.focus();
      setTimeout(() => {
        if (commandFilterInput.value === "/") {
          commandFilterInput.value = "";
          state.commandFilterText = "";
        }
      }, 10);
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

    if (commandFilterInput.focused && state.currentView === "commands") {
      setTimeout(() => {
        if (!commandFilterInput.focused || state.currentView !== "commands") {
          return;
        }

        let currentValue = commandFilterInput.value;
        if (currentValue.startsWith("/")) {
          currentValue = currentValue.slice(1);
          commandFilterInput.value = currentValue;
        }
        if (currentValue !== state.commandFilterText) {
          state.commandFilterText = currentValue;
          filterCommands(context);
        }
      }, 0);
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
