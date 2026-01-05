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

export async function get_vehicle_utilization(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/vehicles/utilization",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      startDate: args["startDate"] as string | number | boolean | undefined,
      endDate: args["endDate"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      vehicleIds: args["vehicleIds"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "get-vehicle-utilization",
    description: "Get Vehicle Utilization",
    method: "GET",
    path: "/vehicles/utilization",
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
        name: "vehicleIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of vehicle IDs to filter for. Can filter up to 50 vehicles at a time.",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["vehicle"],
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
      },
    ],
    handler: get_vehicle_utilization,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Vehicle Utilization",
            "x-model-category": "historical",
            additionalProperties: false,
            properties: {
              provider: {
                type: "string",
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              vehicle: {
                type: "string",
                title: "VehicleId",
                description: "Unique identifier for the vehicle in Terminal.",
                format: "ulid",
                example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              startAt: {
                type: "string",
                format: "date-time",
                description: "The start date of the utilization data.",
              },
              endAt: {
                type: "string",
                format: "date-time",
                description: "The end date of the utilization data.",
              },
              fuelConsumed: {
                type: "number",
                title: "Volume In Liters",
                description: "Volume in liters rounded to 2 decimal places.",
                example: 95.33,
              },
              distance: {
                type: "number",
                title: "Distance In Kilometers",
                description: "Distance in kilometers",
                example: 100,
              },
              durations: {
                type: "object",
                properties: {
                  driving: {
                    type: "integer",
                    title: "DurationInMS",
                    example: 0,
                    description: "Duration in MS",
                  },
                  idling: {
                    type: "integer",
                    title: "DurationInMS",
                    example: 0,
                    description: "Duration in MS",
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
            required: ["provider", "vehicle", "startAt", "endAt", "distance"],
            "x-description": "Vehicle usage metrics for a specific vehicle and date range.",
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

export const tagName = "vehicle-utilization";
export const tagDescription = "Vehicle Utilization";
