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

export async function list_issues(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/issues",
    {
      limit: args["limit"] as string | number | boolean | undefined,
      cursor: args["cursor"] as string | number | boolean | undefined,
      lastReportedAfter: args["lastReportedAfter"] as string | number | boolean | undefined,
      lastReportedBefore: args["lastReportedBefore"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      connectionId: args["connectionId"] as string | number | boolean | undefined,
      errorCode: args["errorCode"] as string | number | boolean | undefined,
      status: args["status"] as string | number | boolean | undefined,
    },
    false,
  );
}

export async function resolve_issue(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.post(
    `/issues/${String(args["issueId"])}/resolve`,
    undefined,
    undefined,
    false,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-issues",
    description: "List Issues",
    method: "GET",
    path: "/issues",
    requiresConnectionToken: false,
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
        name: "lastReportedAfter",
        type: "string",
        required: false,
        description: "Timestamp to start when the issue was last observed",
      },
      {
        name: "lastReportedBefore",
        type: "string",
        required: false,
        description: "Timestamp to end when the issue was last observed",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand related resources to see all details",
        enum: ["connection"],
      },
      {
        name: "connectionId",
        type: "string",
        required: false,
        description: "Filter issues to a specific connection",
      },
      {
        name: "errorCode",
        type: "string",
        required: false,
        description: "Filter issues to a specific error code",
      },
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter issues to a specific status",
        enum: ["ongoing", "resolved"],
      },
    ],
    handler: list_issues,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Issue",
            "x-model-category": "platform",
            properties: {
              id: {
                type: "string",
                title: "IssueId",
                format: "ulid",
                example: "isu_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              status: { enum: ["ongoing", "resolved"] },
              connection: {
                type: "string",
                title: "ConnectionId",
                format: "ulid",
                example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
              },
              error: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    title: "IssueCode",
                    enum: [
                      "missing_permissions",
                      "exceeded_retention_window",
                      "invalid_source_id",
                      "unknown_device_type",
                      "missing_safety_configuration",
                      "inaccessible_data",
                    ],
                  },
                  message: {
                    type: "string",
                    example:
                      "Failed to ingest HOS Logs, missing permissions to access Duty Status Logs",
                  },
                },
                required: ["code", "message"],
              },
              firstReportedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              lastReportedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
            },
            required: ["id", "connection", "status", "error", "firstReportedAt", "lastReportedAt"],
            "x-description":
              "An issue is a problem we encountered while ingesting data from a connection that may impact the quality or completeness of the data.",
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
    name: "resolve-issue",
    description: "Resolve Issue",
    method: "POST",
    path: "/issues/{issueId}/resolve",
    requiresConnectionToken: false,
    args: [
      {
        name: "issueId",
        type: "string",
        required: true,
        description: "",
      },
    ],
    handler: resolve_issue,
    responseSchema: {
      type: "object",
      title: "Issue",
      "x-model-category": "platform",
      properties: {
        id: {
          type: "string",
          title: "IssueId",
          format: "ulid",
          example: "isu_01D8ZQFGHVJ858NBF2Q7DV9MNC",
        },
        status: { enum: ["ongoing", "resolved"] },
        connection: {
          type: "string",
          title: "ConnectionId",
          format: "ulid",
          example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
        },
        error: {
          type: "object",
          properties: {
            code: {
              type: "string",
              title: "IssueCode",
              enum: [
                "missing_permissions",
                "exceeded_retention_window",
                "invalid_source_id",
                "unknown_device_type",
                "missing_safety_configuration",
                "inaccessible_data",
              ],
            },
            message: {
              type: "string",
              example: "Failed to ingest HOS Logs, missing permissions to access Duty Status Logs",
            },
          },
          required: ["code", "message"],
        },
        firstReportedAt: {
          type: "string",
          title: "ISODateTime",
          format: "date-time",
          example: "2021-01-06T03:24:53.000Z",
          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
        },
        lastReportedAt: {
          type: "string",
          title: "ISODateTime",
          format: "date-time",
          example: "2021-01-06T03:24:53.000Z",
          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
        },
      },
      required: ["id", "connection", "status", "error", "firstReportedAt", "lastReportedAt"],
      "x-description":
        "An issue is a problem we encountered while ingesting data from a connection that may impact the quality or completeness of the data.",
    },
  },
];

export const tagName = "issues";
export const tagDescription = "Issues";
