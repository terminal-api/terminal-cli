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

export async function list_fault_code_events(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/fault-codes/events", {
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "limit": args["limit"] as string | number | boolean | undefined,
      "modifiedAfter": args["modifiedAfter"] as string | number | boolean | undefined,
      "modifiedBefore": args["modifiedBefore"] as string | number | boolean | undefined,
      "startAt": args["startAt"] as string | number | boolean | undefined,
      "endAt": args["endAt"] as string | number | boolean | undefined,
      "vehicleIds": args["vehicleIds"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined
    }, true);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-fault-code-events",
    description: "List Fault Code Events",
    method: "GET",
    path: "/fault-codes/events",
    requiresConnectionToken: true,
    args: [
    {
      name: "cursor",
      type: "string",
      required: false,
      description: "Pagination cursor to start requests from"
    },
    {
      name: "limit",
      type: "number",
      required: false,
      description: "The maximum number of results to return in a page."
    },
    {
      name: "modifiedAfter",
      type: "string",
      required: false,
      description: "Only include records that were last modified after a provided date."
    },
    {
      name: "modifiedBefore",
      type: "string",
      required: false,
      description: "Only include records that were last modified before a provided date."
    },
    {
      name: "startAt",
      type: "string",
      required: false,
      description: "Only include fault code events after a provided date."
    },
    {
      name: "endAt",
      type: "string",
      required: false,
      description: "Only include fault code events before a provided date."
    },
    {
      name: "vehicleIds",
      type: "string",
      required: false,
      description: "Comma separated list of vehicle IDs to filter for. Can filter up to 50 vehicles at a time."
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand resources in the returned response",
      enum: ["vehicle"]
    },
    {
      name: "raw",
      type: "boolean",
      required: false,
      description: "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified."
    }
    ],
    handler: list_fault_code_events
  }
];

export const tagName = "fault-codes";
export const tagDescription = "Fault Codes";
