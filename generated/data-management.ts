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

export async function list_sync_history(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get("/syncs", {
      "limit": args["limit"] as string | number | boolean | undefined,
      "cursor": args["cursor"] as string | number | boolean | undefined,
      "status": args["status"] as string | number | boolean | undefined,
      "expand": args["expand"] as string | number | boolean | undefined
    }, true);
}

export async function request_sync(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.post("/syncs", {
      "startFrom": args["startFrom"],
      "days": args["days"],
      "providerRequests": args["providerRequests"]
    }, undefined, true);
}

export async function get_sync_job_status(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.get(`/syncs/${args["id"]}`, {
      "expand": args["expand"] as string | number | boolean | undefined
    }, true);
}

export async function retry_sync(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.post(`/syncs/${args["id"]}/retry`, undefined, undefined, true);
}

export async function cancel_sync(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.post(`/syncs/${args["id"]}/cancel`, undefined, undefined, true);
}

export async function passthrough(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.post("/passthrough", {
      "method": args["method"],
      "path": args["path"],
      "headers": args["headers"],
      "body": args["body"]
    }, undefined, true);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-sync-history",
    description: "List Sync History",
    method: "GET",
    path: "/syncs",
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
      name: "status",
      type: "string",
      required: false,
      description: ""
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand related resources in the response to reduce requests.",
      enum: ["issues"]
    }
    ],
    handler: list_sync_history
  },
  {
    name: "request-sync",
    description: "Request Sync",
    method: "POST",
    path: "/syncs",
    requiresConnectionToken: true,
    args: [
    {
      name: "startFrom",
      type: "string",
      required: false,
      description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date"
    },
    {
      name: "days",
      type: "number",
      required: false,
      description: "How many days of history to sync from `now`. Will be converted to a date and used in place of `startFrom`"
    },
    {
      name: "providerRequests",
      type: "array",
      required: false,
      description: "Request additional information from the provider for this sync."
    }
    ],
    handler: request_sync
  },
  {
    name: "get-sync-job-status",
    description: "Get Sync Job Status",
    method: "GET",
    path: "/syncs/{id}",
    requiresConnectionToken: true,
    args: [
    {
      name: "id",
      type: "string",
      required: true,
      description: ""
    },
    {
      name: "expand",
      type: "string",
      required: false,
      description: "Expand related resources in the response to reduce requests.",
      enum: ["issues"]
    }
    ],
    handler: get_sync_job_status
  },
  {
    name: "retry-sync",
    description: "Retry Sync",
    method: "POST",
    path: "/syncs/{id}/retry",
    requiresConnectionToken: true,
    args: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "The ID of the sync job to retry"
    }
    ],
    handler: retry_sync
  },
  {
    name: "cancel-sync",
    description: "Cancel Sync",
    method: "POST",
    path: "/syncs/{id}/cancel",
    requiresConnectionToken: true,
    args: [
    {
      name: "id",
      type: "string",
      required: true,
      description: "The ID of the sync job to retry"
    }
    ],
    handler: cancel_sync
  },
  {
    name: "passthrough",
    description: "Passthrough",
    method: "POST",
    path: "/passthrough",
    requiresConnectionToken: true,
    args: [
    {
      name: "method",
      type: "string",
      required: true,
      description: "The method for the third-party request, such as GET or POST.",
      enum: ["GET","POST","PUT","PATCH","DELETE"]
    },
    {
      name: "path",
      type: "string",
      required: true,
      description: "The path for the third-party request, such as `/reports`"
    },
    {
      name: "headers",
      type: "object",
      required: false,
      description: "The headers to use for the request (Terminal will handle the connection's authorization headers)"
    },
    {
      name: "body",
      type: "string",
      required: false,
      description: "The request body"
    }
    ],
    handler: passthrough
  }
];

export const tagName = "data-management";
export const tagDescription = "Data Management";
