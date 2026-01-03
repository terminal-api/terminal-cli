// AUTO-GENERATED FILE - DO NOT EDIT
// Generated from OpenAPI spec

import type { TerminalClient } from "../src/lib/client.ts";

export interface CommandArg {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enum?: string[];
}

export interface Command {
  name: string;
  description: string;
  method: string;
  path: string;
  requiresConnectionToken: boolean;
  args: CommandArg[];
  handler: (client: TerminalClient, args: Record<string, unknown>) => Promise<unknown>;
}

// Command handlers

export async function list_connections(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/connections",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      externalId: args["externalId"] as string | number | boolean | undefined,
      dotNumber: args["dotNumber"] as string | number | boolean | undefined,
      tag: args["tag"] as string | number | boolean | undefined,
      updatedAfter: args["updatedAfter"] as string | number | boolean | undefined,
      updatedBefore: args["updatedBefore"] as string | number | boolean | undefined,
      status: args["status"] as string | number | boolean | undefined,
    },
    false,
  );
}

export async function get_current_connection(
  client: TerminalClient,
  _args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get("/connections/current", undefined, true);
}

export async function update_current_connection(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.patch(
    "/connections/current",
    {
      status: args["status"],
      options: args["options"],
      company: args["company"],
      externalId: args["externalId"],
      syncMode: args["syncMode"],
      tags: args["tags"],
      filters: args["filters"],
    },
    undefined,
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-connections",
    description: "List All Connections",
    method: "GET",
    path: "/connections",
    requiresConnectionToken: false,
    args: [
      {
        name: "cursor",
        type: "string",
        required: false,
        description: "Pagination cursor to start requests from",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "The maximum number of results to return in a page.",
      },
      {
        name: "externalId",
        type: "string",
        required: false,
        description: "",
      },
      {
        name: "dotNumber",
        type: "string",
        required: false,
        description: "",
      },
      {
        name: "tag",
        type: "string",
        required: false,
        description: "Filter connections by tag",
      },
      {
        name: "updatedAfter",
        type: "string",
        required: false,
        description: "Filter connections that were last updated on or after a given time.",
      },
      {
        name: "updatedBefore",
        type: "string",
        required: false,
        description: "Filter connections that were last updated on or before a given time.",
      },
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter connections by status",
      },
    ],
    handler: list_connections,
  },
  {
    name: "get-current-connection",
    description: "Get Current Connection",
    method: "GET",
    path: "/connections/current",
    requiresConnectionToken: true,
    args: [],
    handler: get_current_connection,
  },
  {
    name: "update-current-connection",
    description: "Update Current Connection",
    method: "PATCH",
    path: "/connections/current",
    requiresConnectionToken: true,
    args: [
      {
        name: "status",
        type: "string",
        required: false,
        description: "",
        enum: ["connected", "archived", "disconnected"],
      },
      {
        name: "options",
        type: "object",
        required: false,
        description: "",
      },
      {
        name: "company",
        type: "object",
        required: false,
        description: "",
      },
      {
        name: "externalId",
        type: "string",
        required: false,
        description: "",
      },
      {
        name: "syncMode",
        type: "string",
        required: false,
        description:
          "Enum values: - `automatic`: Terminal will keep this connections data up to date - `manual`: Terminal will only sync data upon request",
        enum: ["automatic", "manual"],
      },
      {
        name: "tags",
        type: "array",
        required: false,
        description: "",
      },
      {
        name: "filters",
        type: "object",
        required: false,
        description: "Filters applied to connection data",
      },
    ],
    handler: update_current_connection,
  },
];

export const tagName = "connections";
export const tagDescription = "Connections";
