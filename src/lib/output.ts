export type OutputFormat = "json" | "pretty" | "table";

export interface OutputOptions {
  format: OutputFormat;
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
    return `${prefix}\x1b[90mnull\x1b[0m`;
  }

  if (typeof data === "string") {
    return `${prefix}\x1b[32m"${data}"\x1b[0m`;
  }

  if (typeof data === "number" || typeof data === "boolean") {
    return `${prefix}\x1b[33m${data}\x1b[0m`;
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
        return `${prefix}  \x1b[36m${key}\x1b[0m:${formattedValue}`;
      })
      .join("\n");
    return `${prefix}{\n${lines}\n${prefix}}`;
  }

  return `${prefix}${String(data)}`;
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

function formatArrayAsTable(data: unknown[]): string {
  if (data.length === 0) {
    return "No results";
  }

  // Get all unique keys from all objects
  const keys = new Set<string>();
  for (const item of data) {
    if (item && typeof item === "object") {
      Object.keys(item as Record<string, unknown>).forEach((k) => keys.add(k));
    }
  }

  const columns = Array.from(keys);

  // Calculate column widths
  const widths: Record<string, number> = {};
  for (const col of columns) {
    widths[col] = col.length;
    for (const item of data) {
      if (item && typeof item === "object") {
        const value = (item as Record<string, unknown>)[col];
        const strValue = formatCellValue(value);
        widths[col] = Math.max(widths[col] ?? 0, strValue.length);
      }
    }
    // Cap width at 50 characters
    widths[col] = Math.min(widths[col] ?? 0, 50);
  }

  // Build header
  const header = columns
    .map((col) => col.toUpperCase().padEnd(widths[col] ?? 0))
    .join("  ");
  const separator = columns.map((col) => "-".repeat(widths[col] ?? 0)).join("  ");

  // Build rows
  const rows = data.map((item) => {
    return columns
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
  return String(value);
}

export function print(data: unknown, options: OutputOptions): void {
  console.log(formatOutput(data, options));
}

export function printError(error: Error | string): void {
  const message = error instanceof Error ? error.message : error;
  console.error(`\x1b[31mError:\x1b[0m ${message}`);
}

export function printSuccess(message: string): void {
  console.log(`\x1b[32m${message}\x1b[0m`);
}

export function printInfo(message: string): void {
  console.log(`\x1b[36m${message}\x1b[0m`);
}
