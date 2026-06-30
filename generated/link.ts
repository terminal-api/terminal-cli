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

export async function create_short_link(
  client: TerminalClient,
  args: Record<string, unknown>,
): Promise<unknown> {
  return await client.post(
    "/link/short",
    {
      name: args["name"],
      provider: args["provider"],
      providerHints: args["providerHints"],
      externalId: args["externalId"],
      tags: args["tags"],
      redirectUrl: args["redirectUrl"],
      syncMode: args["syncMode"],
      backfill: args["backfill"],
      template: args["template"],
    },
    undefined,
    false,
  );
}

// Command definitions
export const commands: Command[] = [
  {
    name: "create-short-link",
    description: "Create Short Link URL",
    method: "POST",
    path: "/link/short",
    requiresConnectionToken: false,
    args: [
      {
        name: "name",
        type: "string",
        required: false,
        description: "An optional human-readable name to associate with the resulting connection.",
      },
      {
        name: "provider",
        type: "string",
        required: false,
        description:
          "Every provider has a unique code to identify it across Terminal's system. You can find each provider's code under [provider details](/providers).",
      },
      {
        name: "providerHints",
        type: "array",
        required: false,
        description:
          "An optional list of provider codes to hoist to the top of the Link provider list.",
      },
      {
        name: "externalId",
        type: "string",
        required: false,
        description: "An optional ID from your system that can be used to reference connections.",
      },
      {
        name: "tags",
        type: "array",
        required: false,
        description:
          "An optional list of tags from your system that can be used to reference connections.",
      },
      {
        name: "redirectUrl",
        type: "string",
        required: false,
        description: "URL to redirect your user to after they complete the Link flow.",
      },
      {
        name: "syncMode",
        type: "string",
        required: false,
        description:
          "Enum values: - `automatic`: Terminal will keep this connections data up to date - `manual`: Terminal will only sync data upon request",
        enum: ["automatic", "manual"],
      },
      {
        name: "backfill",
        type: "object",
        required: false,
        description:
          "Optional backfill to be requested upon successful connection. Will start from NOW if not provided.",
      },
      {
        name: "template",
        type: "string",
        required: false,
        description: "Unique identifier for the Link Template.",
      },
    ],
    handler: create_short_link,
    responseSchema: {
      type: "object",
      title: "ShortLink",
      description:
        "A short URL for the Link onboarding flow. The associated parameters are stored at creation time and retrieved when your user visits the URL.",
      properties: {
        id: {
          type: "string",
          format: "ulid",
          pattern: "^slk_[0-9A-HJKMNP-TV-Z]{26}$",
          example: "slk_01JB7K3N2QZP7TVR4FX8SDWFH9",
          description: "Durable identifier for the short link resource.",
        },
        code: {
          type: "string",
          pattern: "^[a-hjkmnp-z2-9]{8}$",
          example: "az9qtk2d",
          description: "8-character code that is associated with the original Link parameters.",
        },
        url: {
          type: "string",
          format: "uri",
          example: "https://term.new/az9qtk2d",
          description: "Full short URL to share with your user.",
        },
        expiresAt: {
          type: "string",
          title: "ISODateTime",
          format: "date-time",
          example: "2021-01-06T03:24:53.000Z",
          description: "[ISO 8601](https://www.w3.org/TR/NOTE-datetime) date",
        },
      },
      required: ["id", "code", "url", "expiresAt"],
    },
  },
];

export const tagName = "link";
export const tagDescription = "Link";
