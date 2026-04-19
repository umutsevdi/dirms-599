/**
 * Centralized Design Tokens
 * All hardcoded values should reference these tokens
 */

// COLORS
export const colors = {
  // Semantic colors
  disaster: {
    main: "#ef4444", // Red for disasters
    light: "#fca5a5",
    dark: "#dc2626",
  },
  resource: {
    main: "#22c55e", // Green for resources/people
    light: "#86efac",
    dark: "#16a34a",
  },
  warning: {
    main: "#f97316", // Orange for moderate severity
    light: "#fdba74",
    dark: "#ea580c",
  },
  info: {
    main: "#3b82f6", // Blue for info
    light: "#93c5fd",
    dark: "#2563eb",
  },
  // Age group colors
  ageGroups: {
    baby: "#ec4899", // Pink
    child: "#3b82f6", // Blue
    adult: "#22c55e", // Green
    elderly: "#f59e0b", // Amber/Orange
  },
  // Status colors
  status: {
    missing: "#ef4444",
    injured: "#f97316",
    disabled: "#3b82f6",
    bedridden: "#8b5cf6",
  },
} as const;

// LAYOUT
export const layout = {
  // Panel dimensions
  panel: {
    minWidth: 200,
    maxWidth: 600,
    defaultWidth: 320,
    infoBoardWidth: 320,
    infoBoardWidthCluster: 380,
  },
  // Spacing scale (in px, matching MUI spacing)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  // Z-index scale
  zIndex: {
    base: 1,
    dropdown: 100,
    mapOverlay: 1000,
    modal: 1300,
    devTools: 1000,
  },
} as const;

// SIZING
export const sizing = {
  // Avatar sizes
  avatar: {
    sm: 32,
    md: 48,
    lg: 80,
  },
  // Icon sizes
  icon: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
  },
  // Chip heights
  chip: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
  },
  // Map marker sizes
  marker: {
    width: 32,
    height: 32,
    fontSize: 14,
  },
} as const;

// TYPOGRAPHY
export const typography = {
  fontSize: {
    xs: "0.625rem", // 10px
    sm: "0.75rem", // 12px
    md: "0.875rem", // 14px
    base: "1rem", // 16px
  },
  fontFamily: {
    mono: "monospace",
  },
} as const;

// SHAPES
export const shapes = {
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
} as const;

// LEAFLET MAP STYLES
export const leafletStyles = {
  // Marker icon base styles
  markerBase: `
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
  `,
  // Pre-built marker HTML strings
  markers: {
    disaster: `<div style="background-color:${colors.disaster.main};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">!</div>`,
    resource: `<div style="background-color:${colors.resource.main};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">R</div>`,
    people: (count: number) =>
      `<div style="background-color:${colors.resource.main};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">${count}</div>`,
    peopleCluster: (totalCount: number) =>
      `<div style="background-color:${colors.resource.main};color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">${totalCount}</div>`,
  },
} as const;

// MUI THEME EXTENSIONS
// These should be merged with the MUI theme
export const themeExtensions = {
  palette: {
    disaster: {
      main: colors.disaster.main,
      light: colors.disaster.light,
      dark: colors.disaster.dark,
      contrastText: "#fff",
    },
    resource: {
      main: colors.resource.main,
      light: colors.resource.light,
      dark: colors.resource.dark,
      contrastText: "#fff",
    },
    ageGroups: {
      baby: colors.ageGroups.baby,
      child: colors.ageGroups.child,
      adult: colors.ageGroups.adult,
      elderly: colors.ageGroups.elderly,
    },
  },
} as const;
