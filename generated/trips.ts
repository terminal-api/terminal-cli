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

export async function list_trips(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/trips", {
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "limit": args["limit"] as string | number | boolean | undefined,
      "modifiedAfter": args["modifiedAfter"] as string | number | boolean | undefined,
      "modifiedBefore": args["modifiedBefore"] as string | number | boolean | undefined,
      "startedAfter": args["startedAfter"] as string | number | boolean | undefined,
      "startedBefore": args["startedBefore"] as string | number | boolean | undefined,
      "endedAfter": args["endedAfter"] as string | number | boolean | undefined,
      "endedBefore": args["endedBefore"] as string | number | boolean | undefined,
      "driverIds": args["driverIds"] as string | number | boolean | undefined,
      "vehicleIds": args["vehicleIds"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined
    }, true);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-trips",
    description: "List Historical Trips",
    method: "GET",
    path: "/trips",
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
      name: "startedAfter",
      type: "string",
      required: false,
      description: "Only include trips that started after a provided date."
    },
    {
      name: "startedBefore",
      type: "string",
      required: false,
      description: "Only include trips that started before a provided date."
    },
    {
      name: "endedAfter",
      type: "string",
      required: false,
      description: "Only include trips that ended after a provided date."
    },
    {
      name: "endedBefore",
      type: "string",
      required: false,
      description: "Only include trips that ended before a provided date."
    },
    {
      name: "driverIds",
      type: "string",
      required: false,
      description: "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time."
    },
    {
      name: "vehicleIds",
      type: "string",
      required: false,
      description: "Comma separated list of vehicle IDs to filter for. Can filter up to 50 vehicles at a time."
    },
    {
      name: "raw",
      type: "boolean",
      required: false,
      description: "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified."
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand resources in the returned response",
      enum: ["vehicle","driver","driver,vehicle","vehicle,driver"]
    }
    ],
    handler: list_trips
  }
];

export const tagName = "trips";
export const tagDescription = "Trips";
