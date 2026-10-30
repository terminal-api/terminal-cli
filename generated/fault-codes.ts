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

export async function list_fault_code_events(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/fault-codes/events",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      startAt: args["startAt"] as string | number | boolean | undefined,
      endAt: args["endAt"] as string | number | boolean | undefined,
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
    name: "list-fault-code-events",
    description: "List Fault Code Events",
    method: "GET",
    path: "/fault-codes/events",
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
        name: "startAt",
        type: "string",
        required: false,
        description: "Only include fault code events after a provided date.",
      },
      {
        name: "endAt",
        type: "string",
        required: false,
        description: "Only include fault code events before a provided date.",
      },
      {
        name: "vehicleIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of vehicle IDs to filter for. Can filter up to 50 vehicles at a time. Each ID must use the `vcl_` prefix.",
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
    ],
    handler: list_fault_code_events,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Fault Code Event",
            "x-model-category": "time-series",
            properties: {
              id: {
                type: "string",
                title: "FaultCodeEventId",
                format: "ulid",
                example: "fc_evt_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              status: {
                type: "string",
                enum: ["open", "pending", "closed"],
                description:
                  "The status of the fault code at the time of the event. Some providers do not report closed statuses.",
              },
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
              protocol: {
                type: "string",
                enum: ["j1939", "obdii"],
                description: "The diagnostic protocol used",
              },
              code: {
                type: "string",
                example: "P0087",
                description:
                  "The fault code identifier. For OBD-II systems: alphanumeric DTC codes (P0087, U0046, C0123, B1234). For J1939 systems: SPN-FMI format (SPN3031-FMI9) or derived codes from SPN/FMI combinations.",
              },
              description: {
                type: "string",
                example: "Fuel Rail/System Pressure - Too Low Bank 1",
                description: "Human-readable description of the fault",
              },
              observedAt: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              milStatus: {
                type: "string",
                enum: ["on", "off"],
                description:
                  "The Malfunction Indicator Lamp (MIL) status of the vehicle at the time the fault code was observed",
              },
              obdii: {
                type: "object",
                description:
                  "OBD-II Diagnostic Trouble Code information for light/medium duty vehicles. Contains standardized alphanumeric codes like P0087, U0046, C0123, B1234.",
                properties: {
                  code: {
                    type: "string",
                    example: "P0087",
                    description: "Alphanumeric DTC code (e.g., P0087, U0046)",
                  },
                  description: {
                    type: "string",
                    example: "Fuel Rail/System Pressure - Too Low Bank 1",
                    description: "Human-readable description of the DTC",
                  },
                },
                required: ["code"],
              },
              j1939: {
                type: "object",
                description:
                  "J1939 fault code information for heavy-duty vehicles. FMI (Failure Mode Identifier) indicates the specific nature of the fault (0-31 numeric codes).",
                properties: {
                  fmi: {
                    type: "integer",
                    example: 9,
                    description:
                      "Failure Mode Identifier (FMI) - numeric code (0-31) indicating the specific nature of the fault",
                  },
                  fmiDescription: {
                    type: "string",
                    example: "Voltage Below Normal",
                    description: "Human-readable description of the FMI failure mode",
                  },
                  spn: {
                    type: "integer",
                    example: 3031,
                    description:
                      "Suspect Parameter Number (SPN) - identifies the specific parameter/system affected",
                  },
                  spnDescription: {
                    type: "string",
                    example: "System Diagnostic Code #1",
                    description: "Human-readable description of the SPN parameter/system",
                  },
                  occurrenceCount: {
                    type: "integer",
                    example: 15,
                    description:
                      "The occurrence count reported by the provider at the time the fault code was observed",
                  },
                  sourceAddress: {
                    type: "integer",
                    example: 256,
                    description: "The source address of the fault code",
                  },
                },
                required: ["spn"],
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
            discriminator: { propertyName: "protocol" },
            oneOf: [
              {
                title: "FaultCodeEventObdii",
                properties: { protocol: { const: "obdii" } },
                required: ["protocol", "obdii"],
              },
              {
                title: "FaultCodeEventJ1939",
                properties: { protocol: { const: "j1939" } },
                required: ["protocol", "j1939"],
              },
            ],
            required: [
              "id",
              "provider",
              "vehicle",
              "code",
              "protocol",
              "observedAt",
              "status",
              "metadata",
            ],
            "x-description": "A fault code observed at a specific time",
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

export const tagName = "fault-codes";
export const tagDescription = "Fault Codes";
