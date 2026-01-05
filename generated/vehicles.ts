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
      },
      {
        name: "hidden",
        type: "boolean",
        required: false,
        description:
          "Show hidden records that don't match the configured filters. Defaults to false.",
      },
      {
        name: "deleted",
        type: "boolean",
        required: false,
        description:
          'Show "soft-deleted" records that have been deleted from the provider. Defaults to false.',
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
      },
      {
        name: "expand",
        type: "string",
        required: false,
        description: "Expand resources in the returned response",
        enum: ["groups"],
      },
    ],
    handler: get_vehicle,
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
      },
      {
        name: "vehicleIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of vehicle IDs to filter for. Can filter up to 50 vehicles at a time.",
      },
      {
        name: "driverIds",
        type: "string",
        required: false,
        description:
          "Comma separated list of driver IDs to filter for. Can filter up to 50 drivers at a time.",
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
      },
    ],
    handler: list_historical_vehicle_locations,
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
      },
    ],
    handler: list_historical_vehicle_stats,
  },
];

export const tagName = "vehicles";
export const tagDescription = "Vehicles";
