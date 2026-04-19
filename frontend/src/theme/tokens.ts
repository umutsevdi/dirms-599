/**
 * Centralized Design Tokens
 * Aligned with the professional disaster management theme
 * - Professional gray palette with strategic color usage
 * - Flat corners (0px) for serious, clean appearance
 * - Muted colors appropriate for emergency operations
 */

// PROFESSIONAL COLOR PALETTE
// Based on the custom MUI theme for disaster management
export const colors = {
  // Primary neutrals - professional UI chrome
  primary: {
    main: "#475569", // slate-600
    light: "#64748b", // slate-500
    dark: "#334155", // slate-700
    contrast: "#ffffff",
  },
  // Secondary - deep charcoal
  secondary: {
    main: "#334155", // slate-700
    light: "#475569", // slate-600
    dark: "#1e293b", // slate-800
    contrast: "#ffffff",
  },
  // Background grays
  background: {
    default: "#f8fafc", // slate-50
    paper: "#ffffff",
    elevated: "#f1f5f9", // slate-100
  },
  // Text colors
  text: {
    primary: "#1e293b", // slate-800
    secondary: "#64748b", // slate-500
    disabled: "#94a3b8", // slate-400
  },
  // Semantic colors - strategic use for status indicators
  disaster: {
    main: "#e11d48", // rose-600 - fires, earthquakes, critical
    light: "#fda4af", // rose-300
    dark: "#be123c", // rose-700
  },
  resource: {
    main: "#0d9488", // teal-600 - resolved, resources, safe
    light: "#5eead4", // teal-300
    dark: "#0f766e", // teal-700
  },
  warning: {
    main: "#d97706", // amber-600 - caution, warning
    light: "#fcd34d", // amber-300
    dark: "#b45309", // amber-700
  },
  info: {
    main: "#64748b", // slate-500 - neutral information
    light: "#94a3b8", // slate-400
    dark: "#475569", // slate-600
  },
  // Age group colors - muted but distinguishable
  ageGroups: {
    baby: "#db2777", // pink-600
    child: "#4f46e5", // indigo-600
    adult: "#0d9488", // teal-600
    elderly: "#d97706", // amber-600
  },
  // Status colors
  status: {
    missing: "#e11d48", // rose-600
    injured: "#d97706", // amber-600
    disabled: "#4f46e5", // indigo-600
    bedridden: "#7c3aed", // violet-600
  },
  // Divider and borders
  divider: "#e2e8f0", // slate-200
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
    minHeightPercent: 20,
    maxHeightPercent: 70,
    defaultHeightPercent: 50,
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
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: {
    xs: "0.625rem", // 10px
    sm: "0.75rem", // 12px
    md: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontFamilyMono:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

// SHAPES - Flat corners for serious, professional appearance
export const shapes = {
  borderRadius: {
    none: 0,
    xs: 0,
    sm: 0,
    md: 0,
    lg: 0,
    full: 0, // Even "full" is 0 for consistency
  },
} as const;

// SHADOWS
export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  lg: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
  xl: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.06)",
} as const;

// LEAFLET MAP STYLES
export const leafletStyles = {
  // Marker icon base styles - flat squares for consistency
  markerBase: `
    border-radius: 0;
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
    disaster: `<div style="background-color:${colors.disaster.main};color:white;border-radius:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">!</div>`,
    resource: `<div style="background-color:${colors.resource.main};color:white;border-radius:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">R</div>`,
    people: (count: number) =>
      `<div style="background-color:${colors.resource.main};color:white;border-radius:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">${count}</div>`,
    peopleCluster: (totalCount: number) =>
      `<div style="background-color:${colors.resource.main};color:white;border-radius:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px">${totalCount}</div>`,
  },
} as const;

// MUI THEME EXTENSIONS
// These are merged with the MUI theme in theme.ts
export const themeExtensions = {
  palette: {
    disaster: {
      main: colors.disaster.main,
      light: colors.disaster.light,
      dark: colors.disaster.dark,
      contrastText: "#ffffff",
    },
    resource: {
      main: colors.resource.main,
      light: colors.resource.light,
      dark: colors.resource.dark,
      contrastText: "#ffffff",
    },
    ageGroups: {
      baby: colors.ageGroups.baby,
      child: colors.ageGroups.child,
      adult: colors.ageGroups.adult,
      elderly: colors.ageGroups.elderly,
    },
    status: {
      missing: colors.status.missing,
      injured: colors.status.injured,
      disabled: colors.status.disabled,
      bedridden: colors.status.bedridden,
    },
  },
} as const;

// ACTION OPACITIES (for hover, selected, disabled states)
export const actionOpacities = {
  hover: 0.04,
  selected: 0.08,
  disabled: 0.26,
  disabledBackground: 0.12,
  focus: 0.12,
  activated: 0.12,
} as const;
