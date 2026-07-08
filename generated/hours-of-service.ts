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

export async function list_hosavailable_time(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/hos/available-time",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      driverIds: args["driverIds"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function list_hoslogs(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/hos/logs",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      startedAfter: args["startedAfter"] as string | number | boolean | undefined,
      startedBefore: args["startedBefore"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      driverIds: args["driverIds"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function list_hosdaily_logs(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/hos/daily-logs",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      startDate: args["startDate"] as string | number | boolean | undefined,
      endDate: args["endDate"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      driverIds: args["driverIds"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
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
        description: "Pagination cursor to start requests from",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "The maximum number of results to return in a page.",
      },
      {
        name: "driverIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time. Each ID must use the `drv_` prefix.",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["driver"],
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
        enum: ["true", "false"],
      },
    ],
    handler: list_hosavailable_time,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "HOS Available Time",
            "x-model-category": "real-time",
            properties: {
              provider: {
                type: "string",
                title: "Provider Code",
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              driver: {
                description: "Reference to the driver for this log",
                example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                oneOf: [
                  {
                    type: "string",
                    title: "DriverId",
                    description: "Unique identifier for the driver in Terminal.",
                    format: "ulid",
                    pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                    example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  },
                  {
                    type: "object",
                    title: "Expanded Driver",
                    properties: {
                      id: {
                        type: "string",
                        title: "DriverId",
                        description: "Unique identifier for the driver in Terminal.",
                        format: "ulid",
                        pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                        example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                      },
                    },
                    required: ["id"],
                  },
                ],
              },
              currentStatus: {
                type: "string",
                example: "driving",
                description: "The current status of the driver",
                enum: [
                  "off_duty",
                  "sleeper_bed",
                  "driving",
                  "on_duty",
                  "yard_move",
                  "personal_conveyance",
                  "waiting_time",
                ],
              },
              currentStatusStartedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              availableTime: {
                type: "object",
                example: { cycle: 252000000, shift: 50400000, drive: 39600000, break: 28800000 },
                description: "Available time remaning in milliseconds",
                properties: {
                  cycle: {
                    type: "integer",
                    example: 252000000,
                    description:
                      "The total remaining time for the driver's current cycle (ex: 70 hours). Value is in milliseconds.",
                    title: "DurationInMS",
                  },
                  shift: {
                    type: "integer",
                    example: 50400000,
                    description:
                      "The total remaining time for the driver's current shift (ex: 14 hours). Value is in milliseconds.",
                    title: "DurationInMS",
                  },
                  drive: {
                    type: "integer",
                    example: 39600000,
                    description:
                      "The total remaining drive time for the driver's current shift (ex: 11 hours). Value is in milliseconds.",
                    title: "DurationInMS",
                  },
                  break: {
                    type: "integer",
                    example: 28800000,
                    description:
                      "The amount of time before the next break is required (ex: 8 hours). Value is in milliseconds.",
                    title: "DurationInMS",
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
            required: ["provider", "driver", "availableTime"],
            "x-description": "The available time left on the clock for a specific driver.",
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
        description: "Pagination cursor to start requests from",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "The maximum number of results to return in a page.",
      },
      {
        name: "startedAfter",
        type: "string",
        required: false,
        description: "Only include records of statuses that started after a provided date.",
      },
      {
        name: "startedBefore",
        type: "string",
        required: false,
        description: "Only include records of statuses that started before a provided date.",
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
        name: "driverIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time. Each ID must use the `drv_` prefix.",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: [
          "driver",
          "vehicle",
          "codrivers",
          "driver,vehicle",
          "driver,codrivers",
          "vehicle,driver",
          "vehicle,codrivers",
          "codrivers,driver",
          "codrivers,vehicle",
          "driver,vehicle,codrivers",
          "driver,codrivers,vehicle",
          "vehicle,driver,codrivers",
          "vehicle,codrivers,driver",
          "codrivers,driver,vehicle",
          "codrivers,vehicle,driver",
        ],
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
        enum: ["true", "false"],
      },
    ],
    handler: list_hoslogs,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "HOS Log",
            "x-model-category": "historical",
            additionalProperties: false,
            properties: {
              id: {
                type: "string",
                title: "HOSLogId",
                format: "ulid",
                example: "hos_log_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              status: {
                type: "string",
                enum: [
                  "off_duty",
                  "sleeper_bed",
                  "driving",
                  "on_duty",
                  "yard_move",
                  "personal_conveyance",
                  "waiting_time",
                ],
              },
              sourceId: {
                type: "string",
                title: "SourceId",
                example: "123456789",
                description: "The ID used to represent the entity in the source system.",
              },
              provider: {
                type: "string",
                title: "Provider Code",
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              driver: {
                description: "Reference to the driver for this log",
                example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                oneOf: [
                  {
                    type: "string",
                    title: "DriverId",
                    description: "Unique identifier for the driver in Terminal.",
                    format: "ulid",
                    pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                    example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  },
                  {
                    type: "object",
                    title: "Expanded Driver",
                    properties: {
                      id: {
                        type: "string",
                        title: "DriverId",
                        description: "Unique identifier for the driver in Terminal.",
                        format: "ulid",
                        pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                        example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                      },
                    },
                    required: ["id"],
                  },
                ],
              },
              vehicle: {
                description: "The vehicle the driver was driving when the log was recorded.",
                example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                oneOf: [
                  {
                    type: "string",
                    title: "VehicleId",
                    description: "Unique identifier for the vehicle in Terminal.",
                    format: "ulid",
                    pattern: "^vcl_[0-9A-HJKMNP-TV-Z]{26}$",
                    example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  },
                  {
                    type: "object",
                    title: "Expanded Vehicle",
                    properties: {
                      id: {
                        type: "string",
                        title: "VehicleId",
                        description: "Unique identifier for the vehicle in Terminal.",
                        format: "ulid",
                        pattern: "^vcl_[0-9A-HJKMNP-TV-Z]{26}$",
                        example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                      },
                    },
                    required: ["id"],
                  },
                ],
              },
              codrivers: {
                type: "array",
                description: "Additional drivers that were included in the HOS log.",
                items: {
                  example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  oneOf: [
                    {
                      type: "string",
                      title: "DriverId",
                      description: "Unique identifier for the driver in Terminal.",
                      format: "ulid",
                      pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                      example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                    },
                    {
                      type: "object",
                      title: "Expanded Driver",
                      properties: {
                        id: {
                          type: "string",
                          title: "DriverId",
                          description: "Unique identifier for the driver in Terminal.",
                          format: "ulid",
                          pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                          example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                        },
                      },
                      required: ["id"],
                    },
                  ],
                  description:
                    "Entities in Terminal are expandable. Using the `expand` query parameter you can choose to ingest just an ID or the full entity details.",
                },
              },
              location: {
                type: "object",
                description: "Where the log was recorded",
                title: "Coordinates",
                properties: {
                  longitude: { type: "number", example: -122.4194155 },
                  latitude: { type: "number", example: 37.7749295 },
                },
                required: ["longitude", "latitude"],
              },
              remarks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    sourceId: {
                      type: "string",
                      title: "SourceId",
                      example: "123456789",
                      description: "The ID used to represent the entity in the source system.",
                    },
                    submittedAt: {
                      type: "string",
                      title: "ISODateTime",
                      format: "date-time",
                      example: "2021-01-06T03:24:53.000Z",
                      description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                    },
                    notes: { type: "string", description: "Additional comments" },
                  },
                  required: ["notes"],
                },
              },
              startedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              endedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              metadata: {
                type: "object",
                title: "EntityMetadata",
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
            required: [
              "id",
              "sourceId",
              "provider",
              "status",
              "driver",
              "startedAt",
              "remarks",
              "metadata",
            ],
            "x-description": "Records a change in duty status by a driver.",
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
        description: "Pagination cursor to start requests from",
      },
      {
        name: "limit",
        type: "number",
        required: false,
        description: "The maximum number of results to return in a page.",
      },
      {
        name: "startDate",
        type: "string",
        required: false,
        description:
          "Include records from on or after a specific date. Defaults to beginning of history",
      },
      {
        name: "endDate",
        type: "string",
        required: false,
        description: "Include records from on or before a specific date. Defaults to now",
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
        name: "driverIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time. Each ID must use the `drv_` prefix.",
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
        enum: ["true", "false"],
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["driver"],
      },
    ],
    handler: list_hosdaily_logs,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "HOS Daily Log",
            "x-model-category": "historical",
            properties: {
              id: {
                type: "string",
                title: "HOSDailyLogId",
                format: "ulid",
                example: "hos_day_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              sourceId: {
                type: "string",
                title: "SourceId",
                example: "123456789",
                description: "The ID used to represent the entity in the source system.",
              },
              provider: {
                type: "string",
                title: "Provider Code",
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              driver: {
                example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                oneOf: [
                  {
                    type: "string",
                    title: "DriverId",
                    description: "Unique identifier for the driver in Terminal.",
                    format: "ulid",
                    pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                    example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  },
                  {
                    type: "object",
                    title: "Expanded Driver",
                    properties: {
                      id: {
                        type: "string",
                        title: "DriverId",
                        description: "Unique identifier for the driver in Terminal.",
                        format: "ulid",
                        pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                        example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                      },
                    },
                    required: ["id"],
                  },
                ],
                description:
                  "Entities in Terminal are expandable. Using the `expand` query parameter you can choose to ingest just an ID or the full entity details.",
              },
              date: { type: "string", format: "date", example: "2021-01-06" },
              distances: {
                type: "object",
                description:
                  "Breakdown of different distance measurements for the day when available in the source system",
                properties: {
                  total: {
                    type: "number",
                    description: "Total distance driven during this day in kilometers",
                    title: "Distance In Kilometers",
                    example: 100,
                  },
                  driving: {
                    type: "number",
                    description: "Distance driven during driving",
                    title: "Distance In Kilometers",
                    example: 100,
                  },
                  personalConveyance: {
                    type: "number",
                    description: "Distance driven during personal conveyance",
                    title: "Distance In Kilometers",
                    example: 100,
                  },
                  yardMove: {
                    type: "number",
                    description: "Distance driven during yard moves",
                    title: "Distance In Kilometers",
                    example: 100,
                  },
                },
              },
              statusDurations: {
                type: "object",
                properties: {
                  onDuty: {
                    type: "integer",
                    example: 11252299,
                    title: "DurationInMS",
                    description: "Duration in MS",
                  },
                  offDuty: {
                    type: "integer",
                    example: 48478999,
                    title: "DurationInMS",
                    description: "Duration in MS",
                  },
                  driving: {
                    type: "integer",
                    example: 26668701,
                    title: "DurationInMS",
                    description: "Duration in MS",
                  },
                  waiting: {
                    type: "integer",
                    example: 232322,
                    title: "DurationInMS",
                    description: "Duration in MS",
                  },
                  sleeperBed: {
                    type: "integer",
                    example: 2300000,
                    title: "DurationInMS",
                    description: "Duration in MS",
                  },
                  personalConveyance: {
                    type: "integer",
                    example: 500000,
                    title: "DurationInMS",
                    description: "Duration in MS",
                  },
                  yardMove: {
                    type: "integer",
                    example: 62000,
                    title: "DurationInMS",
                    description: "Duration in MS",
                  },
                },
              },
              metadata: {
                type: "object",
                title: "EntityMetadata",
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
            required: [
              "id",
              "sourceId",
              "provider",
              "driver",
              "date",
              "statusDurations",
              "metadata",
            ],
            "x-description": "Record of daily hours of service.",
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
];

export const tagName = "hours-of-service";
export const tagDescription = "Hours of Service";
