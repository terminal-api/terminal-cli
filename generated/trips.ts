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

export async function list_trips(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/trips",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      startedAfter: args["startedAfter"] as string | number | boolean | undefined,
      startedBefore: args["startedBefore"] as string | number | boolean | undefined,
      endedAfter: args["endedAfter"] as string | number | boolean | undefined,
      endedBefore: args["endedBefore"] as string | number | boolean | undefined,
      driverIds: args["driverIds"] as string | number | boolean | undefined,
      vehicleIds: args["vehicleIds"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-trips",
    description: "List Historical Trips",
    method: "GET",
    path: "/trips",
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
        name: "startedAfter",
        type: "string",
        required: false,
        description: "Only include trips that started after a provided date.",
      },
      {
        name: "startedBefore",
        type: "string",
        required: false,
        description: "Only include trips that started before a provided date.",
      },
      {
        name: "endedAfter",
        type: "string",
        required: false,
        description: "Only include trips that ended after a provided date.",
      },
      {
        name: "endedBefore",
        type: "string",
        required: false,
        description: "Only include trips that ended before a provided date.",
      },
      {
        name: "driverIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time.",
      },
      {
        name: "vehicleIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of vehicle IDs to filter for. Can filter up to 50 vehicles at a time.",
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
        enum: ["vehicle", "driver", "driver,vehicle", "vehicle,driver"],
      },
    ],
    handler: list_trips,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Trip",
            "x-model-category": "historical",
            additionalProperties: false,
            properties: {
              id: {
                type: "string",
                title: "TripId",
                format: "ulid",
                example: "trp_01D9ZQFGHVJ858NBF2Q7DV9MNH",
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
              driver: {
                type: "string",
                title: "DriverId",
                description: "Unique identifier for the driver in Terminal.",
                format: "ulid",
                example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              vehicle: {
                type: "string",
                title: "VehicleId",
                description: "Unique identifier for the vehicle in Terminal.",
                format: "ulid",
                example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              startLocation: {
                type: "object",
                title: "Coordinates",
                properties: {
                  longitude: { type: "number", example: -122.4194155 },
                  latitude: { type: "number", example: 37.7749295 },
                },
                required: ["longitude", "latitude"],
              },
              endLocation: {
                type: "object",
                title: "Coordinates",
                properties: {
                  longitude: { type: "number", example: -122.4194155 },
                  latitude: { type: "number", example: 37.7749295 },
                },
                required: ["longitude", "latitude"],
              },
              distance: {
                type: "number",
                title: "Distance In Kilometers",
                description: "Distance in kilometers",
                example: 100,
              },
              duration: {
                type: "integer",
                title: "DurationInMS",
                example: 0,
                description: "Duration in MS",
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
              "provider",
              "sourceId",
              "vehicle",
              "startedAt",
              "endedAt",
              "duration",
              "metadata",
            ],
            "x-description":
              "Trips define a period of time where a vehicle is in motion. Trips are based on the provider's definition.",
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

export const tagName = "trips";
export const tagDescription = "Trips";
