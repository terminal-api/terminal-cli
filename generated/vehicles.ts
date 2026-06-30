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

export async function list_vehicles(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/vehicles",
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

export async function get_vehicle(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    `/vehicles/${String(args["id"])}`,
    {
      raw: args["raw"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function list_latest_vehicle_locations(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/vehicles/locations",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
      vehicleIds: args["vehicleIds"] as string | number | boolean | undefined,
      driverIds: args["driverIds"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function list_historical_vehicle_locations(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    `/vehicles/${String(args["vehicleId"])}/locations`,
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      startAt: args["startAt"] as string | number | boolean | undefined,
      endAt: args["endAt"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function list_historical_vehicle_stats(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    `/vehicles/${String(args["vehicleId"])}/stats/historical`,
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      startAt: args["startAt"] as string | number | boolean | undefined,
      endAt: args["endAt"] as string | number | boolean | undefined,
      types: args["types"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-vehicles",
    description: "List Vehicles",
    method: "GET",
    path: "/vehicles",
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
        enum: ["true", "false"],
      },
      {
        name: "hidden",
        type: "boolean",
        required: false,
        description:
          "Show hidden records that don't match the configured filters. Defaults to false.",
        enum: ["true", "false"],
      },
      {
        name: "deleted",
        type: "boolean",
        required: false,
        description:
          'Show "soft-deleted" records that have been deleted from the provider. Defaults to false.',
        enum: ["true", "false"],
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["groups", "devices", "devices,groups", "groups,devices"],
      },
    ],
    handler: list_vehicles,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Vehicle",
            additionalProperties: false,
            "x-model-category": "entity",
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
                title: "Provider Code",
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
                items: {
                  example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  oneOf: [
                    {
                      type: "string",
                      title: "GroupId",
                      format: "ulid",
                      example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                    },
                    {
                      type: "object",
                      title: "Expanded Group",
                      properties: {
                        id: {
                          type: "string",
                          title: "GroupId",
                          format: "ulid",
                          example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                        },
                      },
                      required: ["id"],
                    },
                  ],
                  description:
                    "Entities in Terminal are expandable. Using the `expand` query parameter you can choose to ingest just an ID or the full entity details.",
                },
              },
              devices: {
                type: "array",
                items: {
                  example: "dvc_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  oneOf: [
                    {
                      type: "string",
                      title: "DeviceId",
                      format: "ulid",
                      example: "dvc_61D9ZWFGHVJ858NBF2Q7DV9MNC",
                    },
                    {
                      type: "object",
                      title: "Expanded Device",
                      properties: {
                        id: {
                          type: "string",
                          title: "DeviceId",
                          format: "ulid",
                          example: "dvc_61D9ZWFGHVJ858NBF2Q7DV9MNC",
                        },
                      },
                      required: ["id"],
                    },
                  ],
                  description:
                    "Entities in Terminal are expandable. Using the `expand` query parameter you can choose to ingest just an ID or the full entity details.",
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
            "x-description": "The model representing a vehicle in Terminal.",
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
    name: "get-vehicle",
    description: "Get Vehicle",
    method: "GET",
    path: "/vehicles/{id}",
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
        enum: ["true", "false"],
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["groups", "devices", "devices,groups", "groups,devices"],
      },
    ],
    handler: get_vehicle,
    responseSchema: {
      type: "object",
      title: "Vehicle",
      additionalProperties: false,
      "x-model-category": "entity",
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
          title: "Provider Code",
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
          items: {
            example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
            oneOf: [
              {
                type: "string",
                title: "GroupId",
                format: "ulid",
                example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              {
                type: "object",
                title: "Expanded Group",
                properties: {
                  id: {
                    type: "string",
                    title: "GroupId",
                    format: "ulid",
                    example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  },
                },
                required: ["id"],
              },
            ],
            description:
              "Entities in Terminal are expandable. Using the `expand` query parameter you can choose to ingest just an ID or the full entity details.",
          },
        },
        devices: {
          type: "array",
          items: {
            example: "dvc_01D8ZQFGHVJ858NBF2Q7DV9MNC",
            oneOf: [
              {
                type: "string",
                title: "DeviceId",
                format: "ulid",
                example: "dvc_61D9ZWFGHVJ858NBF2Q7DV9MNC",
              },
              {
                type: "object",
                title: "Expanded Device",
                properties: {
                  id: {
                    type: "string",
                    title: "DeviceId",
                    format: "ulid",
                    example: "dvc_61D9ZWFGHVJ858NBF2Q7DV9MNC",
                  },
                },
                required: ["id"],
              },
            ],
            description:
              "Entities in Terminal are expandable. Using the `expand` query parameter you can choose to ingest just an ID or the full entity details.",
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
      "x-description": "The model representing a vehicle in Terminal.",
    },
  },
  {
    name: "list-latest-vehicle-locations",
    description: "Latest Vehicle Locations",
    method: "GET",
    path: "/vehicles/locations",
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
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
        enum: ["true", "false"],
      },
      {
        name: "vehicleIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of vehicle IDs to filter for. Can filter up to 50 vehicles at a time. Each ID must use the `vcl_` prefix.",
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
        enum: ["vehicle", "driver", "vehicle,driver", "driver,vehicle"],
      },
    ],
    handler: list_latest_vehicle_locations,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            title: "Latest Vehicle Location",
            "x-model-category": "real-time",
            allOf: [
              {
                type: "object",
                title: "Base Vehicle Location",
                properties: {
                  provider: {
                    type: "string",
                    title: "Provider Code",
                    example: "geotab",
                    description:
                      "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
                  },
                  vehicle: {
                    description: "The ID of the vehicle that the location is tracking.",
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
                  locatedAt: {
                    type: "string",
                    title: "ISODateTime",
                    format: "date-time",
                    example: "2021-01-06T03:24:53.000Z",
                    description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                  },
                  location: {
                    type: "object",
                    title: "Coordinates",
                    properties: {
                      longitude: { type: "number", example: -122.4194155 },
                      latitude: { type: "number", example: 37.7749295 },
                    },
                    required: ["longitude", "latitude"],
                  },
                  address: {
                    type: "object",
                    description:
                      "Reverse geocoded address details for locations when available at the source.",
                    properties: {
                      formatted: { type: "string", example: "1.5 miles from Austin, TX" },
                    },
                  },
                  heading: {
                    type: "number",
                    title: "Heading In Degrees",
                    description: "Heading in degrees",
                    example: 25,
                  },
                  speed: {
                    type: "number",
                    title: "Speed In KPH",
                    description: "Speed in KPH rounded to 2 decimal places.",
                    example: 95.33,
                  },
                },
                required: ["provider", "vehicle", "locatedAt", "location"],
              },
              {
                type: "object",
                properties: {
                  odometer: {
                    type: "number",
                    title: "Distance In Kilometers",
                    description: "Distance in kilometers",
                    example: 100,
                  },
                  fuel: {
                    type: "object",
                    title: "Fuel Tanks Percentage",
                    description: "Fuel percentage",
                    properties: {
                      primaryPercentage: {
                        type: "number",
                        description:
                          "The percentage value of how much fuel is left in the primary tank.",
                        title: "Fuel Percentage",
                        example: 50,
                        minimum: 0,
                        maximum: 100,
                      },
                      secondaryPercentage: {
                        type: "number",
                        description:
                          "The percentage value of how much fuel is left in the secondary tank.",
                        title: "Fuel Percentage",
                        example: 50,
                        minimum: 0,
                        maximum: 100,
                      },
                    },
                    required: ["primaryPercentage"],
                  },
                  engineState: {
                    type: "string",
                    description: "The current state of the vehicle's engine",
                    enum: ["on", "off", "idle"],
                  },
                  engineRuntime: {
                    type: "integer",
                    description: "Total engine runtime duration",
                    title: "DurationInMS",
                    example: 0,
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
              },
            ],
            "x-description": "The latest record of a vehicle's location according to the provider.",
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
    name: "list-historical-vehicle-locations",
    description: "Historical Vehicle Locations",
    method: "GET",
    path: "/vehicles/{vehicleId}/locations",
    requiresConnectionToken: true,
    args: [
      {
        name: "vehicleId",
        type: "string",
        required: true,
        description: "Vehicle to retrieve breadcrumb locations for",
      },
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
        name: "startAt",
        type: "string",
        required: false,
        description: "Timestamp to start from - defaults to beginning of history",
      },
      {
        name: "endAt",
        type: "string",
        required: false,
        description: "Timestamp to end at - defaults to now",
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
    handler: list_historical_vehicle_locations,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            title: "Vehicle Location",
            "x-model-category": "historical",
            allOf: [
              {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    title: "VehicleLocationId",
                    description: "Unique identifier for the vehicle location in Terminal.",
                    format: "ulid",
                    example: "vcl_loc_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                  },
                  sourceId: {
                    type: "string",
                    title: "SourceId",
                    example: "123456789",
                    description: "The ID used to represent the entity in the source system.",
                  },
                },
                required: ["id"],
              },
              {
                type: "object",
                title: "Base Vehicle Location",
                properties: {
                  provider: {
                    type: "string",
                    title: "Provider Code",
                    example: "geotab",
                    description:
                      "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
                  },
                  vehicle: {
                    description: "The ID of the vehicle that the location is tracking.",
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
                  locatedAt: {
                    type: "string",
                    title: "ISODateTime",
                    format: "date-time",
                    example: "2021-01-06T03:24:53.000Z",
                    description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
                  },
                  location: {
                    type: "object",
                    title: "Coordinates",
                    properties: {
                      longitude: { type: "number", example: -122.4194155 },
                      latitude: { type: "number", example: 37.7749295 },
                    },
                    required: ["longitude", "latitude"],
                  },
                  address: {
                    type: "object",
                    description:
                      "Reverse geocoded address details for locations when available at the source.",
                    properties: {
                      formatted: { type: "string", example: "1.5 miles from Austin, TX" },
                    },
                  },
                  heading: {
                    type: "number",
                    title: "Heading In Degrees",
                    description: "Heading in degrees",
                    example: 25,
                  },
                  speed: {
                    type: "number",
                    title: "Speed In KPH",
                    description: "Speed in KPH rounded to 2 decimal places.",
                    example: 95.33,
                  },
                },
                required: ["provider", "vehicle", "locatedAt", "location"],
              },
              {
                type: "object",
                properties: {
                  metadata: {
                    type: "object",
                    title: "TimeSeriesMetadata",
                    description: "Internal metadata about the time series.",
                    required: ["modifiedAt"],
                    properties: {
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
                required: ["metadata"],
              },
            ],
            "x-description": "A point-in-time record of a vehicle's location.",
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
    name: "list-historical-vehicle-stats",
    description: "Historical Vehicle Stats",
    method: "GET",
    path: "/vehicles/{vehicleId}/stats/historical",
    requiresConnectionToken: true,
    args: [
      {
        name: "vehicleId",
        type: "string",
        required: true,
        description: "",
      },
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
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["vehicle"],
      },
      {
        name: "startAt",
        type: "string",
        required: false,
        description: "Timestamp to start from - defaults to beginning of history",
      },
      {
        name: "endAt",
        type: "string",
        required: false,
        description: "Timestamp to end at - defaults to now",
      },
      {
        name: "types",
        type: "string",
        required: false,
        description: "Comma separated list of vehicle stats to filter for",
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
    handler: list_historical_vehicle_stats,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            "x-model-category": "historical",
            title: "Vehicle Stat Log",
            properties: {
              id: {
                type: "string",
                title: "VehicleStatLogId",
                format: "ulid",
                example: "vcl_st_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              type: { type: "string" },
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
              timestamp: {
                type: "string",
                title: "ISODateTime",
                format: "date-time",
                example: "2021-01-06T03:24:53.000Z",
                description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
              },
              vehicle: {
                description: "Reference to the vehicle the event is about",
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
              metadata: {
                type: "object",
                title: "TimeSeriesMetadata",
                description: "Internal metadata about the time series.",
                required: ["modifiedAt"],
                properties: {
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
            required: ["id", "provider", "type", "timestamp", "vehicle", "metadata"],
            discriminator: { propertyName: "type" },
            oneOf: [
              {
                type: "object",
                title: "Engine State Log",
                properties: {
                  type: { type: "string", const: "engine_state" },
                  state: { type: "string", enum: ["on", "off", "idle"] },
                },
                required: ["type", "state"],
              },
              {
                type: "object",
                title: "Odometer Log",
                properties: {
                  type: { type: "string", const: "odometer" },
                  odometer: {
                    type: "number",
                    title: "Distance In Kilometers",
                    description: "Distance in kilometers",
                    example: 100,
                  },
                },
                required: ["type", "odometer"],
              },
              {
                type: "object",
                title: "Total Fuel Consumption Log",
                properties: {
                  type: { type: "string", const: "total_fuel_consumption" },
                  fuelConsumed: {
                    type: "number",
                    title: "Volume In Liters",
                    description: "Volume in liters rounded to 2 decimal places.",
                    example: 95.33,
                  },
                },
                required: ["type", "fuelConsumed"],
              },
              {
                type: "object",
                title: "Fuel Level Log",
                properties: {
                  type: { type: "string", const: "fuel_level" },
                  fuelPercentage: {
                    type: "number",
                    title: "Fuel Percentage",
                    example: 50,
                    minimum: 0,
                    maximum: 100,
                    description: "The percentage value of how much fuel is left in the tank.",
                  },
                },
                required: ["type", "fuelPercentage"],
              },
              {
                type: "object",
                title: "Engine Runtime Log",
                properties: {
                  type: { type: "string", const: "engine_runtime" },
                  duration: {
                    type: "integer",
                    title: "DurationInMS",
                    example: 0,
                    description: "Duration in MS",
                  },
                },
                required: ["type", "duration"],
              },
              {
                type: "object",
                title: "Engine Oil Percentage Log",
                properties: {
                  type: { type: "string", const: "engine_oil_percentage" },
                  percentage: {
                    type: "number",
                    title: "Percentage",
                    description: "Percentage value between 0 and 100, rounded to 2 decimal places.",
                    example: 85,
                    minimum: 0,
                    maximum: 100,
                  },
                },
                required: ["type", "percentage"],
              },
              {
                type: "object",
                title: "Engine Oil Pressure Log",
                properties: {
                  type: { type: "string", const: "engine_oil_pressure" },
                  pressure: {
                    type: "number",
                    title: "Pressure In PSI",
                    description:
                      "Pressure in PSI (Pounds per Square Inch) rounded to 2 decimal places.",
                    example: 45.2,
                  },
                },
                required: ["type", "pressure"],
              },
              {
                type: "object",
                title: "Engine Oil Temperature Log",
                properties: {
                  type: { type: "string", const: "engine_oil_temperature" },
                  temperature: {
                    type: "number",
                    title: "Temperature In Celsius",
                    description: "Temperature in Celsius rounded to 2 decimal places.",
                    example: 95.33,
                  },
                },
                required: ["type", "temperature"],
              },
              {
                type: "object",
                title: "Engine Coolant Temperature Log",
                properties: {
                  type: { type: "string", const: "engine_coolant_temperature" },
                  temperature: {
                    type: "number",
                    title: "Temperature In Celsius",
                    description: "Temperature in Celsius rounded to 2 decimal places.",
                    example: 95.33,
                  },
                },
                required: ["type", "temperature"],
              },
              {
                type: "object",
                title: "Coolant Percentage Log",
                properties: {
                  type: { type: "string", const: "coolant_percentage" },
                  percentage: {
                    type: "number",
                    title: "Percentage",
                    description: "Percentage value between 0 and 100, rounded to 2 decimal places.",
                    example: 85,
                    minimum: 0,
                    maximum: 100,
                  },
                },
                required: ["type", "percentage"],
              },
              {
                type: "object",
                title: "Engine RPM Log",
                properties: {
                  type: { type: "string", const: "engine_rpm" },
                  rpm: {
                    type: "number",
                    title: "RPM",
                    description: "Engine RPM (Revolutions Per Minute) rounded to 2 decimal places.",
                    example: 2500,
                  },
                },
                required: ["type", "rpm"],
              },
              {
                type: "object",
                title: "Battery Voltage Log",
                properties: {
                  type: { type: "string", const: "battery_voltage" },
                  voltage: {
                    type: "number",
                    title: "Voltage In Volts",
                    description: "Voltage in volts rounded to 2 decimal places.",
                    example: 12.5,
                  },
                },
                required: ["type", "voltage"],
              },
            ],
            example: [
              {
                id: "vcl_st_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                type: "engine_state",
                sourceId: "123456789",
                provider: "geotab",
                timestamp: "2021-01-06T03:24:53.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                state: "on",
                metadata: { modifiedAt: "2021-01-06T03:24:53.000Z" },
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M2D",
                type: "odometer",
                sourceId: "987654321",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                odometer: 230843,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3E",
                type: "engine_runtime",
                sourceId: "987654322",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                duration: 1234.5,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3F",
                type: "engine_oil_percentage",
                sourceId: "987654323",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                percentage: 85,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3G",
                type: "engine_oil_pressure",
                sourceId: "987654324",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                pressure: 45.2,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3H",
                type: "engine_oil_temperature",
                sourceId: "987654325",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                temperature: 95,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3I",
                type: "engine_coolant_temperature",
                sourceId: "987654326",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                temperature: 90,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3J",
                type: "coolant_percentage",
                sourceId: "987654327",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                percentage: 75,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3K",
                type: "engine_rpm",
                sourceId: "987654328",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                rpm: 2500,
                raw: [],
              },
              {
                id: "vcl_st_01D8ZQFGHVJ8584BF2Q7D29M3L",
                type: "battery_voltage",
                sourceId: "987654329",
                provider: "geotab",
                timestamp: "2021-01-06T04:34:52.000Z",
                vehicle: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                voltage: 12.5,
                raw: [],
              },
            ],
            "x-description": "A point-in-time record of stats and logs for a specific vehicle.",
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

export const tagName = "vehicles";
export const tagDescription = "Vehicles";
