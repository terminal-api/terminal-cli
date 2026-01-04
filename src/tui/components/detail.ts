import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createDetailPanel(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): { detailContainer: BoxRenderable; detailPanel: TextRenderable } {
  const detailContainer = new BoxRenderable(renderer, {
    id: "detail-container",
    width: "100%",
    height: theme.sizes.listHeight,
    borderStyle: "single",
    borderColor: theme.colors.border,
    padding: 1,
    visible: false,
    overflow: "scroll",
  });
  contentArea.add(detailContainer);

  const detailPanel = new TextRenderable(renderer, {
    id: "detail-panel",
    content: "",
    width: "100%",
    height: "100%",
    fg: theme.colors.textPrimary,
  });
  detailContainer.add(detailPanel);

  return { detailContainer, detailPanel };
}
