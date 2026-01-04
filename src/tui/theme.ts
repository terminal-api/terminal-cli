export const theme = {
  colors: {
    background: "#0d1117",
    sidebarBackground: "#161b22",
    panelBackground: "#0d1117",
    panelFocusedBackground: "#161b22",
    inputBackground: "#21262d",
    inputFocusedBackground: "#30363d",
    textPrimary: "#c9d1d9",
    textMuted: "#8b949e",
    textBright: "#ffffff",
    accent: "#58a6ff",
    selectionBlue: "#1f6feb",
    selectionGreen: "#238636",
    border: "#30363d",
  },
  sizes: {
    sidebarWidth: 32,
    listHeight: "80%",
    enumListHeight: 10,
  },
} as const;

export type Theme = typeof theme;
