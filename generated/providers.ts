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

export async function list_providers(
  client: TerminalClient,
  _args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get("/providers", undefined, false);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-providers",
    description: "List Providers",
    method: "GET",
    path: "/providers",
    requiresConnectionToken: false,
    args: [],
    handler: list_providers,
    responseSchema: {
      type: "array",
      items: {
        type: "object",
        title: "Provider",
        properties: {
          name: { type: "string", example: "Geotab" },
          status: {
            type: "string",
            title: "ProviderStatus",
            enum: ["live", "beta", "sandbox", "deprecated"],
            description: "The status of the provider.",
          },
          code: {
            type: "string",
            example: "geotab",
            description:
              "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
          },
          baseCode: {
            type: "string",
            example: "geotab",
            description:
              "The base provider code that this provider is built on. Only visible to authenticated users. Used to identify providers that share the same underlying technology platform.",
          },
          logo: {
            type: "string",
            format: "uri",
            example: "https://cdn.withterminal.com/providers/geotab/logo.png",
          },
          icon: {
            type: "string",
            format: "uri",
            example: "https://cdn.withterminal.com/providers/geotab/icon.png",
          },
          userGuides: {
            type: "object",
            description: "Links to user guides in different languages",
            properties: {
              en: { type: "string", format: "uri" },
              fr: { type: "string", format: "uri" },
              es: { type: "string", format: "uri" },
            },
            required: ["en", "fr", "es"],
          },
          references: {
            type: "array",
            description: "Additional reference links for the provider (e.g., login pages)",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["login-page", "developer-docs"],
                  description: "The type of reference",
                },
                url: { type: "string", description: "The URL of the reference" },
                label: { type: "string", description: "The display label for the reference" },
              },
              required: ["type", "url", "label"],
            },
          },
          supportedModels: {
            type: "object",
            title: "ProviderModelSupport",
            properties: {
              Group: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              Vehicle: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              Driver: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              LatestVehicleLocation: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              VehicleLocation: {
                allOf: [
                  {
                    type: "object",
                    title: "ModelSupportedOperations",
                    description:
                      "Common structure for model support status containing the supported operations.",
                    required: ["supportedOperations"],
                    properties: {
                      supportedOperations: {
                        type: "object",
                        required: ["read"],
                        properties: {
                          read: {
                            type: "string",
                            description:
                              "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                            enum: [
                              "supported",
                              "not_supported_by_terminal",
                              "not_supported_by_provider",
                            ],
                          },
                        },
                      },
                    },
                  },
                  {
                    type: "object",
                    required: ["sampleRate"],
                    properties: {
                      sampleRate: {
                        type: "string",
                        description: "How frequently is data captured by the vehicle",
                        example: "30 seconds",
                      },
                      availableHistory: {
                        type: "string",
                        example: "1 year",
                        description:
                          "How much history is available to backfill. No history is available if undefined.",
                      },
                    },
                  },
                ],
              },
              VehicleStatLog: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              Trailer: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              LatestTrailerLocation: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              Trip: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              Device: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              HOSLog: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              HOSDailyLog: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              HOSAvailableTime: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              IFTASummary: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              SafetyEvent: {
                allOf: [
                  {
                    type: "object",
                    title: "ModelSupportedOperations",
                    description:
                      "Common structure for model support status containing the supported operations.",
                    required: ["supportedOperations"],
                    properties: {
                      supportedOperations: {
                        type: "object",
                        required: ["read"],
                        properties: {
                          read: {
                            type: "string",
                            description:
                              "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                            enum: [
                              "supported",
                              "not_supported_by_terminal",
                              "not_supported_by_provider",
                            ],
                          },
                        },
                      },
                    },
                  },
                  {
                    type: "object",
                    required: ["types"],
                    properties: {
                      types: {
                        type: "array",
                        description:
                          "The types of safety events that are supported by this provider.",
                        example: [
                          "speeding",
                          "harsh_brake",
                          "harsh_acceleration",
                          "harsh_turn",
                          "crash",
                        ],
                        items: {
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
                      },
                    },
                  },
                ],
              },
              CameraMedia: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              FaultCodeEvent: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
              VehicleUtilization: {
                type: "object",
                title: "ModelSupportedOperations",
                description:
                  "Common structure for model support status containing the supported operations.",
                required: ["supportedOperations"],
                properties: {
                  supportedOperations: {
                    type: "object",
                    required: ["read"],
                    properties: {
                      read: {
                        type: "string",
                        description:
                          "Enum values:\n- `supported`: Terminal supports this resource\n- `not_supported_by_terminal`: Terminal does not support this resource\n- `not_supported_by_provider`: The provider does not support this resource",
                        enum: [
                          "supported",
                          "not_supported_by_terminal",
                          "not_supported_by_provider",
                        ],
                      },
                    },
                  },
                },
              },
            },
            required: [
              "Group",
              "Vehicle",
              "Driver",
              "VehicleLocation",
              "LatestVehicleLocation",
              "VehicleStatLog",
              "Trailer",
              "LatestTrailerLocation",
              "Trip",
              "Device",
              "HOSLog",
              "HOSDailyLog",
              "HOSAvailableTime",
              "IFTASummary",
              "SafetyEvent",
              "CameraMedia",
              "FaultCodeEvent",
              "VehicleUtilization",
            ],
          },
        },
        required: ["code", "name", "status", "logo", "icon", "supportedModels"],
      },
    },
  },
];

export const tagName = "providers";
export const tagDescription = "Providers";
