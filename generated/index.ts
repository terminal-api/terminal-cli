// AUTO-GENERATED FILE - DO NOT EDIT
// Generated from OpenAPI spec

import * as authentication from "./authentication.ts";
import * as connections from "./connections.ts";
import * as dataManagement from "./data-management.ts";
import * as devices from "./devices.ts";
import * as drivers from "./drivers.ts";
import * as faultCodes from "./fault-codes.ts";
import * as groups from "./groups.ts";
import * as hoursOfService from "./hours-of-service.ts";
import * as ifta from "./ifta.ts";
import * as issues from "./issues.ts";
import * as providers from "./providers.ts";
import * as safety from "./safety.ts";
import * as trailers from "./trailers.ts";
import * as trips from "./trips.ts";
import * as vehicleUtilization from "./vehicle-utilization.ts";
import * as vehicles from "./vehicles.ts";

export type { Command, CommandArg } from "./authentication.ts";

export const allCommands = [
  ...authentication.commands,
  ...connections.commands,
  ...dataManagement.commands,
  ...devices.commands,
  ...drivers.commands,
  ...faultCodes.commands,
  ...groups.commands,
  ...hoursOfService.commands,
  ...ifta.commands,
  ...issues.commands,
  ...providers.commands,
  ...safety.commands,
  ...trailers.commands,
  ...trips.commands,
  ...vehicleUtilization.commands,
  ...vehicles.commands,
];

export const commandGroups = [
  {
    name: "authentication",
    description: authentication.tagDescription,
    commands: authentication.commands,
  },
  {
    name: "connections",
    description: connections.tagDescription,
    commands: connections.commands,
  },
  {
    name: "data-management",
    description: dataManagement.tagDescription,
    commands: dataManagement.commands,
  },
  {
    name: "devices",
    description: devices.tagDescription,
    commands: devices.commands,
  },
  {
    name: "drivers",
    description: drivers.tagDescription,
    commands: drivers.commands,
  },
  {
    name: "fault-codes",
    description: faultCodes.tagDescription,
    commands: faultCodes.commands,
  },
  {
    name: "groups",
    description: groups.tagDescription,
    commands: groups.commands,
  },
  {
    name: "hours-of-service",
    description: hoursOfService.tagDescription,
    commands: hoursOfService.commands,
  },
  {
    name: "ifta",
    description: ifta.tagDescription,
    commands: ifta.commands,
  },
  {
    name: "issues",
    description: issues.tagDescription,
    commands: issues.commands,
  },
  {
    name: "providers",
    description: providers.tagDescription,
    commands: providers.commands,
  },
  {
    name: "safety",
    description: safety.tagDescription,
    commands: safety.commands,
  },
  {
    name: "trailers",
    description: trailers.tagDescription,
    commands: trailers.commands,
  },
  {
    name: "trips",
    description: trips.tagDescription,
    commands: trips.commands,
  },
  {
    name: "vehicle-utilization",
    description: vehicleUtilization.tagDescription,
    commands: vehicleUtilization.commands,
  },
  {
    name: "vehicles",
    description: vehicles.tagDescription,
    commands: vehicles.commands,
  },
];

export function findCommand(name: string) {
  return allCommands.find((cmd) => cmd.name === name);
}

export function findCommandsByTag(tag: string) {
  const group = commandGroups.find((g) => g.name === tag);
  return group?.commands ?? [];
}
