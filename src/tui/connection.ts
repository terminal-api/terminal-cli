import { StyledText, dim, white } from "@opentui/core";
import { TerminalClient } from "../lib/client.ts";
import { loadConfig, saveConfig } from "../lib/config.ts";
import type { TuiContext } from "./types.ts";
import { formatDate, sidebarSection } from "./format.ts";

function safeString(val: unknown): string {
  if (val === null || val === undefined) return "N/A";
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
    return String(val);
  }
  return JSON.stringify(val);
}

export async function fetchConnectionInfo(context: TuiContext): Promise<void> {
  try {
    const result = await context.client.get<Record<string, unknown>>("/connections/current");
    context.state.connectionInfo = result;
    updateConnectionDisplay(context);
  } catch (error) {
    console.error("Failed to fetch connection info:", error);
    context.state.connectionInfo = null;
    updateConnectionDisplay(context);
  }
}

export function updateConnectionDisplay(context: TuiContext): void {
  const config = loadConfig(context.currentProfileName);
  const { connectionDisplay } = context.components;
  const { connectionInfo } = context.state;

  if (connectionInfo) {
    const provider = connectionInfo["provider"] as Record<string, unknown> | undefined;
    const providerName = safeString(provider?.["name"]);

    const company = connectionInfo["company"] as Record<string, unknown> | undefined;
    const companyName = safeString(company?.["name"]);
    const dotNumber = safeString(company?.["dotNumber"] ?? connectionInfo["dotNumber"]);

    const status = safeString(connectionInfo["status"]);
    const syncMode = safeString(connectionInfo["syncMode"]);
    const created = formatDate(connectionInfo["createdAt"]);
    const updated = formatDate(connectionInfo["updatedAt"]);

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

export function setActiveConnection(
  context: TuiContext,
  connection: Record<string, unknown>,
): void {
  const token = connection["token"] as string | undefined;
  if (!token) {
    context.state.error = "Connection has no token";
    return;
  }

  saveConfig({ connectionToken: token }, context.currentProfileName);

  const newConfig = loadConfig(context.currentProfileName);
  context.client = new TerminalClient(newConfig);

  context.state.connectionInfo = connection;
  updateConnectionDisplay(context);
  context.state.error = null;

  const providerObj = connection["provider"] as Record<string, unknown> | undefined;
  const providerName = safeString(providerObj?.["name"]);

  context.components.statusBar.content = `Active connection set to ${providerName} (${token.slice(0, 15)}...)`;

  context.state.currentView = "commands";
  context.state.results = null;
  context.state.filteredResults = null;
  context.state.filterText = "";
  context.state.selectedResultIndex = 0;
}
