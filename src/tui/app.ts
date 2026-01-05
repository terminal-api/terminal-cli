/**
 * Terminal CLI TUI Application
 * Interactive terminal interface for the Terminal Telematics API
 */

import { createCliRenderer } from "@opentui/core";
import { TerminalClient } from "../lib/client.ts";
import { loadConfig } from "../lib/config.ts";
import { createInitialState } from "./state.ts";
import { theme } from "./theme.ts";
import { getCommandOptions } from "./commands.ts";
import { createLayout } from "./components/layout.ts";
import { createSidebar } from "./components/sidebar.ts";
import { createTitle } from "./components/title.ts";
import { createSearchInput, createResultsList } from "./components/results.ts";
import { createCommandList, createCommandFilterInput } from "./components/command-list.ts";
import { createDetailPanel } from "./components/detail.ts";
import { createArgsInput } from "./components/args.ts";
import { createStatusBar } from "./components/status.ts";
import type { TuiContext, UiComponents } from "./types.ts";
import { setupHandlers } from "./handlers.ts";
import { updateConnectionDisplay, fetchConnectionInfo } from "./connection.ts";
import { updateStatusBar, updateView } from "./view.ts";

// Initialize the TUI
export async function startTui(profileName?: string): Promise<void> {
  const config = loadConfig(profileName);
  const state = createInitialState();
  const client = new TerminalClient(config);

  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });
  renderer.setBackgroundColor(theme.colors.background);

  const { rootLayout, contentArea, sidebar } = createLayout(renderer, theme);

  const connectionDisplay = createSidebar(renderer, sidebar, theme);
  const titleDisplay = createTitle(renderer, contentArea, theme);
  const commandFilterInput = createCommandFilterInput(renderer, contentArea, theme);
  const filterInput = createSearchInput(renderer, contentArea, theme);
  const commandSelect = createCommandList(renderer, contentArea, theme, getCommandOptions());
  const resultsSelect = createResultsList(renderer, contentArea, theme);
  const { detailContainer, detailPanel } = createDetailPanel(renderer, contentArea, theme);
  const { argsContainer, argLabel, argInput, argEnumSelect } = createArgsInput(
    renderer,
    contentArea,
    theme,
  );
  const statusBar = createStatusBar(renderer, rootLayout, theme);

  const components: UiComponents = {
    commandSelect,
    commandFilterInput,
    filterInput,
    resultsSelect,
    statusBar,
    connectionDisplay,
    titleDisplay,
    detailPanel,
    detailContainer,
    argsContainer,
    argLabel,
    argInput,
    argEnumSelect,
  };

  const context: TuiContext = {
    renderer,
    client,
    state,
    components,
    currentProfileName: profileName,
  };

  setupHandlers(context);

  updateConnectionDisplay(context);
  updateStatusBar(context);
  updateView(context);

  if (config.connectionToken) {
    fetchConnectionInfo(context);
  }

  commandSelect.focus();
  renderer.start();
}
