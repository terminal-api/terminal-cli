import type { AppState } from "./state.ts";

export const CONNECTIONS_COMMAND = "list-connections";

export function isConnectionsView(state: AppState): boolean {
  return state.selectedCommand?.name === CONNECTIONS_COMMAND;
}
