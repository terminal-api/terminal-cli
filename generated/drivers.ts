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

export async function list_drivers(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/drivers",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
      hidden: args["hidden"] as string | number | boolean | undefined,
      deleted: args["deleted"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function get_driver(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    `/drivers/${String(args["id"])}`,
    {
      raw: args["raw"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
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
        description: "Pagination cursor to start requests from",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "The maximum number of results to return in a page.",
      },
      {
        name: "modifiedAfter",
        type: "string",
        required: false,
        description: "Only include records that were last modified after a provided date.",
      },
      {
        name: "modifiedBefore",
        type: "string",
        required: false,
        description: "Only include records that were last modified before a provided date.",
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
      },
      {
        name: "hidden",
        type: "boolean",
        required: false,
        description:
          "Show hidden records that don't match the configured filters. Defaults to false.",
      },
      {
        name: "deleted",
        type: "boolean",
        required: false,
        description:
          'Show "soft-deleted" records that have been deleted from the provider. Defaults to false.',
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["groups"],
      },
    ],
    handler: list_drivers,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Driver",
            additionalProperties: false,
            "x-model-category": "entity",
            examples: [],
            properties: {
              id: {
                type: "string",
                title: "DriverId",
                description: "Unique identifier for the driver in Terminal.",
                format: "ulid",
                example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              status: {
                type: "string",
                enum: ["active", "inactive"],
                description: "The status in the providers system",
              },
              sourceId: {
                type: "string",
                title: "SourceId",
                example: "123456789",
                description: "The ID used to represent the entity in the source system.",
              },
              provider: {
                type: "string",
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              firstName: { type: "string", example: "Mike" },
              middleName: { type: "string", example: "Bryan" },
              lastName: { type: "string", example: "Miller" },
              email: { type: "string", format: "email", example: "driver@example.com" },
              phone: {
                type: "string",
                title: "Phone",
                pattern: "^\\+?\\d{10,14}$",
                example: "+19058084567",
                description:
                  "Phone number formatted in [E.164](https://www.twilio.com/docs/glossary/what-e164) formatting",
              },
              username: {
                type: "string",
                description: "The driver's username for login purposes",
                example: "driver123",
              },
              license: {
                type: "object",
                properties: {
                  state: {
                    type: "string",
                    title: "State",
                    enum: [
                      "AL",
                      "AK",
                      "AS",
                      "AZ",
                      "AR",
                      "CA",
                      "CO",
                      "CT",
                      "DE",
                      "FL",
                      "GA",
                      "GU",
                      "HI",
                      "ID",
                      "IL",
                      "IN",
                      "IA",
                      "KS",
                      "KY",
                      "LA",
                      "ME",
                      "MD",
                      "MA",
                      "MI",
                      "MN",
                      "MP",
                      "MS",
                      "MO",
                      "MT",
                      "NE",
                      "NV",
                      "NH",
                      "NJ",
                      "NM",
                      "NY",
                      "NC",
                      "ND",
                      "OH",
                      "OK",
                      "OR",
                      "PA",
                      "PR",
                      "RI",
                      "SC",
                      "SD",
                      "TN",
                      "TX",
                      "UT",
                      "VT",
                      "VA",
                      "WA",
                      "WV",
                      "WI",
                      "WY",
                      "VI",
                      "AB",
                      "BC",
                      "MB",
                      "NB",
                      "NL",
                      "NS",
                      "ON",
                      "PE",
                      "QC",
                      "SK",
                      "NT",
                      "NU",
                      "UM",
                      "YT",
                      "DC",
                    ],
                    example: "TN",
                    description: "US State or Canadian Province",
                  },
                  number: { type: "string", example: "123-456-789-0" },
                },
              },
              groups: {
                type: "array",
                items: {
                  type: "string",
                  title: "GroupId",
                  format: "ulid",
                  example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                },
              },
              createdAt: {
                type: "string",
                title: "SourceCreatedAt",
                format: "date-time",
                description:
                  "The date and time the record was created in the provider's system. This timestamp comes directly from the source system and represents when the data was originally created there. Note: not all providers expose this.",
              },
              updatedAt: {
                type: "string",
                title: "SourceUpdatedAt",
                format: "date-time",
                description:
                  "The date and time the record was updated in the provider's system. This timestamp comes directly from the source system and represents when the data was last updated there. Note: not all providers expose this.",
              },
              metadata: {
                type: "object",
                title: "CoreEntityMetadata",
                description: "Internal metadata about the record.",
                required: ["addedAt", "modifiedAt"],
                properties: {
                  addedAt: {
                    type: "string",
                    title: "AddedAt",
                    format: "date-time",
                    description:
                      "The date and time the record was ingested into Terminal. Note: this is not the date and time the record was created in the provider's system.",
                  },
                  deletedAt: {
                    type: "string",
                    title: "DeletedAt",
                    format: "date-time",
                    description:
                      "The date and time the record was deleted from Terminal. Note: this is not the date and time the record was deleted in the provider's system.",
                  },
                  visibility: {
                    type: "string",
                    enum: [
                      "visible",
                      "hidden_by_exclude_list",
                      "hidden_by_include_list",
                      "hidden_by_status",
                      "deleted",
                    ],
                    description:
                      "Visibility status of a resource. Read more about hidden records [here](https://docs.withterminal.com/guides/filtering).",
                  },
                  modifiedAt: {
                    type: "string",
                    title: "ModifiedAt",
                    format: "date-time",
                    description:
                      "The date and time the record was last updated in Terminal. Note: this is not the date and time the record was updated in the provider's system.",
                  },
                },
              },
              raw: {
                type: "array",
                title: "RawDataList",
                example: [],
                items: {
                  type: "object",
                  title: "RawData",
                  properties: {
                    provider: { type: "string" },
                    schema: { type: "string" },
                    extractedAt: { type: "string" },
                    data: { type: "object" },
                  },
                  required: ["provider", "schema", "extractedAt", "data"],
                },
              },
            },
            required: ["id", "sourceId", "provider", "status", "metadata"],
            "x-description": "The model representing a driver in Terminal.",
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
        description: "",
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["groups"],
      },
    ],
    handler: get_driver,
    responseSchema: {
      type: "object",
      title: "Driver",
      additionalProperties: false,
      "x-model-category": "entity",
      examples: [],
      properties: {
        id: {
          type: "string",
          title: "DriverId",
          description: "Unique identifier for the driver in Terminal.",
          format: "ulid",
          example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
        },
        status: {
          type: "string",
          enum: ["active", "inactive"],
          description: "The status in the providers system",
        },
        sourceId: {
          type: "string",
          title: "SourceId",
          example: "123456789",
          description: "The ID used to represent the entity in the source system.",
        },
        provider: {
          type: "string",
          example: "geotab",
          description:
            "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
        },
        firstName: { type: "string", example: "Mike" },
        middleName: { type: "string", example: "Bryan" },
        lastName: { type: "string", example: "Miller" },
        email: { type: "string", format: "email", example: "driver@example.com" },
        phone: {
          type: "string",
          title: "Phone",
          pattern: "^\\+?\\d{10,14}$",
          example: "+19058084567",
          description:
            "Phone number formatted in [E.164](https://www.twilio.com/docs/glossary/what-e164) formatting",
        },
        username: {
          type: "string",
          description: "The driver's username for login purposes",
          example: "driver123",
        },
        license: {
          type: "object",
          properties: {
            state: {
              type: "string",
              title: "State",
              enum: [
                "AL",
                "AK",
                "AS",
                "AZ",
                "AR",
                "CA",
                "CO",
                "CT",
                "DE",
                "FL",
                "GA",
                "GU",
                "HI",
                "ID",
                "IL",
                "IN",
                "IA",
                "KS",
                "KY",
                "LA",
                "ME",
                "MD",
                "MA",
                "MI",
                "MN",
                "MP",
                "MS",
                "MO",
                "MT",
                "NE",
                "NV",
                "NH",
                "NJ",
                "NM",
                "NY",
                "NC",
                "ND",
                "OH",
                "OK",
                "OR",
                "PA",
                "PR",
                "RI",
                "SC",
                "SD",
                "TN",
                "TX",
                "UT",
                "VT",
                "VA",
                "WA",
                "WV",
                "WI",
                "WY",
                "VI",
                "AB",
                "BC",
                "MB",
                "NB",
                "NL",
                "NS",
                "ON",
                "PE",
                "QC",
                "SK",
                "NT",
                "NU",
                "UM",
                "YT",
                "DC",
              ],
              example: "TN",
              description: "US State or Canadian Province",
            },
            number: { type: "string", example: "123-456-789-0" },
          },
        },
        groups: {
          type: "array",
          items: {
            type: "string",
            title: "GroupId",
            format: "ulid",
            example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
          },
        },
        createdAt: {
          type: "string",
          title: "SourceCreatedAt",
          format: "date-time",
          description:
            "The date and time the record was created in the provider's system. This timestamp comes directly from the source system and represents when the data was originally created there. Note: not all providers expose this.",
        },
        updatedAt: {
          type: "string",
          title: "SourceUpdatedAt",
          format: "date-time",
          description:
            "The date and time the record was updated in the provider's system. This timestamp comes directly from the source system and represents when the data was last updated there. Note: not all providers expose this.",
        },
        metadata: {
          type: "object",
          title: "CoreEntityMetadata",
          description: "Internal metadata about the record.",
          required: ["addedAt", "modifiedAt"],
          properties: {
            addedAt: {
              type: "string",
              title: "AddedAt",
              format: "date-time",
              description:
                "The date and time the record was ingested into Terminal. Note: this is not the date and time the record was created in the provider's system.",
            },
            deletedAt: {
              type: "string",
              title: "DeletedAt",
              format: "date-time",
              description:
                "The date and time the record was deleted from Terminal. Note: this is not the date and time the record was deleted in the provider's system.",
            },
            visibility: {
              type: "string",
              enum: [
                "visible",
                "hidden_by_exclude_list",
                "hidden_by_include_list",
                "hidden_by_status",
                "deleted",
              ],
              description:
                "Visibility status of a resource. Read more about hidden records [here](https://docs.withterminal.com/guides/filtering).",
            },
            modifiedAt: {
              type: "string",
              title: "ModifiedAt",
              format: "date-time",
              description:
                "The date and time the record was last updated in Terminal. Note: this is not the date and time the record was updated in the provider's system.",
            },
          },
        },
        raw: {
          type: "array",
          title: "RawDataList",
          example: [],
          items: {
            type: "object",
            title: "RawData",
            properties: {
              provider: { type: "string" },
              schema: { type: "string" },
              extractedAt: { type: "string" },
              data: { type: "object" },
            },
            required: ["provider", "schema", "extractedAt", "data"],
          },
        },
      },
      required: ["id", "sourceId", "provider", "status", "metadata"],
      "x-description": "The model representing a driver in Terminal.",
    },
  },
];

export const tagName = "drivers";
export const tagDescription = "Drivers";
