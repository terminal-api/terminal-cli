import type {
  BoxRenderable,
  TextRenderable,
  SelectRenderable,
  InputRenderable,
  CliRenderer,
} from "@opentui/core";
import type { TerminalClient } from "../lib/client.ts";
import type { AppState } from "./state.ts";

export interface UiComponents {
  commandSelect: SelectRenderable;
  commandFilterInput: InputRenderable;
  filterInput: InputRenderable;
  resultsSelect: SelectRenderable;
  statusBar: TextRenderable;
  connectionDisplay: TextRenderable;
  titleDisplay: TextRenderable;
  detailPanel: TextRenderable;
  detailContainer: BoxRenderable;
  argsContainer: BoxRenderable;
  argLabel: TextRenderable;
  argInput: InputRenderable;
  argEnumSelect: SelectRenderable;
  optionalArgsSelect: SelectRenderable;
  // Error panel components
  errorContainer: BoxRenderable;
  errorTitle: TextRenderable;
  errorStatus: TextRenderable;
  errorMessage: TextRenderable;
  errorDetail: TextRenderable;
}

export interface TuiContext {
  renderer: CliRenderer;
  client: TerminalClient;
  state: AppState;
  components: UiComponents;
  currentProfileName?: string;
}
