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

export async function list_safety_events(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/safety/events",
    {
      cursor: args["cursor"] as string | number | boolean | undefined,
      limit: args["limit"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      startedAfter: args["startedAfter"] as string | number | boolean | undefined,
      startedBefore: args["startedBefore"] as string | number | boolean | undefined,
      driverIds: args["driverIds"] as string | number | boolean | undefined,
      vehicleIds: args["vehicleIds"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function get_safety_event(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    `/safety/events/${String(args["id"])}`,
    {
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

export async function get_event_camera_media(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    `/safety/events/${String(args["id"])}/camera-media`,
    {
      raw: args["raw"] as string | number | boolean | undefined,
    },
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-safety-events",
    description: "List Safety Events",
    method: "GET",
    path: "/safety/events",
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
        description: "Only include records of statuses that started after a provided date.",
      },
      {
        name: "startedBefore",
        type: "string",
        required: false,
        description: "Only include records of statuses that started before a provided date.",
      },
      {
        name: "driverIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time. Each ID must use the `drv_` prefix.",
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
        enum: ["vehicle", "driver", "driver,vehicle", "vehicle,driver"],
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
    handler: list_safety_events,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Safety Event",
            additionalProperties: false,
            "x-model-category": "time-series",
            properties: {
              id: {
                type: "string",
                title: "SafetyEventId",
                format: "ulid",
                pattern: "^sft_evt_[0-9A-HJKMNP-TV-Z]{26}$",
                example: "sft_evt_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              type: {
                type: "string",
                title: "SafetyEventType",
                enum: [
                  "harsh_brake",
                  "harsh_acceleration",
                  "harsh_turn",
                  "speeding",
                  "crash",
                  "near_crash",
                  "tailgating",
                  "cell_phone",
                  "distracted",
                  "drowsiness",
                  "smoking",
                  "seat_belt_violation",
                  "stop_sign_violation",
                  "red_light_violation",
                  "unsafe_lane_change",
                  "camera_obstruction",
                  "eating_and_drinking",
                  "rolling_stop",
                  "unsafe_parking",
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
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              sourceType: {
                type: "string",
                example: "HARD_CORE_BRAKING_MESSAGE",
                description:
                  "The original event type as defined by the telematics provider's system",
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
                    additionalProperties: false,
                    examples: [],
                    properties: {
                      id: {
                        type: "string",
                        title: "DriverId",
                        description: "Unique identifier for the driver in Terminal.",
                        format: "ulid",
                        pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                        example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                      },
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
                        description: "The groups the driver belongs to.",
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
                    "x-description": "The model representing a driver in Terminal.",
                  },
                ],
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
              stats: {
                type: "object",
                properties: {
                  maximumSpeed: {
                    type: "number",
                    title: "Speed In KPH",
                    description: "Speed in KPH rounded to 2 decimal places.",
                    example: 95.33,
                  },
                  averageSpeed: {
                    type: "number",
                    title: "Speed In KPH",
                    description: "Speed in KPH rounded to 2 decimal places.",
                    example: 95.33,
                  },
                  roadSpeedLimit: {
                    type: "number",
                    title: "Speed In KPH",
                    description: "Speed in KPH rounded to 2 decimal places.",
                    example: 95.33,
                  },
                  gForceForwardBackward: {
                    type: "number",
                    title: "G-Force",
                    description: "Acceleration as a factor of gravity (g)",
                    example: 1,
                  },
                  gForceSideToSide: {
                    type: "number",
                    title: "G-Force",
                    description: "Acceleration as a factor of gravity (g)",
                    example: 1,
                  },
                  heading: {
                    type: "number",
                    title: "Heading In Degrees",
                    description: "Heading in degrees",
                    example: 25,
                  },
                },
              },
              cameraMedia: {
                type: "object",
                title: "Camera Media Reference",
                properties: {
                  frontFacing: {
                    type: "object",
                    title: "Camera Media Reference",
                    properties: {
                      sourceId: {
                        type: "string",
                        description:
                          "The identifier for the camera media file in the source system.",
                        example: "12345",
                      },
                      available: {
                        type: "boolean",
                        description:
                          "Indicates whether the camera media file is available for retrieval.",
                        example: true,
                      },
                    },
                    required: ["available"],
                  },
                  rearFacing: {
                    type: "object",
                    title: "Camera Media Reference",
                    properties: {
                      sourceId: {
                        type: "string",
                        description:
                          "The identifier for the camera media file in the source system.",
                        example: "12345",
                      },
                      available: {
                        type: "boolean",
                        description:
                          "Indicates whether the camera media file is available for retrieval.",
                        example: true,
                      },
                    },
                    required: ["available"],
                  },
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
            required: ["id", "sourceId", "provider", "type", "vehicle", "startedAt", "metadata"],
            "x-description":
              "A normalized record of a safety-related incident that occurred during a vehicle's operation. These events are detected and recorded by the telematics provider's system.",
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
  {
    name: "get-safety-event",
    description: "Get Safety Event",
    method: "GET",
    path: "/safety/events/{id}",
    requiresConnectionToken: true,
    args: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "The id of the safety event.",
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["driver", "vehicle", "driver,vehicle", "vehicle,driver"],
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
    handler: get_safety_event,
    responseSchema: {
      type: "object",
      title: "Safety Event",
      additionalProperties: false,
      "x-model-category": "time-series",
      properties: {
        id: {
          type: "string",
          title: "SafetyEventId",
          format: "ulid",
          pattern: "^sft_evt_[0-9A-HJKMNP-TV-Z]{26}$",
          example: "sft_evt_01D8ZQFGHVJ858NBF2Q7DV9MNC",
        },
        type: {
          type: "string",
          title: "SafetyEventType",
          enum: [
            "harsh_brake",
            "harsh_acceleration",
            "harsh_turn",
            "speeding",
            "crash",
            "near_crash",
            "tailgating",
            "cell_phone",
            "distracted",
            "drowsiness",
            "smoking",
            "seat_belt_violation",
            "stop_sign_violation",
            "red_light_violation",
            "unsafe_lane_change",
            "camera_obstruction",
            "eating_and_drinking",
            "rolling_stop",
            "unsafe_parking",
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
          example: "geotab",
          description:
            "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
        },
        sourceType: {
          type: "string",
          example: "HARD_CORE_BRAKING_MESSAGE",
          description: "The original event type as defined by the telematics provider's system",
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
              additionalProperties: false,
              examples: [],
              properties: {
                id: {
                  type: "string",
                  title: "DriverId",
                  description: "Unique identifier for the driver in Terminal.",
                  format: "ulid",
                  pattern: "^drv_[0-9A-HJKMNP-TV-Z]{26}$",
                  example: "drv_01D8ZQFGHVJ858NBF2Q7DV9MNC",
                },
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
                  description: "The groups the driver belongs to.",
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
              "x-description": "The model representing a driver in Terminal.",
            },
          ],
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
        stats: {
          type: "object",
          properties: {
            maximumSpeed: {
              type: "number",
              title: "Speed In KPH",
              description: "Speed in KPH rounded to 2 decimal places.",
              example: 95.33,
            },
            averageSpeed: {
              type: "number",
              title: "Speed In KPH",
              description: "Speed in KPH rounded to 2 decimal places.",
              example: 95.33,
            },
            roadSpeedLimit: {
              type: "number",
              title: "Speed In KPH",
              description: "Speed in KPH rounded to 2 decimal places.",
              example: 95.33,
            },
            gForceForwardBackward: {
              type: "number",
              title: "G-Force",
              description: "Acceleration as a factor of gravity (g)",
              example: 1,
            },
            gForceSideToSide: {
              type: "number",
              title: "G-Force",
              description: "Acceleration as a factor of gravity (g)",
              example: 1,
            },
            heading: {
              type: "number",
              title: "Heading In Degrees",
              description: "Heading in degrees",
              example: 25,
            },
          },
        },
        cameraMedia: {
          type: "object",
          title: "Camera Media Reference",
          properties: {
            frontFacing: {
              type: "object",
              title: "Camera Media Reference",
              properties: {
                sourceId: {
                  type: "string",
                  description: "The identifier for the camera media file in the source system.",
                  example: "12345",
                },
                available: {
                  type: "boolean",
                  description:
                    "Indicates whether the camera media file is available for retrieval.",
                  example: true,
                },
              },
              required: ["available"],
            },
            rearFacing: {
              type: "object",
              title: "Camera Media Reference",
              properties: {
                sourceId: {
                  type: "string",
                  description: "The identifier for the camera media file in the source system.",
                  example: "12345",
                },
                available: {
                  type: "boolean",
                  description:
                    "Indicates whether the camera media file is available for retrieval.",
                  example: true,
                },
              },
              required: ["available"],
            },
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
      required: ["id", "sourceId", "provider", "type", "vehicle", "startedAt", "metadata"],
      "x-description":
        "A normalized record of a safety-related incident that occurred during a vehicle's operation. These events are detected and recorded by the telematics provider's system.",
    },
  },
  {
    name: "get-event-camera-media",
    description: "Get Event Camera Media",
    method: "GET",
    path: "/safety/events/{id}/camera-media",
    requiresConnectionToken: true,
    args: [
      {
        name: "id",
        type: "string",
        required: true,
        description: "The id of the safety event.",
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
    handler: get_event_camera_media,
    responseSchema: {
      type: "object",
      title: "Camera Media",
      "x-model-category": "other",
      properties: {
        frontFacing: {
          type: "object",
          title: "Camera Media File",
          properties: {
            sourceId: {
              type: "string",
              description: "The identifier for the camera media file in the source system.",
              example: "12345",
            },
            videoUrl: {
              type: "string",
              description: "A URL to download the video file.",
              example: "https://example.com/video.mp4",
            },
            imageUrl: {
              type: "string",
              description: "A URL to download the image file.",
              example: "https://example.com/image.jpg",
            },
          },
        },
        rearFacing: {
          type: "object",
          title: "Camera Media File",
          properties: {
            sourceId: {
              type: "string",
              description: "The identifier for the camera media file in the source system.",
              example: "12345",
            },
            videoUrl: {
              type: "string",
              description: "A URL to download the video file.",
              example: "https://example.com/video.mp4",
            },
            imageUrl: {
              type: "string",
              description: "A URL to download the image file.",
              example: "https://example.com/image.jpg",
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
      "x-description": "Media from vehicle cameras associated with safety events.",
    },
  },
];

export const tagName = "safety";
export const tagDescription = "Safety";
