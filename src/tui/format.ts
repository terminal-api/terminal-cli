import { dim, white } from "@opentui/core";

function safeToString(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
    return String(val);
  }
  return JSON.stringify(val);
}

export function getDisplayValue(value: unknown, nameField = "name"): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    // Try common name fields
    if (obj[nameField]) return safeToString(obj[nameField]);
    if (obj["name"]) return safeToString(obj["name"]);
    if (obj["id"]) return safeToString(obj["id"]);
  }
  return null;
}

export function formatDate(dateStr: unknown): string {
  if (!dateStr || typeof dateStr !== "string") return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch {
    return String(dateStr).slice(0, 10);
  }
}

export function sidebarSection(label: string, value: string) {
  return [white(label), dim(`\n${value}\n\n`)];
}
