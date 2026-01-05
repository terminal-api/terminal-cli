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

export async function list_connections(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/connections",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      externalId: args["externalId"] as string | number | boolean | undefined,
      dotNumber: args["dotNumber"] as string | number | boolean | undefined,
      tag: args["tag"] as string | number | boolean | undefined,
      updatedAfter: args["updatedAfter"] as string | number | boolean | undefined,
      updatedBefore: args["updatedBefore"] as string | number | boolean | undefined,
      status: args["status"] as string | number | boolean | undefined,
    },
    false,
  );
}

export async function get_current_connection(
  client: TerminalClient,
  _args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get("/connections/current", undefined, true);
}

export async function update_current_connection(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.patch(
    "/connections/current",
    {
      status: args["status"],
      options: args["options"],
      company: args["company"],
      externalId: args["externalId"],
      syncMode: args["syncMode"],
      tags: args["tags"],
      filters: args["filters"],
    },
    undefined,
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-connections",
    description: "List All Connections",
    method: "GET",
    path: "/connections",
    requiresConnectionToken: false,
    args: [
      {
        name: "cursor",
        type: "string",
        required: false,
        description: "Pagination cursor to start requests from",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "The maximum number of results to return in a page.",
      },
      {
        name: "externalId",
        type: "string",
        required: false,
        description: "",
      },
      {
        name: "dotNumber",
        type: "string",
        required: false,
        description: "",
      },
      {
        name: "tag",
        type: "string",
        required: false,
        description: "Filter connections by tag",
      },
      {
        name: "updatedAfter",
        type: "string",
        required: false,
        description: "Filter connections that were last updated on or after a given time.",
      },
      {
        name: "updatedBefore",
        type: "string",
        required: false,
        description: "Filter connections that were last updated on or before a given time.",
      },
      {
        name: "status",
        type: "string",
        required: false,
        description: "Filter connections by status",
      },
    ],
    handler: list_connections,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Connection",
            "x-model-category": "platform",
            properties: {
              id: {
                type: "string",
                title: "ConnectionId",
                format: "ulid",
                example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
              },
              status: {
                type: "string",
                title: "Connection Status",
                description:
                  "Enum values:\n- `connected`: active and authenticated connection\n- `disconnected`: connection is no longer authenticated - please ask your user to link the account again\n- `archived`: connection has been archived from view - attempts to re-connect will cause us to check the connection status again",
                enum: ["connected", "disconnected", "archived", "pending_deletion"],
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
                    description:
                      "Optional name of the connection. This is what you will see in the Terminal UI.",
                  },
                  dotNumbers: {
                    type: "array",
                    description:
                      "Optional DOT numbers associated with this connection. This is what you will see in the Terminal UI.",
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
                    description: "The user of the provider account that created the connection.",
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
                description: "This token is used when interacting with a connections' data.",
              },
              tags: {
                type: "array",
                description:
                  "An optional list of tags from your system that can be used to reference connections.",
                items: { type: "string", example: "Tag Name" },
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
              "status",
              "provider",
              "syncMode",
              "token",
              "createdAt",
              "updatedAt",
              "options",
              "linkUrl",
            ],
            "x-description": "The connection your application has with your customer's TSP.",
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
    name: "get-current-connection",
    description: "Get Current Connection",
    method: "GET",
    path: "/connections/current",
    requiresConnectionToken: true,
    args: [],
    handler: get_current_connection,
    responseSchema: {
      type: "object",
      description: "The connection your application has with your customer's TSP.",
      properties: {
        id: {
          type: "string",
          title: "ConnectionId",
          format: "ulid",
          example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
        },
        status: {
          type: "string",
          title: "Connection Status",
          description:
            "Enum values:\n- `connected`: active and authenticated connection\n- `disconnected`: connection is no longer authenticated - please ask your user to link the account again\n- `archived`: connection has been archived from view - attempts to re-connect will cause us to check the connection status again",
          enum: ["connected", "disconnected", "archived", "pending_deletion"],
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
            name: { type: "string", example: "Acme Inc.", description: "The name of the company." },
            dotNumbers: {
              type: "array",
              items: {
                type: "string",
                example: "1234567",
                description: "The DOT number of the company.",
              },
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
              description: "DOT numbers associated with the account according to the provider.",
              items: { type: "string", example: "1234567" },
            },
            user: {
              type: "object",
              description: "The user of the provider account that created the connection.",
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
        token: {
          type: "string",
          example: "T9klMDQrcHdm9jrtHuOS2Nf06BIHwMNjpPXPMB",
          description: "This token is used when interacting with a connections' data.",
        },
        externalId: {
          type: "string",
          example: "1234",
          description: "An optional ID from your system that can be used to reference connections.",
        },
        tags: { type: "array", items: { type: "string" } },
        syncMode: {
          type: "string",
          title: "SyncMode",
          enum: ["automatic", "manual"],
          description:
            "Enum values:\n- `automatic`: Terminal will keep this connections data up to date\n- `manual`: Terminal will only sync data upon request",
          default: "automatic",
        },
        linkUrl: {
          type: "string",
          format: "uri",
          example: "https://link.withterminal.com/connection/{CONNECTION_ID}?key={PUBLISHABLE_KEY}",
          description:
            "The URL to send your user to in order to have them re-authenticate the connection.",
        },
        lastSync: {
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
        agreements: {
          type: "array",
          items: {
            type: "object",
            title: "Agreement",
            properties: {
              id: {
                type: "string",
                title: "AgreementId",
                format: "ulid",
                example: "agr_01D9ZQFGHVJ858NBF2Q7DV9MNH",
              },
              connectionId: {
                type: "string",
                title: "ConnectionId",
                format: "ulid",
                example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
              },
              agreementUrl: { type: "string", format: "uri" },
              acceptedBy: {
                type: "object",
                properties: {
                  sourceId: { type: "string" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                },
              },
              acceptedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              location: { type: "string", example: "New York, NY" },
              ipAddress: { type: "string", format: "ipv4" },
              userAgent: { type: "string", format: "user-agent" },
            },
            required: ["id", "applicationId", "agreementUrl", "acceptedAt"],
          },
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
              title: "Omnitracs XRS Options",
            },
          ],
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
        "token",
        "status",
        "provider",
        "syncMode",
        "createdAt",
        "updatedAt",
        "agreements",
        "linkUrl",
      ],
    },
  },
  {
    name: "update-current-connection",
    description: "Update Current Connection",
    method: "PATCH",
    path: "/connections/current",
    requiresConnectionToken: true,
    args: [
      {
        name: "status",
        type: "string",
        required: false,
        description: "",
        enum: ["connected", "archived", "disconnected"],
      },
      {
        name: "options",
        type: "object",
        required: false,
        description: "",
      },
      {
        name: "company",
        type: "object",
        required: false,
        description: "",
      },
      {
        name: "externalId",
        type: "string",
        required: false,
        description: "",
      },
      {
        name: "syncMode",
        type: "string",
        required: false,
        description:
          "Enum values: - `automatic`: Terminal will keep this connections data up to date - `manual`: Terminal will only sync data upon request",
        enum: ["automatic", "manual"],
      },
      {
        name: "tags",
        type: "array",
        required: false,
        description: "",
      },
      {
        name: "filters",
        type: "object",
        required: false,
        description: "Filters applied to connection data",
      },
    ],
    handler: update_current_connection,
    responseSchema: {
      type: "object",
      title: "Connection",
      "x-model-category": "platform",
      properties: {
        id: {
          type: "string",
          title: "ConnectionId",
          format: "ulid",
          example: "conn_01GV12VR4DJP70GD1ZBK0SDWFH",
        },
        status: {
          type: "string",
          title: "Connection Status",
          description:
            "Enum values:\n- `connected`: active and authenticated connection\n- `disconnected`: connection is no longer authenticated - please ask your user to link the account again\n- `archived`: connection has been archived from view - attempts to re-connect will cause us to check the connection status again",
          enum: ["connected", "disconnected", "archived", "pending_deletion"],
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
              description:
                "Optional name of the connection. This is what you will see in the Terminal UI.",
            },
            dotNumbers: {
              type: "array",
              description:
                "Optional DOT numbers associated with this connection. This is what you will see in the Terminal UI.",
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
              description: "DOT numbers associated with the account according to the provider.",
              items: { type: "string", example: "1234567" },
            },
            user: {
              type: "object",
              description: "The user of the provider account that created the connection.",
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
          description: "An optional ID from your system that can be used to reference connections.",
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
          description: "This token is used when interacting with a connections' data.",
        },
        tags: {
          type: "array",
          description:
            "An optional list of tags from your system that can be used to reference connections.",
          items: { type: "string", example: "Tag Name" },
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
          example: "https://link.withterminal.com/connection/{CONNECTION_ID}?key={PUBLISHABLE_KEY}",
          description:
            "The URL to send your user to in order to have them re-authenticate the connection.",
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
        "status",
        "provider",
        "syncMode",
        "token",
        "createdAt",
        "updatedAt",
        "options",
        "linkUrl",
      ],
      "x-description": "The connection your application has with your customer's TSP.",
    },
  },
];

export const tagName = "connections";
export const tagDescription = "Connections";
