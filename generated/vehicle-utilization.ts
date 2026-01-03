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

export async function get_vehicle_utilization(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/vehicles/utilization", {
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "limit": args["limit"] as string | number | boolean | undefined,
      "startDate": args["startDate"] as string | number | boolean | undefined,
      "endDate": args["endDate"] as string | number | boolean | undefined,
      "modifiedAfter": args["modifiedAfter"] as string | number | boolean | undefined,
      "modifiedBefore": args["modifiedBefore"] as string | number | boolean | undefined,
      "vehicleIds": args["vehicleIds"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined
    }, true);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "get-vehicle-utilization",
    description: "Get Vehicle Utilization",
    method: "GET",
    path: "/vehicles/utilization",
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
      name: "startDate",
      type: "string",
      required: false,
      description: "Include records from on or after a specific date. Defaults to beginning of history"
    },
    {
      name: "endDate",
      type: "string",
      required: false,
      description: "Include records from on or before a specific date. Defaults to now"
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
    handler: get_vehicle_utilization
  }
];

export const tagName = "vehicle-utilization";
export const tagDescription = "Vehicle Utilization";
