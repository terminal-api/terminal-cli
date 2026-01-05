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

export function filterCommandOptions(filterText: string): SelectOption[] {
  const allOptions = getCommandOptions();
  if (!filterText) {
    return allOptions;
  }

  const searchTerm = filterText.toLowerCase();
  return allOptions.filter((opt) => {
    const name = opt.name.toLowerCase();
    const desc = (opt.description ?? "").toLowerCase();
    return name.includes(searchTerm) || desc.includes(searchTerm);
  });
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
