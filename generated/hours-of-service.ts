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

export async function list_hosavailable_time(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/hos/available-time", {
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "limit": args["limit"] as string | number | boolean | undefined,
      "driverIds": args["driverIds"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined
    }, true);
}

export async function list_hoslogs(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/hos/logs", {
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "limit": args["limit"] as string | number | boolean | undefined,
      "startedAfter": args["startedAfter"] as string | number | boolean | undefined,
      "startedBefore": args["startedBefore"] as string | number | boolean | undefined,
      "modifiedAfter": args["modifiedAfter"] as string | number | boolean | undefined,
      "modifiedBefore": args["modifiedBefore"] as string | number | boolean | undefined,
      "driverIds": args["driverIds"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined
    }, true);
}

export async function list_hosdaily_logs(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/hos/daily-logs", {
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "limit": args["limit"] as string | number | boolean | undefined,
      "startDate": args["startDate"] as string | number | boolean | undefined,
      "endDate": args["endDate"] as string | number | boolean | undefined,
      "modifiedAfter": args["modifiedAfter"] as string | number | boolean | undefined,
      "modifiedBefore": args["modifiedBefore"] as string | number | boolean | undefined,
      "driverIds": args["driverIds"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined
    }, true);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-hosavailable-time",
    description: "Available Time for Drivers",
    method: "GET",
    path: "/hos/available-time",
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
      name: "driverIds",
      type: "string",
      required: false,
      description: "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time."
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand resources in the returned response",
      enum: ["driver"]
    },
    {
      name: "raw",
      type: "boolean",
      required: false,
      description: "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified."
    }
    ],
    handler: list_hosavailable_time
  },
  {
    name: "list-hoslogs",
    description: "List HOS Logs",
    method: "GET",
    path: "/hos/logs",
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
      name: "startedAfter",
      type: "string",
      required: false,
      description: "Only include records of statuses that started after a provided date."
    },
    {
      name: "startedBefore",
      type: "string",
      required: false,
      description: "Only include records of statuses that started before a provided date."
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
      name: "driverIds",
      type: "string",
      required: false,
      description: "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time."
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand resources in the returned response",
      enum: ["driver","vehicle","codrivers","driver,vehicle","driver,codrivers","vehicle,driver","vehicle,codrivers","codrivers,driver","codrivers,vehicle","driver,vehicle,codrivers","driver,codrivers,vehicle","vehicle,driver,codrivers","vehicle,codrivers,driver","codrivers,driver,vehicle","codrivers,vehicle,driver"]
    },
    {
      name: "raw",
      type: "boolean",
      required: false,
      description: "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified."
    }
    ],
    handler: list_hoslogs
  },
  {
    name: "list-hosdaily-logs",
    description: "List HOS Daily Logs",
    method: "GET",
    path: "/hos/daily-logs",
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
      name: "driverIds",
      type: "string",
      required: false,
      description: "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time."
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
      enum: ["driver"]
    }
    ],
    handler: list_hosdaily_logs
  }
];

export const tagName = "hours-of-service";
export const tagDescription = "Hours of Service";
