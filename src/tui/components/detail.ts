import {
  ScrollBoxRenderable,
  TextRenderable,
  type BoxRenderable,
  type CliRenderer,
} from "@opentui/core";
import type { Theme } from "../theme.ts";

export function createDetailPanel(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): { detailContainer: ScrollBoxRenderable; detailPanel: TextRenderable } {
  const detailContainer = new ScrollBoxRenderable(renderer, {
    id: "detail-container",
    width: "100%",
    height: theme.sizes.listHeight,
    borderStyle: "single",
    borderColor: theme.colors.border,
    visible: false,
    scrollY: true,
    scrollX: false,
    viewportOptions: {
      padding: 1,
    },
  });
  contentArea.add(detailContainer);

  const detailPanel = new TextRenderable(renderer, {
    id: "detail-panel",
    content: "",
    width: "100%",
    fg: theme.colors.textPrimary,
  });
  detailContainer.add(detailPanel);

  return { detailContainer, detailPanel };
}
