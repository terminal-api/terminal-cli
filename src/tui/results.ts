import type { SelectOption } from "@opentui/core";
import type { TuiContext } from "./types.ts";
import { formatDate, getDisplayValue } from "./format.ts";
import { isConnectionsView } from "./constants.ts";

export function resultsToOptions(results: unknown[], showConnections: boolean): SelectOption[] {
  return results.map((item, index) => {
    const record = item as Record<string, unknown>;

    if (showConnections) {
      const id = (record["id"] as string) || `Item ${index + 1}`;
      const provider = getDisplayValue(record["provider"]) || "N/A";
      const status = record["status"] || "N/A";
      const syncMode = record["syncMode"] || "N/A";
      const createdAt = formatDate(record["createdAt"]);

      const company = record["company"] as Record<string, unknown> | undefined;
      const companyName = company?.["name"] || "N/A";

      const externalId = record["externalId"] || "N/A";

      return {
        name: String(companyName),
        description: `${id} | ${provider} | ${status} | sync: ${syncMode} | extId: ${externalId} | created: ${createdAt}`,
        value: index,
      };
    }

    const name =
      (record["name"] as string) ||
      (record["id"] as string) ||
      (record["firstName"] && record["lastName"]
        ? `${record["firstName"]} ${record["lastName"]}`
        : null) ||
      `Item ${index + 1}`;

    const descParts: string[] = [];
    if (record["status"]) descParts.push(`status: ${record["status"]}`);
    if (record["provider"]) {
      const providerName = getDisplayValue(record["provider"]);
      if (providerName) descParts.push(`provider: ${providerName}`);
    }
    // Priority fields to always show if present
    if (record["vin"]) descParts.push(`vin: ${record["vin"]}`);
    if (record["make"]) descParts.push(`make: ${record["make"]}`);
    if (record["model"]) descParts.push(`model: ${record["model"]}`);
    if (record["year"]) descParts.push(`year: ${record["year"]}`);
    if (record["firstName"]) descParts.push(`firstName: ${record["firstName"]}`);
    if (record["lastName"]) descParts.push(`lastName: ${record["lastName"]}`);
    if (record["email"]) descParts.push(`email: ${record["email"]}`);

    return {
      name: String(name),
      description: descParts.join(" | ") || JSON.stringify(item).slice(0, 80),
      value: index,
    };
  });
}

export function filterResults(context: TuiContext): void {
  const { state, components } = context;
  const { resultsSelect, titleDisplay } = components;

  if (!state.results) {
    state.filteredResults = null;
    return;
  }

  let searchText = state.filterText;
  if (searchText.startsWith("/")) {
    searchText = searchText.slice(1);
  }

  if (!searchText) {
    state.filteredResults = state.results;
  } else {
    const searchTerm = searchText.toLowerCase();
    state.filteredResults = state.results.filter((item) => {
      const str = JSON.stringify(item).toLowerCase();
      return str.includes(searchTerm);
    });
  }

  if (state.filteredResults && resultsSelect) {
    const options = resultsToOptions(state.filteredResults, isConnectionsView(state));
    resultsSelect.options = options;

    const maxIndex = state.filteredResults.length - 1;
    const nextIndex = maxIndex >= 0 ? Math.min(state.selectedResultIndex, maxIndex) : 0;
    state.selectedResultIndex = nextIndex;
    if (state.filteredResults.length > 0) {
      resultsSelect.setSelectedIndex(nextIndex);
    }
  }

  if (state.currentView === "results" && state.selectedCommand) {
    const cmdName = state.selectedCommand.name;
    const connectionsHint = isConnectionsView(state) ? " | Enter: set as active connection" : "";
    titleDisplay.content = `${cmdName} (${state.filteredResults?.length ?? 0} items)${connectionsHint}`;
  }
}
