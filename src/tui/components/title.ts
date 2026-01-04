import { TextRenderable, type BoxRenderable, type CliRenderer } from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createTitle(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): TextRenderable {
  const titleDisplay = new TextRenderable(renderer, {
    id: "title",
    content: "Select Command",
    width: "100%",
    height: 1,
    marginBottom: 1,
    fg: theme.colors.accent,
  });
  contentArea.add(titleDisplay);

  return titleDisplay;
}
