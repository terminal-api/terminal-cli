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

export async function public_token_exchange(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.post(
    "/public-token/exchange",
    {
      publicToken: args["publicToken"],
    },
    undefined,
    false,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "public-token-exchange",
    description: "Public Token Exchange",
    method: "POST",
    path: "/public-token/exchange",
    requiresConnectionToken: false,
    args: [
      {
        name: "publicToken",
        type: "string",
        required: true,
        description:
          "Token returned by the authentication flow. Public tokens are one time use and expire after they are exchanged for a long-lived connection token.",
      },
    ],
    handler: public_token_exchange,
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

export const tagName = "authentication";
export const tagDescription = "Authentication";
