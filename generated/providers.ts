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
  },
];

export const tagName = "providers";
export const tagDescription = "Providers";
