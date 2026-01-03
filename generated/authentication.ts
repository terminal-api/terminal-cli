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
}

// Command handlers

export async function public_token_exchange(client: TerminalClient, args: Record<string, unknown>): Promise<unknown> {
  return await client.post("/public-token/exchange", {
      "publicToken": args["publicToken"]
    }, undefined, false);
}

// Command definitions
export const commands: Command[] = [
  {
    name: "public-token-exchange",
    description: "Public Token Exchange",
    method: "POST",
    path: "/public-token/exchange",
    requiresConnectionToken: false,
    args: [
    {
      name: "publicToken",
      type: "string",
      required: true,
      description: "Token returned by the authentication flow. Public tokens are one time use and expire after they are exchanged for a long-lived connection token."
    }
    ],
    handler: public_token_exchange
  }
];

export const tagName = "authentication";
export const tagDescription = "Authentication";
