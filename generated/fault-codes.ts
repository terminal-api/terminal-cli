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
    handler: list_fault_code_events,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Fault Code Event",
            "x-model-category": "historical",
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
                type: "string",
                title: "VehicleId",
                description: "Unique identifier for the vehicle in Terminal.",
                format: "ulid",
                example: "vcl_01D8ZQFGHVJ858NBF2Q7DV9MNC",
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
                required: ["fmi", "spn"],
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
        },
      },
      required: ["results"],
    },
  },
];

export const tagName = "fault-codes";
export const tagDescription = "Fault Codes";
