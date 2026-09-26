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
        description: "Filter issues to a specific semantic Issue code",
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
                pattern: "^isu_[0-9A-HJKMNP-TV-Z]{26}$",
                example: "isu_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              status: { enum: ["ongoing", "resolved"] },
              resolutionType: {
                type: "string",
                title: "IssueResolutionType",
                description: "How an issue is expected to be investigated or resolved.",
                enum: [
                  "action_required",
                  "automatic_retry",
                  "terminal_managed",
                  "known_limitation",
                  "investigation_required",
                ],
              },
              documentationUrl: {
                type: "string",
                format: "uri",
                description: "Direct link to the resolution guide for this semantic issue.",
              },
              connection: {
                title: "ExpandableConnection",
                example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
                oneOf: [
                  {
                    type: "string",
                    title: "ConnectionId",
                    format: "ulid",
                    example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
                  },
                  {
                    title: "Expanded Connection",
                    oneOf: [
                      {
                        title: "Full Connection",
                        description:
                          "The connection your application has with your customer's TSP.",
                        allOf: [
                          {
                            type: "object",
                            title: "Connection Base",
                            description: "Fields shared by all connection records.",
                            properties: {
                              id: {
                                type: "string",
                                title: "ConnectionId",
                                format: "ulid",
                                example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
                              },
                              sourceId: {
                                type: "string",
                                title: "SourceId",
                                example: "123456789",
                                description:
                                  "The ID used to represent the entity in the source system.",
                              },
                              provider: {
                                type: "object",
                                required: ["code", "name"],
                                properties: {
                                  name: {
                                    type: "string",
                                    example: "Geotab",
                                    description: "The name of the Telematics Service Provider.",
                                  },
                                  code: {
                                    type: "string",
                                    example: "geotab",
                                    description:
                                      "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
                                  },
                                },
                              },
                              company: {
                                type: "object",
                                properties: {
                                  name: {
                                    type: "string",
                                    example: "Frank's Trucking",
                                    description: "Optional name of the connection.",
                                  },
                                  dotNumbers: {
                                    type: "array",
                                    description:
                                      "Optional DOT numbers associated with this connection.",
                                    items: { type: "string", example: "1234567" },
                                  },
                                },
                              },
                              account: {
                                type: "object",
                                properties: {
                                  name: {
                                    type: "string",
                                    example: "Frank's Trucking",
                                    description:
                                      "The name of the account according to the provider.",
                                  },
                                  dotNumbers: {
                                    type: "array",
                                    description:
                                      "DOT numbers associated with the account according to the provider.",
                                    items: { type: "string", example: "1234567" },
                                  },
                                  user: {
                                    type: "object",
                                    description:
                                      "The user of the provider account that created the connection.",
                                    properties: {
                                      sourceId: {
                                        type: "string",
                                        description: "The ID of the user in the provider's system.",
                                        example: "1234567",
                                      },
                                      firstName: { type: "string", example: "John" },
                                      lastName: { type: "string", example: "Doe" },
                                      email: { type: "string", example: "john.doe@example.com" },
                                    },
                                  },
                                },
                              },
                              externalId: {
                                type: "string",
                                example: "1234",
                                description:
                                  "An optional ID from your system that can be used to reference connections.",
                              },
                              syncMode: {
                                type: "string",
                                title: "SyncMode",
                                enum: ["automatic", "manual"],
                                description:
                                  "Enum values:\n- `automatic`: Terminal will keep this connections data up to date\n- `manual`: Terminal will only sync data upon request",
                                default: "automatic",
                              },
                              token: {
                                type: "string",
                                example: "con_tkn_22vUhkC6tgre4kwaYfUkCDA1rzn6eyb4",
                                pattern: "^con_tkn_\\S+$",
                                description:
                                  "This token is used when interacting with a connections' data.",
                              },
                              tags: {
                                type: "array",
                                description:
                                  "An optional list of tags from your system that can be used to reference connections.",
                                items: { type: "string", example: "Tag Name" },
                              },
                              createdAt: {
                                type: "string",
                                title: "ISODateTime",
                                format: "date-time",
                                example: "2021-01-06T03:24:53.000Z",
                                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                              },
                              updatedAt: {
                                type: "string",
                                title: "ISODateTime",
                                format: "date-time",
                                example: "2021-01-06T03:24:53.000Z",
                                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                              },
                            },
                            required: [
                              "id",
                              "company",
                              "account",
                              "provider",
                              "syncMode",
                              "token",
                              "createdAt",
                              "updatedAt",
                            ],
                          },
                          {
                            type: "object",
                            properties: {
                              status: {
                                type: "string",
                                enum: ["connected", "disconnected", "archived", "pending_deletion"],
                                description: "The current status of the connection.",
                              },
                              options: {
                                type: "object",
                                oneOf: [
                                  {
                                    type: "object",
                                    properties: {
                                      ingestHistoryFromSourceSystem: {
                                        type: "boolean",
                                        default: true,
                                        description:
                                          "By default our system will ingest Vehicle Locations and Stat Logs from the source system. Omnitracs also supports history at a higher sample rate through a historical file process. If you are using these historical files and want to avoid mixing the data sources, set this to false.",
                                      },
                                    },
                                    required: [],
                                    title: "Omnitracs Options",
                                  },
                                  {
                                    type: "object",
                                    properties: {
                                      ingestHistoryFromSourceSystem: {
                                        type: "boolean",
                                        default: true,
                                        description:
                                          "By default our system will ingest Vehicle Locations and Stat Logs from the source system. Omnitracs also supports history at a higher sample rate through a historical file process. If you are using these historical files and want to avoid mixing the data sources, set this to false.",
                                      },
                                    },
                                    required: [],
                                    title: "Omnitracs ES Options",
                                  },
                                  {
                                    type: "object",
                                    properties: {
                                      ingestHistoryFromSourceSystem: {
                                        type: "boolean",
                                        default: true,
                                        description:
                                          "By default our system will ingest Vehicle Locations and Stat Logs from the source system. Omnitracs also supports history at a higher sample rate through a historical file process. If you are using these historical files and want to avoid mixing the data sources, set this to false.",
                                      },
                                    },
                                    required: [],
                                    title: "Omnitracs XRS Options",
                                  },
                                ],
                              },
                              filters: {
                                type: "object",
                                properties: {
                                  vehicles: {
                                    type: "object",
                                    properties: {
                                      status: {
                                        type: "string",
                                        enum: ["active", "inactive"],
                                        description:
                                          "Filter connection to only include data related to vehicles with a specified status",
                                      },
                                      excludeIds: {
                                        type: "array",
                                        items: {
                                          type: "string",
                                          title: "VehicleId",
                                          description:
                                            "Unique identifier for the vehicle in Terminal.",
                                          format: "ulid",
                                          pattern: "^vcl_[0-9A-HJKMNP-TV-Z]{26}$",
                                          example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                        },
                                        description:
                                          "IDs of vehicles to exclude from data ingestion",
                                      },
                                      includeIds: {
                                        type: "array",
                                        items: {
                                          type: "string",
                                          title: "VehicleId",
                                          description:
                                            "Unique identifier for the vehicle in Terminal.",
                                          format: "ulid",
                                          pattern: "^vcl_[0-9A-HJKMNP-TV-Z]{26}$",
                                          example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                        },
                                        description:
                                          "IDs of vehicles to include in data ingestion (takes priority over other filters)",
                                      },
                                    },
                                  },
                                  drivers: {
                                    type: "object",
                                    properties: {
                                      status: {
                                        type: "string",
                                        enum: ["active", "inactive"],
                                        description:
                                          "Filter connection to only include data related to drivers with a specified status",
                                      },
                                      excludeIds: {
                                        type: "array",
                                        items: {
                                          type: "string",
                                          title: "DriverId",
                                          description:
                                            "Unique identifier for the driver in Terminal.",
                                          format: "ulid",
                                          pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                                          example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                        },
                                        description:
                                          "IDs of drivers to exclude from data ingestion",
                                      },
                                      includeIds: {
                                        type: "array",
                                        items: {
                                          type: "string",
                                          title: "DriverId",
                                          description:
                                            "Unique identifier for the driver in Terminal.",
                                          format: "ulid",
                                          pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                                          example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                        },
                                        description:
                                          "IDs of drivers to include in data ingestion (takes priority over other filters)",
                                      },
                                    },
                                  },
                                },
                                description: "Filters applied to connection data",
                              },
                              linkUrl: {
                                type: "string",
                                format: "uri",
                                example:
                                  "https://link.withterminal.com/connection/{CONNECTION_ID}?key={PUBLISHABLE_KEY}",
                                description:
                                  "The URL to send your user to in order to have them re-authenticate the connection.",
                              },
                            },
                            required: ["status", "options", "linkUrl"],
                          },
                        ],
                      },
                      {
                        title: "Deleted Connection",
                        description:
                          "A retained connection record after connection-scoped data has been deleted.",
                        allOf: [
                          {
                            type: "object",
                            title: "Connection Base",
                            description: "Fields shared by all connection records.",
                            properties: {
                              id: {
                                type: "string",
                                title: "ConnectionId",
                                format: "ulid",
                                example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
                              },
                              sourceId: {
                                type: "string",
                                title: "SourceId",
                                example: "123456789",
                                description:
                                  "The ID used to represent the entity in the source system.",
                              },
                              provider: {
                                type: "object",
                                required: ["code", "name"],
                                properties: {
                                  name: {
                                    type: "string",
                                    example: "Geotab",
                                    description: "The name of the Telematics Service Provider.",
                                  },
                                  code: {
                                    type: "string",
                                    example: "geotab",
                                    description:
                                      "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
                                  },
                                },
                              },
                              company: {
                                type: "object",
                                properties: {
                                  name: {
                                    type: "string",
                                    example: "Frank's Trucking",
                                    description: "Optional name of the connection.",
                                  },
                                  dotNumbers: {
                                    type: "array",
                                    description:
                                      "Optional DOT numbers associated with this connection.",
                                    items: { type: "string", example: "1234567" },
                                  },
                                },
                              },
                              account: {
                                type: "object",
                                properties: {
                                  name: {
                                    type: "string",
                                    example: "Frank's Trucking",
                                    description:
                                      "The name of the account according to the provider.",
                                  },
                                  dotNumbers: {
                                    type: "array",
                                    description:
                                      "DOT numbers associated with the account according to the provider.",
                                    items: { type: "string", example: "1234567" },
                                  },
                                  user: {
                                    type: "object",
                                    description:
                                      "The user of the provider account that created the connection.",
                                    properties: {
                                      sourceId: {
                                        type: "string",
                                        description: "The ID of the user in the provider's system.",
                                        example: "1234567",
                                      },
                                      firstName: { type: "string", example: "John" },
                                      lastName: { type: "string", example: "Doe" },
                                      email: { type: "string", example: "john.doe@example.com" },
                                    },
                                  },
                                },
                              },
                              externalId: {
                                type: "string",
                                example: "1234",
                                description:
                                  "An optional ID from your system that can be used to reference connections.",
                              },
                              syncMode: {
                                type: "string",
                                title: "SyncMode",
                                enum: ["automatic", "manual"],
                                description:
                                  "Enum values:\n- `automatic`: Terminal will keep this connections data up to date\n- `manual`: Terminal will only sync data upon request",
                                default: "automatic",
                              },
                              token: {
                                type: "string",
                                example: "con_tkn_22vUhkC6tgre4kwaYfUkCDA1rzn6eyb4",
                                pattern: "^con_tkn_\\S+$",
                                description:
                                  "This token is used when interacting with a connections' data.",
                              },
                              tags: {
                                type: "array",
                                description:
                                  "An optional list of tags from your system that can be used to reference connections.",
                                items: { type: "string", example: "Tag Name" },
                              },
                              createdAt: {
                                type: "string",
                                title: "ISODateTime",
                                format: "date-time",
                                example: "2021-01-06T03:24:53.000Z",
                                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                              },
                              updatedAt: {
                                type: "string",
                                title: "ISODateTime",
                                format: "date-time",
                                example: "2021-01-06T03:24:53.000Z",
                                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                              },
                            },
                            required: [
                              "id",
                              "company",
                              "account",
                              "provider",
                              "syncMode",
                              "token",
                              "createdAt",
                              "updatedAt",
                            ],
                          },
                          {
                            type: "object",
                            properties: {
                              status: { type: "string", enum: ["deleting", "deleted"] },
                              deletedAt: {
                                type: "string",
                                title: "ISODateTime",
                                format: "date-time",
                                example: "2021-01-06T03:24:53.000Z",
                                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                              },
                            },
                            required: ["status"],
                          },
                        ],
                      },
                    ],
                    "x-description":
                      "The connection your application has with your customer's TSP.",
                  },
                ],
              },
              error: {
                type: "object",
                properties: {
                  code: {
                    type: "string",
                    title: "IssueCode",
                    description:
                      "Stable semantic identifier for an Issue and its remediation workflow. Legacy values remain in the schema for source compatibility but are not emitted after migration.",
                    enum: [
                      "missing_permissions",
                      "exceeded_retention_window",
                      "invalid_source_id",
                      "unknown_device_type",
                      "missing_safety_configuration",
                      "inaccessible_data",
                      "manually_disabled",
                      "permission_missing",
                      "oauth_scope_missing",
                      "subscription_required",
                      "retention_window_exceeded",
                      "provider_data_inaccessible",
                      "invalid_source_identifier",
                      "unsupported_device_type",
                      "stream_disabled",
                      "provider_provisioning_pending",
                      "provider_feature_not_enabled",
                      "missing_vehicle_identifier",
                      "missing_vehicle_assignment",
                      "provider_capability_not_supported",
                      "provider_source_data_invalid",
                      "provider_partially_configured",
                      "managed_poll_returned_no_data",
                      "managed_poll_failed",
                      "data_delayed",
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
          pattern: "^[A-Za-z0-9+/=_-]+$",
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
          pattern: "^isu_[0-9A-HJKMNP-TV-Z]{26}$",
          example: "isu_01D8ZQFGHVJ858NBF2Q7DV9MNC",
        },
        status: { enum: ["ongoing", "resolved"] },
        resolutionType: {
          type: "string",
          title: "IssueResolutionType",
          description: "How an issue is expected to be investigated or resolved.",
          enum: [
            "action_required",
            "automatic_retry",
            "terminal_managed",
            "known_limitation",
            "investigation_required",
          ],
        },
        documentationUrl: {
          type: "string",
          format: "uri",
          description: "Direct link to the resolution guide for this semantic issue.",
        },
        connection: {
          title: "ExpandableConnection",
          example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
          oneOf: [
            {
              type: "string",
              title: "ConnectionId",
              format: "ulid",
              example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
            },
            {
              title: "Expanded Connection",
              oneOf: [
                {
                  title: "Full Connection",
                  description: "The connection your application has with your customer's TSP.",
                  allOf: [
                    {
                      type: "object",
                      title: "Connection Base",
                      description: "Fields shared by all connection records.",
                      properties: {
                        id: {
                          type: "string",
                          title: "ConnectionId",
                          format: "ulid",
                          example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
                        },
                        sourceId: {
                          type: "string",
                          title: "SourceId",
                          example: "123456789",
                          description: "The ID used to represent the entity in the source system.",
                        },
                        provider: {
                          type: "object",
                          required: ["code", "name"],
                          properties: {
                            name: {
                              type: "string",
                              example: "Geotab",
                              description: "The name of the Telematics Service Provider.",
                            },
                            code: {
                              type: "string",
                              example: "geotab",
                              description:
                                "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
                            },
                          },
                        },
                        company: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              example: "Frank's Trucking",
                              description: "Optional name of the connection.",
                            },
                            dotNumbers: {
                              type: "array",
                              description: "Optional DOT numbers associated with this connection.",
                              items: { type: "string", example: "1234567" },
                            },
                          },
                        },
                        account: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              example: "Frank's Trucking",
                              description: "The name of the account according to the provider.",
                            },
                            dotNumbers: {
                              type: "array",
                              description:
                                "DOT numbers associated with the account according to the provider.",
                              items: { type: "string", example: "1234567" },
                            },
                            user: {
                              type: "object",
                              description:
                                "The user of the provider account that created the connection.",
                              properties: {
                                sourceId: {
                                  type: "string",
                                  description: "The ID of the user in the provider's system.",
                                  example: "1234567",
                                },
                                firstName: { type: "string", example: "John" },
                                lastName: { type: "string", example: "Doe" },
                                email: { type: "string", example: "john.doe@example.com" },
                              },
                            },
                          },
                        },
                        externalId: {
                          type: "string",
                          example: "1234",
                          description:
                            "An optional ID from your system that can be used to reference connections.",
                        },
                        syncMode: {
                          type: "string",
                          title: "SyncMode",
                          enum: ["automatic", "manual"],
                          description:
                            "Enum values:\n- `automatic`: Terminal will keep this connections data up to date\n- `manual`: Terminal will only sync data upon request",
                          default: "automatic",
                        },
                        token: {
                          type: "string",
                          example: "con_tkn_22vUhkC6tgre4kwaYfUkCDA1rzn6eyb4",
                          pattern: "^con_tkn_\\S+$",
                          description:
                            "This token is used when interacting with a connections' data.",
                        },
                        tags: {
                          type: "array",
                          description:
                            "An optional list of tags from your system that can be used to reference connections.",
                          items: { type: "string", example: "Tag Name" },
                        },
                        createdAt: {
                          type: "string",
                          title: "ISODateTime",
                          format: "date-time",
                          example: "2021-01-06T03:24:53.000Z",
                          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                        },
                        updatedAt: {
                          type: "string",
                          title: "ISODateTime",
                          format: "date-time",
                          example: "2021-01-06T03:24:53.000Z",
                          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                        },
                      },
                      required: [
                        "id",
                        "company",
                        "account",
                        "provider",
                        "syncMode",
                        "token",
                        "createdAt",
                        "updatedAt",
                      ],
                    },
                    {
                      type: "object",
                      properties: {
                        status: {
                          type: "string",
                          enum: ["connected", "disconnected", "archived", "pending_deletion"],
                          description: "The current status of the connection.",
                        },
                        options: {
                          type: "object",
                          oneOf: [
                            {
                              type: "object",
                              properties: {
                                ingestHistoryFromSourceSystem: {
                                  type: "boolean",
                                  default: true,
                                  description:
                                    "By default our system will ingest Vehicle Locations and Stat Logs from the source system. Omnitracs also supports history at a higher sample rate through a historical file process. If you are using these historical files and want to avoid mixing the data sources, set this to false.",
                                },
                              },
                              required: [],
                              title: "Omnitracs Options",
                            },
                            {
                              type: "object",
                              properties: {
                                ingestHistoryFromSourceSystem: {
                                  type: "boolean",
                                  default: true,
                                  description:
                                    "By default our system will ingest Vehicle Locations and Stat Logs from the source system. Omnitracs also supports history at a higher sample rate through a historical file process. If you are using these historical files and want to avoid mixing the data sources, set this to false.",
                                },
                              },
                              required: [],
                              title: "Omnitracs ES Options",
                            },
                            {
                              type: "object",
                              properties: {
                                ingestHistoryFromSourceSystem: {
                                  type: "boolean",
                                  default: true,
                                  description:
                                    "By default our system will ingest Vehicle Locations and Stat Logs from the source system. Omnitracs also supports history at a higher sample rate through a historical file process. If you are using these historical files and want to avoid mixing the data sources, set this to false.",
                                },
                              },
                              required: [],
                              title: "Omnitracs XRS Options",
                            },
                          ],
                        },
                        filters: {
                          type: "object",
                          properties: {
                            vehicles: {
                              type: "object",
                              properties: {
                                status: {
                                  type: "string",
                                  enum: ["active", "inactive"],
                                  description:
                                    "Filter connection to only include data related to vehicles with a specified status",
                                },
                                excludeIds: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                    title: "VehicleId",
                                    description: "Unique identifier for the vehicle in Terminal.",
                                    format: "ulid",
                                    pattern: "^vcl_[0-9A-HJKMNP-TV-Z]{26}$",
                                    example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                  },
                                  description: "IDs of vehicles to exclude from data ingestion",
                                },
                                includeIds: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                    title: "VehicleId",
                                    description: "Unique identifier for the vehicle in Terminal.",
                                    format: "ulid",
                                    pattern: "^vcl_[0-9A-HJKMNP-TV-Z]{26}$",
                                    example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                  },
                                  description:
                                    "IDs of vehicles to include in data ingestion (takes priority over other filters)",
                                },
                              },
                            },
                            drivers: {
                              type: "object",
                              properties: {
                                status: {
                                  type: "string",
                                  enum: ["active", "inactive"],
                                  description:
                                    "Filter connection to only include data related to drivers with a specified status",
                                },
                                excludeIds: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                    title: "DriverId",
                                    description: "Unique identifier for the driver in Terminal.",
                                    format: "ulid",
                                    pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                                    example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                  },
                                  description: "IDs of drivers to exclude from data ingestion",
                                },
                                includeIds: {
                                  type: "array",
                                  items: {
                                    type: "string",
                                    title: "DriverId",
                                    description: "Unique identifier for the driver in Terminal.",
                                    format: "ulid",
                                    pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                                    example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                                  },
                                  description:
                                    "IDs of drivers to include in data ingestion (takes priority over other filters)",
                                },
                              },
                            },
                          },
                          description: "Filters applied to connection data",
                        },
                        linkUrl: {
                          type: "string",
                          format: "uri",
                          example:
                            "https://link.withterminal.com/connection/{CONNECTION_ID}?key={PUBLISHABLE_KEY}",
                          description:
                            "The URL to send your user to in order to have them re-authenticate the connection.",
                        },
                      },
                      required: ["status", "options", "linkUrl"],
                    },
                  ],
                },
                {
                  title: "Deleted Connection",
                  description:
                    "A retained connection record after connection-scoped data has been deleted.",
                  allOf: [
                    {
                      type: "object",
                      title: "Connection Base",
                      description: "Fields shared by all connection records.",
                      properties: {
                        id: {
                          type: "string",
                          title: "ConnectionId",
                          format: "ulid",
                          example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
                        },
                        sourceId: {
                          type: "string",
                          title: "SourceId",
                          example: "123456789",
                          description: "The ID used to represent the entity in the source system.",
                        },
                        provider: {
                          type: "object",
                          required: ["code", "name"],
                          properties: {
                            name: {
                              type: "string",
                              example: "Geotab",
                              description: "The name of the Telematics Service Provider.",
                            },
                            code: {
                              type: "string",
                              example: "geotab",
                              description:
                                "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
                            },
                          },
                        },
                        company: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              example: "Frank's Trucking",
                              description: "Optional name of the connection.",
                            },
                            dotNumbers: {
                              type: "array",
                              description: "Optional DOT numbers associated with this connection.",
                              items: { type: "string", example: "1234567" },
                            },
                          },
                        },
                        account: {
                          type: "object",
                          properties: {
                            name: {
                              type: "string",
                              example: "Frank's Trucking",
                              description: "The name of the account according to the provider.",
                            },
                            dotNumbers: {
                              type: "array",
                              description:
                                "DOT numbers associated with the account according to the provider.",
                              items: { type: "string", example: "1234567" },
                            },
                            user: {
                              type: "object",
                              description:
                                "The user of the provider account that created the connection.",
                              properties: {
                                sourceId: {
                                  type: "string",
                                  description: "The ID of the user in the provider's system.",
                                  example: "1234567",
                                },
                                firstName: { type: "string", example: "John" },
                                lastName: { type: "string", example: "Doe" },
                                email: { type: "string", example: "john.doe@example.com" },
                              },
                            },
                          },
                        },
                        externalId: {
                          type: "string",
                          example: "1234",
                          description:
                            "An optional ID from your system that can be used to reference connections.",
                        },
                        syncMode: {
                          type: "string",
                          title: "SyncMode",
                          enum: ["automatic", "manual"],
                          description:
                            "Enum values:\n- `automatic`: Terminal will keep this connections data up to date\n- `manual`: Terminal will only sync data upon request",
                          default: "automatic",
                        },
                        token: {
                          type: "string",
                          example: "con_tkn_22vUhkC6tgre4kwaYfUkCDA1rzn6eyb4",
                          pattern: "^con_tkn_\\S+$",
                          description:
                            "This token is used when interacting with a connections' data.",
                        },
                        tags: {
                          type: "array",
                          description:
                            "An optional list of tags from your system that can be used to reference connections.",
                          items: { type: "string", example: "Tag Name" },
                        },
                        createdAt: {
                          type: "string",
                          title: "ISODateTime",
                          format: "date-time",
                          example: "2021-01-06T03:24:53.000Z",
                          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                        },
                        updatedAt: {
                          type: "string",
                          title: "ISODateTime",
                          format: "date-time",
                          example: "2021-01-06T03:24:53.000Z",
                          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                        },
                      },
                      required: [
                        "id",
                        "company",
                        "account",
                        "provider",
                        "syncMode",
                        "token",
                        "createdAt",
                        "updatedAt",
                      ],
                    },
                    {
                      type: "object",
                      properties: {
                        status: { type: "string", enum: ["deleting", "deleted"] },
                        deletedAt: {
                          type: "string",
                          title: "ISODateTime",
                          format: "date-time",
                          example: "2021-01-06T03:24:53.000Z",
                          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                        },
                      },
                      required: ["status"],
                    },
                  ],
                },
              ],
              "x-description": "The connection your application has with your customer's TSP.",
            },
          ],
        },
        error: {
          type: "object",
          properties: {
            code: {
              type: "string",
              title: "IssueCode",
              description:
                "Stable semantic identifier for an Issue and its remediation workflow. Legacy values remain in the schema for source compatibility but are not emitted after migration.",
              enum: [
                "missing_permissions",
                "exceeded_retention_window",
                "invalid_source_id",
                "unknown_device_type",
                "missing_safety_configuration",
                "inaccessible_data",
                "manually_disabled",
                "permission_missing",
                "oauth_scope_missing",
                "subscription_required",
                "retention_window_exceeded",
                "provider_data_inaccessible",
                "invalid_source_identifier",
                "unsupported_device_type",
                "stream_disabled",
                "provider_provisioning_pending",
                "provider_feature_not_enabled",
                "missing_vehicle_identifier",
                "missing_vehicle_assignment",
                "provider_capability_not_supported",
                "provider_source_data_invalid",
                "provider_partially_configured",
                "managed_poll_returned_no_data",
                "managed_poll_failed",
                "data_delayed",
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
