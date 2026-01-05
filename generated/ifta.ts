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

export async function get_iftasummary(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/ifta/summary",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
      startMonth: args["startMonth"] as string | number | boolean | undefined,
      endMonth: args["endMonth"] as string | number | boolean | undefined,
      groupBy: args["groupBy"] as string | number | boolean | undefined,
    },
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "get-iftasummary",
    description: "Get IFTA Summary",
    method: "GET",
    path: "/ifta/summary",
    requiresConnectionToken: true,
    args: [
      {
        name: "cursor",
        type: "string",
        required: false,
        description: "Pagination cursor to start requests from",
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
      {
        name: "startMonth",
        type: "string",
        required: true,
        description: "The month from which to start including vehicle reports",
      },
      {
        name: "endMonth",
        type: "string",
        required: true,
        description: "Include vehicle reports up to and including this month",
      },
      {
        name: "groupBy",
        type: "string",
        required: false,
        description:
          "Computes the total distance traversed within a specified month range, with the results grouped by either jurisdiction, vehicle, or both. If no grouping parameter is provided, the default grouping is `vehicle,jurisdiction`.",
        enum: ["jurisdiction", "vehicle", "vehicle,jurisdiction", "vehicle,jurisdiction,month"],
      },
    ],
    handler: get_iftasummary,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "IFTA Summary",
            "x-model-category": "historical",
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
              jurisdiction: {
                example: "TN",
                oneOf: [
                  { type: "null" },
                  {
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
                ],
              },
              distance: {
                type: "number",
                title: "Distance In Kilometers",
                description: "Distance in kilometers",
                example: 100,
              },
              month: {
                type: "string",
                title: "ISOMonth",
                pattern: "^(\\d{4})-(0[1-9]|1[0-2])$",
                example: "2021-01",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) month",
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
            required: ["provider", "distance"],
            "x-description":
              "A report of IFTA data for a specific vehicle. Currently only incremented by full months.",
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

export const tagName = "ifta";
export const tagDescription = "IFTA";
