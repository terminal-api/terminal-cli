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

export async function list_drivers(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/drivers", {
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "limit": args["limit"] as string | number | boolean | undefined,
      "modifiedAfter": args["modifiedAfter"] as string | number | boolean | undefined,
      "modifiedBefore": args["modifiedBefore"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined,
      "hidden": args["hidden"] as string | number | boolean | undefined,
      "deleted": args["deleted"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined
    }, true);
}

export async function get_driver(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get(`/drivers/${args["id"]}`, {
      "raw": args["raw"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined
    }, true);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-drivers",
    description: "List Drivers",
    method: "GET",
    path: "/drivers",
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
      name: "raw",
      type: "boolean",
      required: false,
      description: "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified."
    },
    {
      name: "hidden",
      type: "boolean",
      required: false,
      description: "Show hidden records that don't match the configured filters. Defaults to false."
    },
    {
      name: "deleted",
      type: "boolean",
      required: false,
      description: "Show \"soft-deleted\" records that have been deleted from the provider. Defaults to false."
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand resources in the returned response",
      enum: ["groups"]
    }
    ],
    handler: list_drivers
  },
  {
    name: "get-driver",
    description: "Get Driver",
    method: "GET",
    path: "/drivers/{id}",
    requiresConnectionToken: true,
    args: [
    {
      name: "id",
      type: "string",
      required: true,
      description: ""
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
      enum: ["groups"]
    }
    ],
    handler: get_driver
  }
];

export const tagName = "drivers";
export const tagDescription = "Drivers";
