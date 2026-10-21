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
        enum: ["true", "false"],
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
            "x-model-category": "time-series",
            properties: {
              provider: {
                type: "string",
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              vehicle: {
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
                    additionalProperties: false,
                    properties: {
                      id: {
                        type: "string",
                        title: "VehicleId",
                        description: "Unique identifier for the vehicle in Terminal.",
                        format: "ulid",
                        pattern: "^vcl_[0-9A-HJKMNP-TV-Z]{26}$",
                        example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                      },
                      name: { type: "string", example: "Big Red" },
                      status: {
                        type: "string",
                        enum: ["active", "inactive"],
                        example: "active",
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
                      vin: { type: "string", title: "VIN", example: "1HGCM82633A004352" },
                      make: { type: "string", example: "Peterbilt" },
                      model: { type: "string", example: "Model 579" },
                      year: { type: "integer", example: 2016 },
                      groups: {
                        type: "array",
                        description: "The groups the vehicle belongs to.",
                        items: {
                          type: "string",
                          title: "GroupId",
                          format: "ulid",
                          example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                        },
                      },
                      devices: {
                        type: "array",
                        description: "The devices installed in the vehicle.",
                        items: {
                          type: "string",
                          title: "DeviceId",
                          format: "ulid",
                          example: "dvc_61D9ZWFGHVJ858NBF2Q7DV9MNC",
                        },
                      },
                      licensePlate: {
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
                          number: { type: "string", example: "ABC-1234" },
                        },
                      },
                      fuelType: {
                        enum: [
                          "gasoline",
                          "diesel",
                          "propane",
                          "electric",
                          "hybrid_gasoline",
                          "hybrid_diesel",
                          "biodiesel",
                          "compressed_natural_gas",
                          "liquefied_natural_gas",
                          "ethanol",
                          "hydrogen",
                          "plug_in_hybrid",
                        ],
                        example: "diesel",
                      },
                      fuelEfficiency: {
                        type: "number",
                        deprecated: true,
                        description:
                          "This field will be removed in the future as is not commonly available from providers.",
                        example: 27.4,
                      },
                      fuelTankCapacity: {
                        type: "number",
                        description: "Maximum amount of fuel vehicle can hold in liters.",
                        title: "Volume In Liters",
                        example: 95.33,
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
                            example: "visible",
                            description:
                              "Visibility status of a resource. Read more about hidden records [here](https://docs.withterminal.com/guides/vehicle-driver-filtering).",
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
                    "x-description": "The model representing a vehicle in Terminal.",
                  },
                ],
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
                format: "double",
                description: "Distance in kilometers",
                example: 100.25,
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
          pattern: "^[A-Za-z0-9+/=_-]+$",
        },
      },
      required: ["results"],
    },
  },
];

export const tagName = "ifta";
export const tagDescription = "IFTA";
