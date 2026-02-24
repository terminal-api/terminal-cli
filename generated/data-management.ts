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
  responseSchema: unknown;
}

// Command handlers

export async function list_sync_history(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/syncs",
    {
      limit: args["limit"] as string | number | boolean | undefined,
      cursor: args["cursor"] as string | number | boolean | undefined,
      status: args["status"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function request_sync(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.post(
    "/syncs",
    {
      startFrom: args["startFrom"],
      days: args["days"],
      providerRequests: args["providerRequests"],
    },
    undefined,
    true,
  );
}

export async function get_sync_job_status(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    `/syncs/${String(args["id"])}`,
    {
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function retry_sync(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.post(`/syncs/${String(args["id"])}/retry`, undefined, undefined, true);
}

export async function cancel_sync(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.post(`/syncs/${String(args["id"])}/cancel`, undefined, undefined, true);
}

export async function passthrough(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.post(
    "/passthrough",
    {
      method: args["method"],
      path: args["path"],
      headers: args["headers"],
      body: args["body"],
    },
    undefined,
    true,
  );
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
        description: "The maximum number of results to return in a page.",
      },
      {
        name: "cursor",
        type: "string",
        required: false,
        description: "Pagination cursor to start requests from",
      },
      {
        name: "status",
        type: "string",
        required: false,
        description: "",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand related resources in the response to reduce requests.",
        enum: ["issues"],
      },
    ],
    handler: list_sync_history,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Sync",
            "x-model-category": "platform",
            properties: {
              id: {
                type: "string",
                title: "SyncId",
                format: "ulid",
                example: "sync_01GV12VR4DJP70GD1ZBK0SDWFH",
              },
              status: {
                type: "string",
                title: "SyncStatus",
                description: "The status of the sync",
                example: "completed",
                enum: ["requested", "in_progress", "completed", "failed"],
              },
              failureReason: {
                type: "string",
                description: "If the sync failed, this will contain the reason",
                example: "Reason for failure if sync status is 'failed'",
              },
              progress: {
                type: "number",
                title: "Percentage",
                description: "Percentage value between 0 and 100, rounded to 2 decimal places.",
                example: 85,
                minimum: 0,
                maximum: 100,
              },
              issues: {
                type: "array",
                description:
                  "Issues are problems encountered with a connection that did not result in a failed sync but may require manual intervention. You can see the issues for a given sync by providing `issues` to the `expand` parameter.",
                items: {
                  type: "string",
                  title: "IssueId",
                  format: "ulid",
                  example: "isu_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                },
              },
              startFrom: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              attempts: { type: "number", example: 1 },
              requestedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              completedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
            },
            required: ["id", "status", "requestedAt"],
            "x-description":
              "An object containing the state of a sync job. This can be polled after connection linking to know when data is available for ingestion.",
          },
        },
        next: {
          type: "string",
          title: "Pagination Cursor",
          example: "cD0yMDIxLTAxLTA2KzAzJTNBMjQlM0E1My40MzQzMjYlMkIwMCUzQTAw",
          description: "Cursor used for pagination.",
          format: "cursor",
        },
      },
      required: ["results"],
    },
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
        description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
      },
      {
        name: "days",
        type: "number",
        required: false,
        description:
          "How many days of history to sync from `now`. Will be converted to a date and used in place of `startFrom`",
      },
      {
        name: "providerRequests",
        type: "array",
        required: false,
        description: "Request additional information from the provider for this sync.",
      },
    ],
    handler: request_sync,
    responseSchema: null,
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
        description: "",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand related resources in the response to reduce requests.",
        enum: ["issues"],
      },
    ],
    handler: get_sync_job_status,
    responseSchema: {
      type: "object",
      title: "Sync",
      "x-model-category": "platform",
      properties: {
        id: {
          type: "string",
          title: "SyncId",
          format: "ulid",
          example: "sync_01GV12VR4DJP70GD1ZBK0SDWFH",
        },
        status: {
          type: "string",
          title: "SyncStatus",
          description: "The status of the sync",
          example: "completed",
          enum: ["requested", "in_progress", "completed", "failed"],
        },
        failureReason: {
          type: "string",
          description: "If the sync failed, this will contain the reason",
          example: "Reason for failure if sync status is 'failed'",
        },
        progress: {
          type: "number",
          title: "Percentage",
          description: "Percentage value between 0 and 100, rounded to 2 decimal places.",
          example: 85,
          minimum: 0,
          maximum: 100,
        },
        issues: {
          type: "array",
          description:
            "Issues are problems encountered with a connection that did not result in a failed sync but may require manual intervention. You can see the issues for a given sync by providing `issues` to the `expand` parameter.",
          items: {
            type: "string",
            title: "IssueId",
            format: "ulid",
            example: "isu_01D8ZQFGHVJ858NBF2Q7DV9MNC",
          },
        },
        startFrom: {
          type: "string",
          title: "ISODateTime",
          format: "date-time",
          example: "2021-01-06T03:24:53.000Z",
          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
        },
        attempts: { type: "number", example: 1 },
        requestedAt: {
          type: "string",
          title: "ISODateTime",
          format: "date-time",
          example: "2021-01-06T03:24:53.000Z",
          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
        },
        completedAt: {
          type: "string",
          title: "ISODateTime",
          format: "date-time",
          example: "2021-01-06T03:24:53.000Z",
          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
        },
      },
      required: ["id", "status", "requestedAt"],
      "x-description":
        "An object containing the state of a sync job. This can be polled after connection linking to know when data is available for ingestion.",
    },
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
        description: "The ID of the sync job to retry",
      },
    ],
    handler: retry_sync,
    responseSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          title: "SyncId",
          format: "ulid",
          example: "sync_01GV12VR4DJP70GD1ZBK0SDWFH",
        },
        message: { type: "string", example: "Sync retry requested" },
      },
    },
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
        description: "The ID of the sync job to retry",
      },
    ],
    handler: cancel_sync,
    responseSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          title: "SyncId",
          format: "ulid",
          example: "sync_01GV12VR4DJP70GD1ZBK0SDWFH",
        },
        message: { type: "string", example: "Sync cancellation requested" },
      },
    },
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
        enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
      {
        name: "path",
        type: "string",
        required: true,
        description: "The path for the third-party request, such as `/reports`",
      },
      {
        name: "headers",
        type: "object",
        required: false,
        description:
          "The headers to use for the request (Terminal will handle the connection's authorization headers)",
      },
      {
        name: "body",
        type: "string",
        required: false,
        description: "The request body",
      },
    ],
    handler: passthrough,
    responseSchema: {
      type: "object",
      title: "Passthrough Output",
      properties: {
        method: {
          type: "string",
          description: "The HTTP method that was used when making the request.",
          example: "POST",
        },
        path: {
          type: "string",
          description: "The path that was called with the passthrough request.",
          example: "/reports",
          default: "/reports",
        },
        statusCode: {
          type: "integer",
          example: 200,
          description: "The resulting status code from the passthrough request.",
        },
        headers: {
          type: "object",
          example: { "Content-Type": "application/json" },
          description: "Any returned headers from the passthrough request.",
        },
        response: {
          title: "JSON Value",
          oneOf: [
            { type: "object" },
            { type: "array" },
            { type: "string" },
            { type: "number" },
            { type: "boolean" },
          ],
        },
      },
      required: ["method", "path", "statusCode", "headers", "response"],
    },
  },
];

export const tagName = "data-management";
export const tagDescription = "Data Management";
