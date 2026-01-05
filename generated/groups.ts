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

export async function list_groups(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.get(
    "/groups",
    {
      limit: args["limit"] as string | number | boolean | undefined,
      cursor: args["cursor"] as string | number | boolean | undefined,
      expand: args["expand"] as string | number | boolean | undefined,
      raw: args["raw"] as string | number | boolean | undefined,
      modifiedAfter: args["modifiedAfter"] as string | number | boolean | undefined,
      modifiedBefore: args["modifiedBefore"] as string | number | boolean | undefined,
      deleted: args["deleted"] as string | number | boolean | undefined,
    },
    true,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "list-groups",
    description: "List Groups",
    method: "GET",
    path: "/groups",
    requiresConnectionToken: true,
    args: [
      {
        name: "limit",
        type: "number",
        required: false,
        description: "The maximum number of results to return in a page.",
      },
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
        enum: ["parent"],
      },
      {
        name: "raw",
        type: "boolean",
        required: false,
        description:
          "Include raw responses used to normalize model. Used for debugging or accessing unique properties that are not unified.",
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
        name: "deleted",
        type: "boolean",
        required: false,
        description:
          'Show "soft-deleted" records that have been deleted from the provider. Defaults to false.',
      },
    ],
    handler: list_groups,
    responseSchema: {
      type: "object",
      properties: {
        results: {
          type: "array",
          items: {
            type: "object",
            title: "Group",
            "x-model-category": "entity",
            properties: {
              id: {
                type: "string",
                title: "GroupId",
                format: "ulid",
                example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
              },
              name: { type: "string", example: "California Division" },
              sourceId: { type: "string", example: "12345" },
              provider: {
                type: "string",
                example: "geotab",
                description:
                  "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
              },
              description: { type: "string", example: "Resources part of the California division" },
              parent: {
                type: "string",
                title: "GroupId",
                format: "ulid",
                example: "group_01D8ZQFGHVJ858NBF2Q7DV9MNC",
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
            required: ["id", "sourceId", "provider", "metadata"],
            "x-description":
              "A group represents a collection of assets (vehicles, trailers, drivers) defined by the provider.",
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

export const tagName = "groups";
export const tagDescription = "Groups";
