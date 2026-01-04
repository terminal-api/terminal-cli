import { TextRenderable, type BoxRenderable, type CliRenderer } from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createSidebar(
  renderer: CliRenderer,
  sidebar: BoxRenderable,
  theme: Theme,
): TextRenderable {
  const connectionDisplay = new TextRenderable(renderer, {
    id: "connection-display",
    content: "",
    width: "100%",
    flexGrow: 1,
    fg: theme.colors.textPrimary,
  });
  sidebar.add(connectionDisplay);

  return connectionDisplay;
}
