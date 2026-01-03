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

export async function list_trailers(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/trailers", {
      "limit": args["limit"] as string | number | boolean | undefined,
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined,
      "modifiedAfter": args["modifiedAfter"] as string | number | boolean | undefined,
      "modifiedBefore": args["modifiedBefore"] as string | number | boolean | undefined,
      "deleted": args["deleted"] as string | number | boolean | undefined
    }, true);
}

export async function list_latest_trailer_locations(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/trailers/locations", {
      "limit": args["limit"] as string | number | boolean | undefined,
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined,
      "raw": args["raw"] as string | number | boolean | undefined
    }, true);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-trailers",
    description: "List Trailers",
    method: "GET",
    path: "/trailers",
    requiresConnectionToken: true,
    args: [
    {
      name: "limit",
      type: "number",
      required: false,
      description: "The maximum number of results to return in a page."
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      description: "Pagination cursor to start requests from"
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand resources in the returned response",
      enum: ["groups"]
    },
    {
      name: "raw",
      type: "boolean",
      required: false,
      description: "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified."
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
      name: "deleted",
      type: "boolean",
      required: false,
      description: "Show \"soft-deleted\" records that have been deleted from the provider. Defaults to false."
    }
    ],
    handler: list_trailers
  },
  {
    name: "list-latest-trailer-locations",
    description: "Latest Trailer Locations",
    method: "GET",
    path: "/trailers/locations",
    requiresConnectionToken: true,
    args: [
    {
      name: "limit",
      type: "number",
      required: false,
      description: "The maximum number of results to return in a page."
    },
    {
      name: "cursor",
      type: "string",
      required: false,
      description: "Pagination cursor to start requests from"
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand resources in the returned response",
      enum: ["trailer"]
    },
    {
      name: "raw",
      type: "boolean",
      required: false,
      description: "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified."
    }
    ],
    handler: list_latest_trailer_locations
  }
];

export const tagName = "trailers";
export const tagDescription = "Trailers";
