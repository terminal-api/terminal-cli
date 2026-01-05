export type OutputFormat = "json" | "pretty" | "table";

export interface OutputOptions {
  format: OutputFormat;
}

const STDOUT_COLORS_ENABLED = Boolean(process.stdout.isTTY) && !process.env["NO_COLOR"];
const STDERR_COLORS_ENABLED = Boolean(process.stderr.isTTY) && !process.env["NO_COLOR"];

function colorize(code: string, text: string, enabled: boolean): string {
  return enabled ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export function formatOutput(data: unknown, options: OutputOptions): string {
  switch (options.format) {
    case "json":
      return JSON.stringify(data, null, 2);
    case "pretty":
      return formatPretty(data);
    case "table":
      return formatTable(data);
    default:
      return JSON.stringify(data, null, 2);
  }
}

function formatPretty(data: unknown, indent = 0): string {
  const prefix = "  ".repeat(indent);

  if (data === null || data === undefined) {
    return `${prefix}${colorize("90", "null", STDOUT_COLORS_ENABLED)}`;
  }

  if (typeof data === "string") {
    return `${prefix}${colorize("32", `"${data}"`, STDOUT_COLORS_ENABLED)}`;
  }

  if (typeof data === "number" || typeof data === "boolean") {
    return `${prefix}${colorize("33", String(data), STDOUT_COLORS_ENABLED)}`;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return `${prefix}[]`;
    }
    const items = data.map((item) => formatPretty(item, indent + 1)).join(",\n");
    return `${prefix}[\n${items}\n${prefix}]`;
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) {
      return `${prefix}{}`;
    }
    const lines = entries
      .map(([key, value]) => {
        const formattedValue =
          typeof value === "object" && value !== null
            ? `\n${formatPretty(value, indent + 1)}`
            : ` ${formatPretty(value, 0).trim()}`;
        const coloredKey = colorize("36", key, STDOUT_COLORS_ENABLED);
        return `${prefix}  ${coloredKey}:${formattedValue}`;
      })
      .join("\n");
    return `${prefix}{\n${lines}\n${prefix}}`;
  }

  // data at this point can only be function or symbol
  if (typeof data === "function") {
    return `${prefix}[function]`;
  }
  if (typeof data === "symbol") {
    return `${prefix}${data.toString()}`;
  }
  return `${prefix}[unknown]`;
}

function formatTable(data: unknown): string {
  // Handle paginated results
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results: unknown[] }).results)
  ) {
    return formatArrayAsTable((data as { results: unknown[] }).results);
  }

  if (Array.isArray(data)) {
    return formatArrayAsTable(data);
  }

  // For single objects, format as key-value pairs
  if (data && typeof data === "object") {
    return formatObjectAsTable(data as Record<string, unknown>);
  }

  return String(data);
}

function getTerminalWidth(): number {
  return process.stdout.columns || 120;
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // Recursively flatten nested objects
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

function formatArrayAsTable(data: unknown[]): string {
  if (data.length === 0) {
    return "No results";
  }

  // Flatten all objects first
  const flattenedData = data.map((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return flattenObject(item as Record<string, unknown>);
    }
    return item;
  });

  // Get all unique keys from all flattened objects
  const keys = new Set<string>();
  for (const item of flattenedData) {
    if (item && typeof item === "object") {
      Object.keys(item as Record<string, unknown>).forEach((k) => keys.add(k));
    }
  }

  const columns = Array.from(keys);

  // Calculate column widths based on content
  const widths: Record<string, number> = {};
  for (const col of columns) {
    widths[col] = col.length;
    for (const item of flattenedData) {
      if (item && typeof item === "object") {
        const value = (item as Record<string, unknown>)[col];
        const strValue = formatCellValue(value);
        widths[col] = Math.max(widths[col] ?? 0, strValue.length);
      }
    }
    // Cap individual column width at 40 characters
    widths[col] = Math.min(widths[col] ?? 0, 40);
  }

  // Filter columns to fit terminal width
  const termWidth = getTerminalWidth();
  const columnGap = 2;
  const visibleColumns: string[] = [];
  let usedWidth = 0;

  for (const col of columns) {
    const colWidth = widths[col] ?? 0;
    const needed = usedWidth === 0 ? colWidth : colWidth + columnGap;
    if (usedWidth + needed <= termWidth) {
      visibleColumns.push(col);
      usedWidth += needed;
    }
  }

  // Build header
  const header = visibleColumns.map((col) => col.toUpperCase().padEnd(widths[col] ?? 0)).join("  ");
  const separator = visibleColumns.map((col) => "-".repeat(widths[col] ?? 0)).join("  ");

  // Build rows
  const rows = flattenedData.map((item) => {
    return visibleColumns
      .map((col) => {
        const value = (item as Record<string, unknown>)[col];
        const strValue = formatCellValue(value);
        const width = widths[col] ?? 0;
        return strValue.length > width
          ? strValue.slice(0, width - 3) + "..."
          : strValue.padEnd(width);
      })
      .join("  ");
  });

  return [header, separator, ...rows].join("\n");
}

function formatObjectAsTable(data: Record<string, unknown>): string {
  const lines: string[] = [];
  const maxKeyLength = Math.max(...Object.keys(data).map((k) => k.length));

  for (const [key, value] of Object.entries(data)) {
    const formattedValue = formatCellValue(value);
    lines.push(`${key.padEnd(maxKeyLength)}  ${formattedValue}`);
  }

  return lines.join("\n");
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return `[${value.length} items]`;
    }
    return "[object]";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

export function print(data: unknown, options: OutputOptions): void {
  const output = formatOutput(data, options);
  process.stdout.write(output + "\n");
}

export function printError(error: Error | string): void {
  const message = error instanceof Error ? error.message : error;
  const label = colorize("31", "Error:", STDERR_COLORS_ENABLED);
  console.error(`${label} ${message}`);
}

export function printSuccess(message: string): void {
  console.log(colorize("32", message, STDOUT_COLORS_ENABLED));
}

export function printInfo(message: string): void {
  console.log(colorize("36", message, STDOUT_COLORS_ENABLED));
}
