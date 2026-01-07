import { BoxRenderable, TextRenderable, type CliRenderer } from "@opentui/core";
import type { Theme } from "../theme.ts";

export interface ErrorPanelComponents {
  errorContainer: BoxRenderable;
  errorTitle: TextRenderable;
  errorStatus: TextRenderable;
  errorMessage: TextRenderable;
  errorDetail: TextRenderable;
}

export function createErrorPanel(
  renderer: CliRenderer,
  contentArea: BoxRenderable,
  theme: Theme,
): ErrorPanelComponents {
  const errorContainer = new BoxRenderable(renderer, {
    id: "error-container",
    width: "100%",
    flexDirection: "column",
    backgroundColor: theme.colors.errorBackground,
    borderColor: theme.colors.errorBorder,
    borderStyle: "single",
    padding: 1,
    visible: false,
  });
  contentArea.add(errorContainer);

  const errorTitle = new TextRenderable(renderer, {
    id: "error-title",
    content: "Error",
    width: "100%",
    height: 1,
    fg: theme.colors.errorText,
    marginBottom: 1,
  });
  errorContainer.add(errorTitle);

  const errorStatus = new TextRenderable(renderer, {
    id: "error-status",
    content: "",
    width: "100%",
    height: 1,
    fg: theme.colors.textMuted,
  });
  errorContainer.add(errorStatus);

  const errorMessage = new TextRenderable(renderer, {
    id: "error-message",
    content: "",
    width: "100%",
    height: 1,
    fg: theme.colors.textPrimary,
    marginTop: 1,
  });
  errorContainer.add(errorMessage);

  const errorDetail = new TextRenderable(renderer, {
    id: "error-detail",
    content: "",
    width: "100%",
    height: 10,
    fg: theme.colors.textMuted,
    marginTop: 1,
    visible: false,
  });
  errorContainer.add(errorDetail);

  return {
    errorContainer,
    errorTitle,
    errorStatus,
    errorMessage,
    errorDetail,
  };
}
