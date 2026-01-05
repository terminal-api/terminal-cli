import type { Command } from "../../generated/index.ts";

export interface AppState {
  currentView: "commands" | "args" | "results" | "detail";
  selectedCommand: Command | null;
  results: unknown[] | null;
  filteredResults: unknown[] | null;
  filterText: string;
  commandFilterText: string;
  connectionInfo: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  selectedItem: Record<string, unknown> | null;
  selectedResultIndex: number;
  // For args input
  currentArgIndex: number;
  collectedArgs: Record<string, unknown>;
}

export function createInitialState(): AppState {
  return {
    currentView: "commands",
    selectedCommand: null,
    results: null,
    filteredResults: null,
    filterText: "",
    commandFilterText: "",
    connectionInfo: null,
    loading: false,
    error: null,
    selectedItem: null,
    selectedResultIndex: 0,
    currentArgIndex: 0,
    collectedArgs: {},
  };
}
