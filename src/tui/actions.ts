import type { Command } from "../../generated/index.ts";
import type { TuiContext } from "./types.ts";
import { updateStatusBar, updateView } from "./view.ts";

export async function executeCommand(context: TuiContext, cmd: Command): Promise<void> {
  const { state, components, client } = context;
  const { filterInput, resultsSelect } = components;

  state.loading = true;
  state.error = null;
  state.currentView = "results";

  state.results = null;
  state.filteredResults = null;
  state.filterText = "";
  state.selectedResultIndex = 0;
  filterInput.value = "";
  resultsSelect.options = [];
  resultsSelect.setSelectedIndex(0);

  updateStatusBar(context);
  updateView(context);

  try {
    const args: Record<string, unknown> = { ...state.collectedArgs };
    const result = await cmd.handler(client, args);

    if (result && typeof result === "object" && "results" in result) {
      const resultObj = result as Record<string, unknown>;
      state.results = resultObj["results"] as unknown[];
    } else if (Array.isArray(result)) {
      state.results = result;
    } else if (result && typeof result === "object") {
      state.results = [result];
    } else {
      state.results = [];
    }

    if (!Array.isArray(state.results)) {
      state.results = [];
    }

    state.filteredResults = state.results;
    state.filterText = "";
    state.selectedResultIndex = 0;
    filterInput.value = "";
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
    state.results = null;
    state.filteredResults = null;
  } finally {
    state.loading = false;
    state.currentView = "results";
    updateView(context);
    updateStatusBar(context);
  }
}
