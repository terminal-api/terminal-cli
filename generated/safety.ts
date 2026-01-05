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
            "x-model-category": "historical",
            properties: {
              id: {
                type: "string",
                title: "SafetyEventId",
                format: "ulid",
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
              extensions: {
                type: "object",
                description:
                  "Includes data enriched via third-party vendors. See [Extensions](/terminal-platform/extensions)",
                properties: {
                  here: {
                    type: "object",
                    title: "Here Safety Event Extension",
                    properties: {
                      speedLimit: {
                        type: "number",
                        title: "Speed In KPH",
                        description: "Speed in KPH rounded to 2 decimal places.",
                        example: 95.33,
                      },
                      speedLimitSource: {
                        type: "string",
                        title: "Speed Limit Source",
                        enum: ["posted", "derived"],
                        description: "Source for speed limit obtained from the HERE platform.",
                        example: "posted",
                      },
                      truckSpeedLimit: {
                        type: "number",
                        title: "Speed In KPH",
                        description: "Speed in KPH rounded to 2 decimal places.",
                        example: 95.33,
                      },
                      roadName: {
                        type: "string",
                        description: "Name of the road obtained from the HERE platform.",
                        example: "John St",
                      },
                      linkAttributes: {
                        type: "object",
                        description: "Additional road attributes from HERE platform",
                        properties: {
                          countryCode: {
                            type: "string",
                            description: "ISO country code of the road location",
                          },
                          vehicleTypes: {
                            type: "string",
                            description: "Types of vehicles allowed",
                          },
                          isUrban: {
                            type: "string",
                            description: "Indicates if the road is in an urban area",
                          },
                          transportVerified: {
                            type: "string",
                            description: "Indicates if transport information is verified",
                          },
                          functionalClass: {
                            type: "string",
                            description:
                              "Road functional class according to HERE Maps:\n- 0: Unknown\n- 1: Functional Class 1 \n- 2: Functional Class 2 \n- 3: Functional Class 3 \n- 4: Functional Class 4 \n- 5: Functional Class 5",
                          },
                          controlledAccess: {
                            type: "string",
                            description: "Indicates if the road has controlled access",
                          },
                          limitedAccessRoad: {
                            type: "string",
                            description: "Indicates if it's a limited access road",
                          },
                          travelDirection: { type: "string", description: "Direction of travel" },
                          isBoatFerry: {
                            type: "string",
                            description: "Indicates if it's a boat ferry route",
                          },
                          isRailFerry: {
                            type: "string",
                            description: "Indicates if it's a rail ferry route",
                          },
                          isMultiDigitized: {
                            type: "string",
                            description: "Indicates if the road is multi-digitized",
                          },
                          isDivided: {
                            type: "string",
                            description: "Indicates if the road is divided",
                          },
                          isDividerLegal: {
                            type: "string",
                            description: "Indicates if the divider is legal",
                          },
                          isFrontage: {
                            type: "string",
                            description: "Indicates if it's a frontage road",
                          },
                          isPaved: {
                            type: "string",
                            description: "Indicates if the road is paved",
                          },
                          isRamp: { type: "string", description: "Indicates if it's a ramp" },
                          isPrivate: {
                            type: "string",
                            description: "Indicates if it's a private road",
                          },
                          hasPoiAccess: {
                            type: "string",
                            description: "Indicates if there's POI access",
                          },
                          intersectionCategory: {
                            type: "string",
                            description:
                              "Type of intersection according to HERE Maps:\n- 0: Unknown\n- 1: Intersection Internal\n- 2: Manoeuvre\n- 3: Indescribable\n- 4: Roundabout\n- 5: Undefined Traffic Area\n- 6: Special Traffic Figure",
                          },
                          speedCategory: {
                            type: "string",
                            description:
                              "Speed category according to HERE Maps:\n- 0: Unknown\n- 1: Over 130 km/h (80 mph)\n- 2: 101-130 km/h (65-80 mph)\n- 3: 91-100 km/h (55-64 mph)\n- 4: 71-90 km/h (41-54 mph)\n- 5: 51-70 km/h (31-40 mph)\n- 6: 31-50 km/h (21-30 mph)\n- 7: 11-30 km/h (6-20 mph)\n- 8: Under 11 km/h (6 mph)",
                          },
                          laneCategory: {
                            type: "string",
                            description:
                              "Lane category according to HERE Maps:\n- 0: Unknown\n- 1: One lane\n- 2: Two or three lanes\n- 3: Four or more lanes",
                          },
                          coverageIndicator: { type: "string", description: "Coverage indicator" },
                          lowMobility: {
                            type: "string",
                            description:
                              "Low mobility indicator:\n- 0: Unknown (Default)\n- 1: Low mobility driving condition\n- 2: Not low mobility driving condition",
                          },
                          hasPublicAccess: {
                            type: "string",
                            description: "Indicates if there's public access",
                          },
                          routeTypes: { type: "string", description: "Types of routes" },
                        },
                      },
                      weather: {
                        type: "object",
                        description: "Weather conditions at the time of the event",
                        properties: {
                          latitude: {
                            type: "number",
                            description: "Latitude of weather measurement location",
                          },
                          longitude: {
                            type: "number",
                            description: "Longitude of weather measurement location",
                          },
                          temperature: {
                            type: "number",
                            description: "Air temperature in Celsius",
                          },
                          dewPoint: {
                            type: "number",
                            description: "Dew point temperature in Celsius",
                          },
                          humidity: { type: "number", description: "Relative humidity percentage" },
                          pressure: { type: "number", description: "Air pressure" },
                          windSpeed: {
                            type: "number",
                            description: "Wind velocity in meters per second",
                          },
                          windDirection: {
                            type: "number",
                            description: "Wind direction in degrees",
                          },
                          locationId: {
                            type: "string",
                            description: "HERE weather location identifier",
                          },
                          precipitationType: { type: "string", description: "Precipitation type" },
                          intensityOfPrecipitation: {
                            type: "number",
                            description: "Intensity of precipitation (measured in cm/h)",
                          },
                          visibility: {
                            type: "number",
                            description: "Visibility (measured in km)",
                          },
                        },
                      },
                    },
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
      },
    ],
    handler: get_safety_event,
    responseSchema: {
      type: "object",
      title: "Safety Event",
      additionalProperties: false,
      "x-model-category": "historical",
      properties: {
        id: {
          type: "string",
          title: "SafetyEventId",
          format: "ulid",
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
        extensions: {
          type: "object",
          description:
            "Includes data enriched via third-party vendors. See [Extensions](/terminal-platform/extensions)",
          properties: {
            here: {
              type: "object",
              title: "Here Safety Event Extension",
              properties: {
                speedLimit: {
                  type: "number",
                  title: "Speed In KPH",
                  description: "Speed in KPH rounded to 2 decimal places.",
                  example: 95.33,
                },
                speedLimitSource: {
                  type: "string",
                  title: "Speed Limit Source",
                  enum: ["posted", "derived"],
                  description: "Source for speed limit obtained from the HERE platform.",
                  example: "posted",
                },
                truckSpeedLimit: {
                  type: "number",
                  title: "Speed In KPH",
                  description: "Speed in KPH rounded to 2 decimal places.",
                  example: 95.33,
                },
                roadName: {
                  type: "string",
                  description: "Name of the road obtained from the HERE platform.",
                  example: "John St",
                },
                linkAttributes: {
                  type: "object",
                  description: "Additional road attributes from HERE platform",
                  properties: {
                    countryCode: {
                      type: "string",
                      description: "ISO country code of the road location",
                    },
                    vehicleTypes: { type: "string", description: "Types of vehicles allowed" },
                    isUrban: {
                      type: "string",
                      description: "Indicates if the road is in an urban area",
                    },
                    transportVerified: {
                      type: "string",
                      description: "Indicates if transport information is verified",
                    },
                    functionalClass: {
                      type: "string",
                      description:
                        "Road functional class according to HERE Maps:\n- 0: Unknown\n- 1: Functional Class 1 \n- 2: Functional Class 2 \n- 3: Functional Class 3 \n- 4: Functional Class 4 \n- 5: Functional Class 5",
                    },
                    controlledAccess: {
                      type: "string",
                      description: "Indicates if the road has controlled access",
                    },
                    limitedAccessRoad: {
                      type: "string",
                      description: "Indicates if it's a limited access road",
                    },
                    travelDirection: { type: "string", description: "Direction of travel" },
                    isBoatFerry: {
                      type: "string",
                      description: "Indicates if it's a boat ferry route",
                    },
                    isRailFerry: {
                      type: "string",
                      description: "Indicates if it's a rail ferry route",
                    },
                    isMultiDigitized: {
                      type: "string",
                      description: "Indicates if the road is multi-digitized",
                    },
                    isDivided: { type: "string", description: "Indicates if the road is divided" },
                    isDividerLegal: {
                      type: "string",
                      description: "Indicates if the divider is legal",
                    },
                    isFrontage: {
                      type: "string",
                      description: "Indicates if it's a frontage road",
                    },
                    isPaved: { type: "string", description: "Indicates if the road is paved" },
                    isRamp: { type: "string", description: "Indicates if it's a ramp" },
                    isPrivate: { type: "string", description: "Indicates if it's a private road" },
                    hasPoiAccess: {
                      type: "string",
                      description: "Indicates if there's POI access",
                    },
                    intersectionCategory: {
                      type: "string",
                      description:
                        "Type of intersection according to HERE Maps:\n- 0: Unknown\n- 1: Intersection Internal\n- 2: Manoeuvre\n- 3: Indescribable\n- 4: Roundabout\n- 5: Undefined Traffic Area\n- 6: Special Traffic Figure",
                    },
                    speedCategory: {
                      type: "string",
                      description:
                        "Speed category according to HERE Maps:\n- 0: Unknown\n- 1: Over 130 km/h (80 mph)\n- 2: 101-130 km/h (65-80 mph)\n- 3: 91-100 km/h (55-64 mph)\n- 4: 71-90 km/h (41-54 mph)\n- 5: 51-70 km/h (31-40 mph)\n- 6: 31-50 km/h (21-30 mph)\n- 7: 11-30 km/h (6-20 mph)\n- 8: Under 11 km/h (6 mph)",
                    },
                    laneCategory: {
                      type: "string",
                      description:
                        "Lane category according to HERE Maps:\n- 0: Unknown\n- 1: One lane\n- 2: Two or three lanes\n- 3: Four or more lanes",
                    },
                    coverageIndicator: { type: "string", description: "Coverage indicator" },
                    lowMobility: {
                      type: "string",
                      description:
                        "Low mobility indicator:\n- 0: Unknown (Default)\n- 1: Low mobility driving condition\n- 2: Not low mobility driving condition",
                    },
                    hasPublicAccess: {
                      type: "string",
                      description: "Indicates if there's public access",
                    },
                    routeTypes: { type: "string", description: "Types of routes" },
                  },
                },
                weather: {
                  type: "object",
                  description: "Weather conditions at the time of the event",
                  properties: {
                    latitude: {
                      type: "number",
                      description: "Latitude of weather measurement location",
                    },
                    longitude: {
                      type: "number",
                      description: "Longitude of weather measurement location",
                    },
                    temperature: { type: "number", description: "Air temperature in Celsius" },
                    dewPoint: { type: "number", description: "Dew point temperature in Celsius" },
                    humidity: { type: "number", description: "Relative humidity percentage" },
                    pressure: { type: "number", description: "Air pressure" },
                    windSpeed: {
                      type: "number",
                      description: "Wind velocity in meters per second",
                    },
                    windDirection: { type: "number", description: "Wind direction in degrees" },
                    locationId: { type: "string", description: "HERE weather location identifier" },
                    precipitationType: { type: "string", description: "Precipitation type" },
                    intensityOfPrecipitation: {
                      type: "number",
                      description: "Intensity of precipitation (measured in cm/h)",
                    },
                    visibility: { type: "number", description: "Visibility (measured in km)" },
                  },
                },
              },
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
          },
          required: ["videoUrl"],
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
          },
          required: ["videoUrl"],
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
      "x-description": "Video footage from vehicle cameras associated with safety events.",
    },
  },
];

export const tagName = "safety";
export const tagDescription = "Safety";
