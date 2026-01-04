import type { SelectOption } from "@opentui/core";
import { commandGroups, type Command } from "../../generated/index.ts";

export function getCommandOptions(): SelectOption[] {
  const options: SelectOption[] = [];
  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      options.push({
        name: cmd.name,
        description: `[${group.name}] ${cmd.description}`,
        value: cmd.name,
      });
    }
  }
  return options;
}

export function findCommandByName(name: string): Command | null {
  for (const group of commandGroups) {
    for (const cmd of group.commands) {
      if (cmd.name === name) {
        return cmd;
      }
    }
  }
  return null;
}
