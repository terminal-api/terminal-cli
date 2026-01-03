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

export async function get_iftasummary(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/ifta/summary",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
      startMonth: args["startMonth"] as string | number | boolean | undefined,
      endMonth: args["endMonth"] as string | number | boolean | undefined,
      groupBy: args["groupBy"] as string | number | boolean | undefined,
    },
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "get-iftasummary",
    description: "Get IFTA Summary",
    method: "GET",
    path: "/ifta/summary",
    requiresConnectionToken: true,
    args: [
      {
        name: "cursor",
        type: "string",
        required: false,
        description: "Pagination cursor to start requests from",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["vehicle"],
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
      },
      {
        name: "startMonth",
        type: "string",
        required: true,
        description: "The month from which to start including vehicle reports",
      },
      {
        name: "endMonth",
        type: "string",
        required: true,
        description: "Include vehicle reports up to and including this month",
      },
      {
        name: "groupBy",
        type: "string",
        required: false,
        description:
          "Computes the total distance traversed within a specified month range, with the results grouped by either jurisdiction, vehicle, or both. If no grouping parameter is provided, the default grouping is `vehicle,jurisdiction`.",
        enum: ["jurisdiction", "vehicle", "vehicle,jurisdiction", "vehicle,jurisdiction,month"],
      },
    ],
    handler: get_iftasummary,
  },
];

export const tagName = "ifta";
export const tagDescription = "IFTA";
