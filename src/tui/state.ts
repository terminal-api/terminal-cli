import type { Command } from "../../generated/index.ts";

export type ArgsPhase = "required" | "optional-list" | "optional-edit";

export interface ErrorInfo {
  message: string;
  status?: number;
  code?: string;
  detail?: unknown;
}

export interface AppState {
  currentView: "commands" | "args" | "results" | "detail";
  selectedCommand: Command | null;
  results: unknown[] | null;
  filteredResults: unknown[] | null;
  filterText: string;
  commandFilterText: string;
  connectionInfo: Record<string, unknown> | null;
  loading: boolean;
  error: ErrorInfo | null;
  selectedItem: Record<string, unknown> | null;
  selectedResultIndex: number;
  // For args input
  argsPhase: ArgsPhase;
  currentArgIndex: number;
  optionalArgIndex: number;
  editingOptionalArgName: string | null;
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
    argsPhase: "required",
    currentArgIndex: 0,
    optionalArgIndex: 0,
    editingOptionalArgName: null,
    collectedArgs: {},
  };
}
