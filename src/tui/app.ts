/**
 * Terminal CLI TUI Application
 * Interactive terminal interface for the Terminal Telematics API
 */

import {
  createCliRenderer,
  BoxRenderable,
  TextRenderable,
  SelectRenderable,
  SelectRenderableEvents,
  InputRenderable,
  InputRenderableEvents,
  type CliRenderer,
  type SelectOption,
  type KeyEvent,
  StyledText,
  white,
  dim,
} from "@opentui/core";
import { TerminalClient } from "../lib/client.ts";
import { loadConfig, saveConfig } from "../lib/config.ts";
import { commandGroups, type Command, type CommandArg } from "../../generated/index.ts";

// Special command name for connections (used for special handling)
const CONNECTIONS_COMMAND = "list-connections";

// App state
interface AppState {
  currentView: "commands" | "args" | "results" | "detail";
  selectedCommand: Command | null;
  results: unknown[] | null;
  filteredResults: unknown[] | null;
  filterText: string;
  connectionInfo: Record<string, unknown> | null;
  loading: boolean;
  error: string | null;
  selectedItem: unknown | null;
  // For args input
  currentArgIndex: number;
  collectedArgs: Record<string, unknown>;
}

let renderer: CliRenderer;
let client: TerminalClient;
let state: AppState;

// UI Components
let commandSelect: SelectRenderable;
let filterInput: InputRenderable;
let resultsSelect: SelectRenderable;
let statusBar: TextRenderable;
let connectionDisplay: TextRenderable;
let titleDisplay: TextRenderable;
let detailPanel: TextRenderable;
let detailContainer: BoxRenderable;
let currentProfileName: string | undefined;
let argsContainer: BoxRenderable;
let argLabel: TextRenderable;
let argInput: InputRenderable;
let argEnumSelect: SelectRenderable;

// Convert commands to select options
function getCommandOptions(): SelectOption[] {
  const options: SelectOption[] = [];
  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      options.push({
        name: cmd.name,
        description: `[${group.name}] ${cmd.description}`,
        value: cmd.name,
      });
    }
  }
  return options;
}

// Find command by name
function findCommandByName(name: string): Command | null {
  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      if (cmd.name === name) {
        return cmd;
      }
    }
  }
  return null;
}

// Helper to extract a display value from a field (handles nested objects)
function getDisplayValue(value: unknown, nameField = "name"): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // Try common name fields
    if (obj[nameField]) return String(obj[nameField]);
    if (obj["name"]) return String(obj["name"]);
    if (obj["id"]) return String(obj["id"]);
  }
  return null;
}

// Convert results to select options for display
function resultsToOptions(results: unknown[]): SelectOption[] {
  // Check if this is a connections list
  const isConnections = isConnectionsView();

  return results.map((item, index) => {
    const record = item as Record<string, unknown>;

    if (isConnections) {
      // Special formatting for connections
      const id = (record["id"] as string) || `Item ${index + 1}`;
      const provider = getDisplayValue(record["provider"]) || "N/A";
      const status = record["status"] || "N/A";
      const syncMode = record["syncMode"] || "N/A";
      const createdAt = formatDate(record["createdAt"]);

      // Get company name
      const company = record["company"] as Record<string, unknown> | undefined;
      const companyName = company?.["name"] || "N/A";

      // Get external ID
      const externalId = record["externalId"] || "N/A";

      return {
        name: String(companyName),
        description: `${id} | ${provider} | ${status} | sync: ${syncMode} | extId: ${externalId} | created: ${createdAt}`,
        value: index,
      };
    }

    // Default formatting for other results
    // Try to get a meaningful display name
    const name =
      (record["name"] as string) ||
      (record["id"] as string) ||
      (record["firstName"] && record["lastName"]
        ? `${record["firstName"]} ${record["lastName"]}`
        : null) ||
      `Item ${index + 1}`;

    // Build description from other fields
    const descParts: string[] = [];
    if (record["id"] && record["id"] !== name) descParts.push(`id: ${record["id"]}`);
    if (record["status"]) descParts.push(`status: ${record["status"]}`);
    if (record["provider"]) {
      const providerName = getDisplayValue(record["provider"]);
      if (providerName) descParts.push(`provider: ${providerName}`);
    }
    if (record["vin"]) descParts.push(`vin: ${record["vin"]}`);
    if (record["email"]) descParts.push(`email: ${record["email"]}`);

    return {
      name: String(name),
      description: descParts.join(" | ") || JSON.stringify(item).slice(0, 80),
      value: index,
    };
  });
}

// Search/filter results based on search text
function filterResults(): void {
  if (!state.results) {
    state.filteredResults = null;
    return;
  }

  // Strip leading "/" which may be typed when activating search
  let searchText = state.filterText;
  if (searchText.startsWith("/")) {
    searchText = searchText.slice(1);
  }

  if (!searchText) {
    state.filteredResults = state.results;
  } else {
    const searchTerm = searchText.toLowerCase();
    state.filteredResults = state.results.filter((item) => {
      // Search in the JSON representation (includes all nested fields)
      const str = JSON.stringify(item).toLowerCase();
      return str.includes(searchTerm);
    });
  }

  // Update results display
  if (state.filteredResults && resultsSelect) {
    resultsSelect.options = resultsToOptions(state.filteredResults);
  }

  // Update title to show filtered count (without calling full updateView which steals focus)
  if (state.currentView === "results" && state.selectedCommand) {
    const cmdName = state.selectedCommand.name;
    const connectionsHint = isConnectionsView() ? " | Enter: set as active connection" : "";
    titleDisplay.content = `${cmdName} (${state.filteredResults?.length ?? 0} items)${connectionsHint}`;
  }
}

// Execute selected command
async function executeCommand(cmd: Command): Promise<void> {
  state.loading = true;
  state.error = null;
  state.currentView = "results"; // Switch to results view during loading

  // Clear previous results immediately to avoid showing stale data
  state.results = null;
  state.filteredResults = null;
  state.filterText = "";
  filterInput.value = "";
  resultsSelect.options = []; // Clear the display
  resultsSelect.setSelectedIndex(0); // Reset selection index

  updateStatusBar();
  updateView();

  try {
    // Use collected args
    const args: Record<string, unknown> = { ...state.collectedArgs };

    const result = await cmd.handler(client, args);

    // Check if result has results array (paginated response)
    if (result && typeof result === "object" && "results" in result) {
      const resultObj = result as Record<string, unknown>;
      state.results = resultObj["results"] as unknown[];
    } else if (Array.isArray(result)) {
      state.results = result;
    } else if (result && typeof result === "object") {
      // Single object result
      state.results = [result];
    } else {
      state.results = [];
    }

    // Ensure results is always an array
    if (!Array.isArray(state.results)) {
      state.results = [];
    }

    state.filteredResults = state.results;
    state.filterText = "";
    filterInput.value = "";

    // Update results view
    resultsSelect.options = resultsToOptions(state.filteredResults);
  } catch (error) {
    state.error = error instanceof Error ? error.message : String(error);
    state.results = null;
    state.filteredResults = null;
  } finally {
    state.loading = false;
    state.currentView = "results";
    updateView();
    updateStatusBar();
  }
}

// Fetch current connection info
async function fetchConnectionInfo(): Promise<void> {
  try {
    const result = await client.get<Record<string, unknown>>("/connections/current");
    state.connectionInfo = result;
    updateConnectionDisplay();
  } catch (err) {
    // Log error for debugging but don't crash
    console.error("Failed to fetch connection info:", err);
    state.connectionInfo = null;
    updateConnectionDisplay();
  }
}

// Build hotkeys content with styled text (white keys, dim actions)
function buildHotkeysContent(hotkeys: Array<{ key: string; action: string }>) {
  // Build chunks: white(key) + dim(action), separated by spaces
  const chunks = hotkeys.flatMap(({ key, action }, index) => {
    const parts = [white(key), dim(` ${action}`)];
    // Add separator between hotkey groups (not after the last one)
    if (index < hotkeys.length - 1) {
      parts.push(dim("    "));
    }
    return parts;
  });

  // Add leading space chunk and create StyledText
  return new StyledText([dim("  "), ...chunks]);
}

// Update status bar
function updateStatusBar(): void {
  if (state.loading) {
    statusBar.content = "Loading...";
    return;
  } else if (state.error) {
    statusBar.content = `Error: ${state.error}`;
    return;
  }

  let hotkeys: Array<{ key: string; action: string }> = [];

  if (state.currentView === "args") {
    hotkeys = [
      { key: "enter", action: "submit" },
      { key: "esc", action: "cancel" },
      { key: "q", action: "quit" },
    ];
  } else if (state.currentView === "detail") {
    hotkeys = [
      { key: "c", action: "copy" },
      { key: "esc", action: "back" },
      { key: "q", action: "quit" },
    ];
  } else if (state.currentView === "results") {
    const actionLabel = isConnectionsView() ? "select" : "details";
    hotkeys = [
      { key: "/", action: "search" },
      { key: "enter", action: actionLabel },
      { key: "tab", action: "commands" },
      { key: "esc", action: "back" },
      { key: "q", action: "quit" },
    ];
  } else {
    hotkeys = [
      { key: "enter", action: "select" },
      { key: "tab", action: "results" },
      { key: "q", action: "quit" },
    ];
  }

  statusBar.content = buildHotkeysContent(hotkeys);
}

// Helper to format date strings
function formatDate(dateStr: unknown): string {
  if (!dateStr || typeof dateStr !== "string") return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch {
    return String(dateStr).slice(0, 10);
  }
}

// Build styled sidebar section: white label, gray value on next line, with spacing
function sidebarSection(label: string, value: string) {
  return [white(label), dim(`\n${value}\n\n`)];
}

// Update connection display in sidebar
function updateConnectionDisplay(): void {
  const config = loadConfig();

  if (state.connectionInfo) {
    const info = state.connectionInfo;

    // Extract provider name (provider is an object with .name)
    const provider = info["provider"] as Record<string, unknown> | undefined;
    const providerName = String(provider?.["name"] || "N/A");

    // Extract company info
    const company = info["company"] as Record<string, unknown> | undefined;
    const companyName = String(company?.["name"] || "N/A");
    const dotNumber = String(company?.["dotNumber"] || info["dotNumber"] || "N/A");

    const status = String(info["status"] || "N/A");
    const syncMode = String(info["syncMode"] || "N/A");
    const created = formatDate(info["createdAt"]);
    const updated = formatDate(info["updatedAt"]);

    // Build styled connection display (OpenCode style: white labels, gray values)
    const chunks = [
      ...sidebarSection("Provider", providerName),
      ...sidebarSection("Status", status),
      ...sidebarSection("Sync Mode", syncMode),
      ...sidebarSection("Company", companyName),
      ...sidebarSection("DOT", dotNumber),
      ...sidebarSection("Created", created),
      ...sidebarSection("Updated", updated),
    ];

    connectionDisplay.content = new StyledText(chunks);
  } else if (config.connectionToken) {
    const chunks = [
      ...sidebarSection("Token", `${config.connectionToken.slice(0, 15)}...`),
      dim("\nLoading info..."),
    ];
    connectionDisplay.content = new StyledText(chunks);
  } else {
    const chunks = [
      white("No Connection\n"),
      dim("\nSet a connection token:\n"),
      dim("terminal config set\n"),
      dim("connection-token <token>"),
    ];
    connectionDisplay.content = new StyledText(chunks);
  }
}

// Check if viewing connections (special handling)
function isConnectionsView(): boolean {
  return state.selectedCommand?.name === CONNECTIONS_COMMAND;
}

// Get required args for a command
function getRequiredArgs(cmd: Command): typeof cmd.args {
  return cmd.args.filter((arg) => arg.required);
}

// Get current arg being filled
function getCurrentArg(): CommandArg | null {
  if (!state.selectedCommand) return null;
  const requiredArgs = getRequiredArgs(state.selectedCommand);
  return requiredArgs[state.currentArgIndex] ?? null;
}

// Move to next arg or execute command
function submitCurrentArg(value: unknown): void {
  const currentArg = getCurrentArg();
  if (!currentArg || !state.selectedCommand) return;

  // Store the value
  state.collectedArgs[currentArg.name] = value;

  // Check if there are more args
  const requiredArgs = getRequiredArgs(state.selectedCommand);
  if (state.currentArgIndex < requiredArgs.length - 1) {
    state.currentArgIndex++;
    showCurrentArgInput();
  } else {
    // All args collected, execute command
    executeCommand(state.selectedCommand);
  }
}

// Show input for current arg
function showCurrentArgInput(): void {
  const currentArg = getCurrentArg();
  if (!currentArg) return;

  // Update label
  const requiredMark = currentArg.required ? " (required)" : "";
  const enumInfo = currentArg.enum ? ` [${currentArg.enum.join(", ")}]` : "";
  argLabel.content = `${currentArg.name}${requiredMark}${enumInfo}\n${currentArg.description || "No description"}`;

  // If enum, show select; otherwise show input
  if (currentArg.enum && currentArg.enum.length > 0) {
    argInput.visible = false;
    argEnumSelect.visible = true;
    argEnumSelect.options = currentArg.enum.map((v: string) => ({
      name: v,
      description: "",
      value: v,
    }));
    argEnumSelect.focus();
  } else {
    argEnumSelect.visible = false;
    argInput.visible = true;
    argInput.value = "";
    argInput.focus();
  }

  updateStatusBar();
}

// Format JSON for detail view
function formatDetail(item: unknown): string {
  return JSON.stringify(item, null, 2);
}

// Set a connection as active
function setActiveConnection(connection: Record<string, unknown>): void {
  const token = connection["token"] as string | undefined;
  if (!token) {
    state.error = "Connection has no token";
    updateStatusBar();
    return;
  }

  // Save to config (saveConfig takes Partial<ProfileConfig> and optional profile name)
  saveConfig({ connectionToken: token }, currentProfileName);

  // Update client with new config from profile
  const newConfig = loadConfig(currentProfileName);
  client = new TerminalClient(newConfig);

  // Update UI
  state.connectionInfo = connection;
  updateConnectionDisplay();
  state.error = null;

  // Extract provider name (provider is an object with .name)
  const providerObj = connection["provider"] as Record<string, unknown> | undefined;
  const providerName = providerObj?.["name"] || "Unknown";

  // Show confirmation in status
  statusBar.content = `Active connection set to ${providerName} (${token.slice(0, 15)}...)`;

  // Go back to commands list
  state.currentView = "commands";
  state.results = null;
  state.filteredResults = null;
  state.filterText = "";
  updateView();
}

// Update view based on current state
function updateView(): void {
  // Hide all main views first
  commandSelect.visible = false;
  resultsSelect.visible = false;
  filterInput.visible = false;
  detailContainer.visible = false;
  argsContainer.visible = false;

  if (state.currentView === "commands") {
    titleDisplay.content = "Select Command";
    commandSelect.visible = true;
    commandSelect.focus();
  } else if (state.currentView === "args") {
    const cmdName = state.selectedCommand?.name ?? "Command";
    const requiredArgs = state.selectedCommand ? getRequiredArgs(state.selectedCommand) : [];
    titleDisplay.content = `${cmdName} - Argument ${state.currentArgIndex + 1}/${requiredArgs.length}`;
    argsContainer.visible = true;
    showCurrentArgInput();
  } else if (state.currentView === "results") {
    const cmdName = state.selectedCommand?.name ?? "Results";
    const connectionsHint = isConnectionsView() ? " | Enter: set as active connection" : "";

    // Show loading state or results count
    if (state.loading) {
      titleDisplay.content = `${cmdName} - Loading...`;
      resultsSelect.visible = false; // Hide results while loading
      filterInput.visible = false;
    } else {
      const resultCount = state.filteredResults?.length ?? 0;
      titleDisplay.content = `${cmdName} (${resultCount} items)${connectionsHint}`;
      // Always sync the options with current state to prevent stale display
      const currentOptions = resultsToOptions(state.filteredResults ?? []);
      resultsSelect.options = currentOptions;
      resultsSelect.setSelectedIndex(0);

      // Hide results select when empty to prevent showing stale UI
      if (resultCount === 0) {
        resultsSelect.visible = false;
        filterInput.visible = false;
      } else {
        resultsSelect.visible = true;
        filterInput.visible = true;
        // Don't steal focus from filter input if user is typing
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

  updateStatusBar();
}

// Copy to clipboard helper
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Use pbcopy on macOS, xclip on Linux, clip on Windows
    const proc = Bun.spawn(["pbcopy"], {
      stdin: "pipe",
    });
    proc.stdin.write(text);
    proc.stdin.end();
    await proc.exited;
    return true;
  } catch {
    return false;
  }
}

// Setup keyboard handlers
function setupKeyHandlers(): void {
  renderer.keyInput.on("keypress", (key: KeyEvent) => {
    // Global keys
    if (key.name === "q" && !filterInput.focused) {
      renderer.stop();
      process.exit(0);
    }

    if (key.name === "tab") {
      if (state.currentView === "results") {
        // Clear results state when going back to commands via tab
        state.currentView = "commands";
        state.results = null;
        state.filteredResults = null;
        state.filterText = "";
        state.selectedCommand = null;
        filterInput.value = "";
        resultsSelect.options = []; // Clear the display
      } else if (state.results && state.results.length > 0) {
        state.currentView = "results";
      }
      updateView();
      return;
    }

    // Enter exits search input (back to results list)
    if (key.name === "return" && filterInput.focused) {
      filterInput.blur();
      // Small delay to ensure blur completes before focusing results
      setTimeout(() => resultsSelect.focus(), 10);
      return;
    }

    // Copy to clipboard in detail view
    if (key.name === "c" && state.currentView === "detail" && state.selectedItem) {
      const jsonText = JSON.stringify(state.selectedItem, null, 2);
      copyToClipboard(jsonText).then((success) => {
        if (success) {
          statusBar.content = "Copied to clipboard!";
        } else {
          statusBar.content = "Failed to copy to clipboard";
        }
      });
      return;
    }

    if (key.name === "escape") {
      if (filterInput.focused) {
        filterInput.blur();
        // Small delay to ensure blur completes before focusing results
        setTimeout(() => resultsSelect.focus(), 10);
      } else if (argInput.focused) {
        // Cancel args input
        state.currentView = "commands";
        state.collectedArgs = {};
        state.currentArgIndex = 0;
        updateView();
      } else if (state.currentView === "args") {
        // Cancel args input
        state.currentView = "commands";
        state.collectedArgs = {};
        state.currentArgIndex = 0;
        updateView();
      } else if (state.currentView === "detail") {
        state.currentView = "results";
        state.selectedItem = null;
        updateView();
      } else if (state.currentView === "results") {
        // Clear results state when going back to commands
        state.currentView = "commands";
        state.results = null;
        state.filteredResults = null;
        state.filterText = "";
        state.selectedCommand = null;
        filterInput.value = "";
        resultsSelect.options = []; // Clear the display
        updateView();
      }
      return;
    }

    // Search shortcut - use "/" to focus search input
    if (key.sequence === "/" && state.currentView === "results" && !filterInput.focused) {
      filterInput.focus();
      // Clear the "/" that will be typed into the input
      setTimeout(() => {
        if (filterInput.value === "/") {
          filterInput.value = "";
          state.filterText = "";
        }
      }, 10);
      return;
    }

    // Real-time search: update filter as user types
    if (filterInput.focused && state.currentView === "results" && state.results) {
      // Use setTimeout to let the input value update first
      setTimeout(() => {
        // Only proceed if still in results view with results
        if (!filterInput.focused || state.currentView !== "results" || !state.results) {
          return;
        }
        // Strip leading "/" if present
        let currentValue = filterInput.value;
        if (currentValue.startsWith("/")) {
          currentValue = currentValue.slice(1);
          filterInput.value = currentValue;
        }
        if (currentValue !== state.filterText) {
          state.filterText = currentValue;
          filterResults();
          updateStatusBar();
        }
      }, 0);
    }
  });
}

// Initialize the TUI
export async function startTui(profileName?: string): Promise<void> {
  // Initialize state
  const config = loadConfig(profileName);
  state = {
    currentView: "commands",
    selectedCommand: null,
    results: null,
    filteredResults: null,
    filterText: "",
    connectionInfo: null,
    loading: false,
    error: null,
    selectedItem: null,
    currentArgIndex: 0,
    collectedArgs: {},
  };

  // Store profile name for later use
  currentProfileName = profileName;

  // Create client
  client = new TerminalClient(config);

  // Create renderer
  renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });

  renderer.setBackgroundColor("#0d1117");

  // Root layout: vertical flex with main area and hotkeys bar at bottom
  const rootLayout = new BoxRenderable(renderer, {
    id: "root-layout",
    width: "100%",
    height: "100%",
    flexDirection: "column",
  });
  renderer.root.add(rootLayout);

  // Main container (content + sidebar)
  const mainContainer = new BoxRenderable(renderer, {
    id: "main-container",
    width: "100%",
    flexGrow: 1,
    flexDirection: "row",
  });
  rootLayout.add(mainContainer);

  // Content area (left)
  const contentArea = new BoxRenderable(renderer, {
    id: "content-area",
    flexGrow: 1,
    height: "100%",
    flexDirection: "column",
    padding: 1,
  });
  mainContainer.add(contentArea);

  // Sidebar (right) - styled like OpenCode
  const sidebar = new BoxRenderable(renderer, {
    id: "sidebar",
    width: 32,
    height: "100%",
    backgroundColor: "#161b22",
    padding: 1,
    flexDirection: "column",
  });
  mainContainer.add(sidebar);

  // Connection display in sidebar
  connectionDisplay = new TextRenderable(renderer, {
    id: "connection-display",
    content: "",
    width: "100%",
    flexGrow: 1,
    fg: "#c9d1d9",
  });
  sidebar.add(connectionDisplay);

  // Title
  titleDisplay = new TextRenderable(renderer, {
    id: "title",
    content: "Select Command",
    width: "100%",
    height: 1,
    marginBottom: 1,
    fg: "#58a6ff",
  });
  contentArea.add(titleDisplay);

  // Search input (hidden initially)
  filterInput = new InputRenderable(renderer, {
    id: "search-input",
    width: "100%",
    height: 1,
    placeholder: "Type to search...",
    backgroundColor: "#21262d",
    focusedBackgroundColor: "#30363d",
    marginBottom: 1,
    visible: false,
  });
  contentArea.add(filterInput);

  // Note: CHANGE event fires on Enter in OpenTUI
  filterInput.on(InputRenderableEvents.CHANGE, (value: string) => {
    state.filterText = value;
    filterResults();
    updateStatusBar();
  });

  // Command selector
  commandSelect = new SelectRenderable(renderer, {
    id: "command-select",
    width: "100%",
    height: "80%",
    options: getCommandOptions(),
    backgroundColor: "#0d1117",
    focusedBackgroundColor: "#161b22",
    textColor: "#c9d1d9",
    focusedTextColor: "#ffffff",
    selectedBackgroundColor: "#1f6feb",
    selectedTextColor: "#ffffff",
    descriptionColor: "#8b949e",
    selectedDescriptionColor: "#c9d1d9",
    showDescription: true,
    showScrollIndicator: true,
    wrapSelection: true,
  });
  contentArea.add(commandSelect);

  commandSelect.on(SelectRenderableEvents.ITEM_SELECTED, (_index: number, option: SelectOption) => {
    const cmd = findCommandByName(option.value as string);
    if (cmd) {
      state.selectedCommand = cmd;
      state.collectedArgs = {};
      state.currentArgIndex = 0;

      // Check if command has required args
      const requiredArgs = getRequiredArgs(cmd);
      if (requiredArgs.length > 0) {
        // Show args input view
        state.currentView = "args";
        updateView();
      } else {
        // Execute directly
        executeCommand(cmd);
      }
    }
  });

  // Results selector (hidden initially)
  resultsSelect = new SelectRenderable(renderer, {
    id: "results-select",
    width: "100%",
    height: "80%",
    options: [],
    backgroundColor: "#0d1117",
    focusedBackgroundColor: "#161b22",
    textColor: "#c9d1d9",
    focusedTextColor: "#ffffff",
    selectedBackgroundColor: "#238636",
    selectedTextColor: "#ffffff",
    descriptionColor: "#8b949e",
    selectedDescriptionColor: "#c9d1d9",
    showDescription: true,
    showScrollIndicator: true,
    wrapSelection: true,
    visible: false,
  });
  contentArea.add(resultsSelect);

  resultsSelect.on(SelectRenderableEvents.ITEM_SELECTED, (index: number) => {
    if (state.filteredResults && state.filteredResults[index]) {
      const item = state.filteredResults[index] as Record<string, unknown>;

      // Special handling for connections - set as active connection
      if (isConnectionsView()) {
        setActiveConnection(item);
        return;
      }

      // For other commands, show detail view
      state.selectedItem = item;
      state.currentView = "detail";
      updateView();
    }
  });

  // Detail panel container (hidden initially)
  detailContainer = new BoxRenderable(renderer, {
    id: "detail-container",
    width: "100%",
    height: "80%",
    borderStyle: "single",
    borderColor: "#30363d",
    padding: 1,
    visible: false,
    overflow: "scroll",
  });
  contentArea.add(detailContainer);

  // Detail text display
  detailPanel = new TextRenderable(renderer, {
    id: "detail-panel",
    content: "",
    width: "100%",
    height: "100%",
    fg: "#c9d1d9",
  });
  detailContainer.add(detailPanel);

  // Args input container (hidden initially)
  argsContainer = new BoxRenderable(renderer, {
    id: "args-container",
    width: "100%",
    height: "80%",
    flexDirection: "column",
    padding: 1,
    visible: false,
  });
  contentArea.add(argsContainer);

  // Arg label showing current arg name and description
  argLabel = new TextRenderable(renderer, {
    id: "arg-label",
    content: "",
    width: "100%",
    height: 3,
    marginBottom: 1,
    fg: "#8b949e",
  });
  argsContainer.add(argLabel);

  // Arg text input
  argInput = new InputRenderable(renderer, {
    id: "arg-input",
    width: "100%",
    height: 1,
    placeholder: "Enter value...",
    backgroundColor: "#21262d",
    focusedBackgroundColor: "#30363d",
    visible: false,
  });
  argsContainer.add(argInput);

  // Handle arg input submission (CHANGE fires on enter)
  argInput.on(InputRenderableEvents.CHANGE, (value: string) => {
    if (value.trim()) {
      submitCurrentArg(value.trim());
    }
  });

  // Arg enum select (for args with enum values)
  argEnumSelect = new SelectRenderable(renderer, {
    id: "arg-enum-select",
    width: "100%",
    height: 10,
    options: [],
    backgroundColor: "#0d1117",
    focusedBackgroundColor: "#161b22",
    textColor: "#c9d1d9",
    focusedTextColor: "#ffffff",
    selectedBackgroundColor: "#1f6feb",
    selectedTextColor: "#ffffff",
    descriptionColor: "#8b949e",
    showDescription: true,
    visible: false,
  });
  argsContainer.add(argEnumSelect);

  // Handle enum selection
  argEnumSelect.on(SelectRenderableEvents.ITEM_SELECTED, (_index: number, option: SelectOption) => {
    submitCurrentArg(option.value);
  });

  // Status bar at bottom of rootLayout
  statusBar = new TextRenderable(renderer, {
    id: "status-bar",
    content: "",
    width: "100%",
    height: 1,
    fg: "#8b949e",
  });
  rootLayout.add(statusBar);

  // Setup keyboard handlers
  setupKeyHandlers();

  // Initial updates
  updateConnectionDisplay();
  updateStatusBar();
  updateView();

  // Fetch connection info in background
  if (config.connectionToken) {
    fetchConnectionInfo();
  }

  // Start the renderer
  commandSelect.focus();
  renderer.start();
}
