import { TextRenderable, type BoxRenderable, type CliRenderer } from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createStatusBar(
  renderer: CliRenderer,
  rootLayout: BoxRenderable,
  theme: Theme,
): TextRenderable {
  const statusBar = new TextRenderable(renderer, {
    id: "status-bar",
    content: "",
    width: "100%",
    height: 1,
    fg: theme.colors.textMuted,
  });
  rootLayout.add(statusBar);

  return statusBar;
}
