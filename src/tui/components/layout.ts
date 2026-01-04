import { BoxRenderable, type CliRenderer } from "@opentui/core";
import type { Theme } from "../theme.ts";

export interface LayoutComponents {
  rootLayout: BoxRenderable;
  mainContainer: BoxRenderable;
  contentArea: BoxRenderable;
  sidebar: BoxRenderable;
}

export function createLayout(renderer: CliRenderer, theme: Theme): LayoutComponents {
  const rootLayout = new BoxRenderable(renderer, {
    id: "root-layout",
    width: "100%",
    height: "100%",
    flexDirection: "column",
  });
  renderer.root.add(rootLayout);

  const mainContainer = new BoxRenderable(renderer, {
    id: "main-container",
    width: "100%",
    flexGrow: 1,
    flexDirection: "row",
  });
  rootLayout.add(mainContainer);

  const contentArea = new BoxRenderable(renderer, {
    id: "content-area",
    flexGrow: 1,
    height: "100%",
    flexDirection: "column",
    padding: 1,
  });
  mainContainer.add(contentArea);

  const sidebar = new BoxRenderable(renderer, {
    id: "sidebar",
    width: theme.sizes.sidebarWidth,
    height: "100%",
    backgroundColor: theme.colors.sidebarBackground,
    padding: 1,
    flexDirection: "column",
  });
  mainContainer.add(sidebar);

  return { rootLayout, mainContainer, contentArea, sidebar };
}
