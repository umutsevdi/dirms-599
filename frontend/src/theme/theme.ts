import { createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";

/**
 * Professional Disaster Management Theme
 * Designed for serious emergency response operations
 * - Flat corners (borderRadius: 0) for clean, serious appearance
 * - Inter font for professional, highly readable typography
 * - Muted gray palette with strategic color for status indicators
 */

// Professional Color Palette for Disaster Management
const palette = {
  // Primary: Slate - neutral professional UI
  primary: {
    main: "#475569", // slate-600
    light: "#64748b", // slate-500
    dark: "#334155", // slate-700
    contrastText: "#ffffff",
  },
  // Secondary: Deep charcoal for emphasis
  secondary: {
    main: "#334155", // slate-700
    light: "#475569", // slate-600
    dark: "#1e293b", // slate-800
    contrastText: "#ffffff",
  },
  // Background: Cool grays - easy on the eyes during long operations
  background: {
    default: "#f8fafc", // slate-50
    paper: "#ffffff",
  },
  // Text: Dark slate for readability
  text: {
    primary: "#1e293b", // slate-800
    secondary: "#64748b", // slate-500
    disabled: "#94a3b8", // slate-400
  },
  // Status Colors - Strategic use only for important indicators
  error: {
    main: "#e11d48", // rose-600 - disaster/emergency
    light: "#fda4af", // rose-300
    dark: "#be123c", // rose-700
    contrastText: "#ffffff",
  },
  warning: {
    main: "#d97706", // amber-600 - caution/warning
    light: "#fcd34d", // amber-300
    dark: "#b45309", // amber-700
    contrastText: "#ffffff",
  },
  success: {
    main: "#0d9488", // teal-600 - resolved/safe
    light: "#5eead4", // teal-300
    dark: "#0f766e", // teal-700
    contrastText: "#ffffff",
  },
  info: {
    main: "#64748b", // slate-500 - neutral information
    light: "#94a3b8", // slate-400
    dark: "#475569", // slate-600
    contrastText: "#ffffff",
  },
  // Divider: Subtle separation
  divider: "#e2e8f0", // slate-200
  // Action states
  action: {
    active: "#475569", // slate-600
    hover: "rgba(71, 85, 105, 0.04)", // slate-600 at 4%
    selected: "rgba(71, 85, 105, 0.08)", // slate-600 at 8%
    disabled: "rgba(148, 163, 184, 0.26)", // slate-400 at 26%
    disabledBackground: "rgba(148, 163, 184, 0.12)", // slate-400 at 12%
    focus: "rgba(71, 85, 105, 0.12)", // slate-600 at 12%
  },
};

// Custom palette extensions for disaster management
const customPalette = {
  // Semantic colors for the domain
  disaster: {
    main: "#e11d48", // rose-600 - fires, earthquakes, critical
    light: "#fda4af", // rose-300
    dark: "#be123c", // rose-700
    contrastText: "#ffffff",
  },
  resource: {
    main: "#0d9488", // teal-600 - people, supplies, resolved
    light: "#5eead4", // teal-300
    dark: "#0f766e", // teal-700
    contrastText: "#ffffff",
  },
  // Age groups - muted but distinguishable
  ageGroups: {
    baby: "#db2777", // pink-600
    child: "#4f46e5", // indigo-600
    adult: "#0d9488", // teal-600
    elderly: "#d97706", // amber-600
  },
  // Status indicators
  status: {
    missing: "#e11d48", // rose-600
    injured: "#d97706", // amber-600
    disabled: "#4f46e5", // indigo-600
    bedridden: "#7c3aed", // violet-600
  },
};

// Flat corners (0px border radius) for serious, clean appearance
const shape = {
  borderRadius: 0,
};

// Typography with Inter font
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 700,
    letterSpacing: "-0.025em",
  },
  h2: {
    fontWeight: 700,
    letterSpacing: "-0.025em",
  },
  h3: {
    fontWeight: 600,
    letterSpacing: "-0.015em",
  },
  h4: {
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  h5: {
    fontWeight: 600,
  },
  h6: {
    fontWeight: 600,
  },
  subtitle1: {
    fontWeight: 500,
  },
  subtitle2: {
    fontWeight: 500,
  },
  body1: {
    fontWeight: 400,
    letterSpacing: "0em",
  },
  body2: {
    fontWeight: 400,
    letterSpacing: "0em",
  },
  button: {
    fontWeight: 500,
    textTransform: "none" as const, // No uppercase - more professional
    letterSpacing: "0em",
  },
  caption: {
    fontWeight: 400,
  },
  overline: {
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
};

// Component overrides for flat corners and professional styling
const components: ThemeOptions["components"] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        textTransform: "none",
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true, // Cleaner, more professional without ripple
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: "16px",
        "&:last-child": {
          paddingBottom: "16px",
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 0,
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        "&:first-of-type": {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        "&:last-of-type": {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 0,
      },
    },
  },
  MuiSnackbarContent: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: "#e2e8f0", // slate-200
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: "1px solid #e2e8f0", // slate-200
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:last-child td": {
          borderBottom: "none",
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: "none",
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: "48px",
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: {
        borderRadius: 0,
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 0,
        textTransform: "none",
      },
    },
  },
};

// Create the custom theme
export const theme = createTheme({
  palette: palette as ThemeOptions["palette"],
  typography,
  shape,
  components,
});

// Module augmentation to add custom palette properties
// This needs to be in the same file or imported before theme usage
declare module "@mui/material/styles" {
  interface Palette {
    disaster: Palette["primary"];
    resource: Palette["primary"];
    ageGroups: {
      baby: string;
      child: string;
      adult: string;
      elderly: string;
    };
    status: {
      missing: string;
      injured: string;
      disabled: string;
      bedridden: string;
    };
  }

  interface PaletteOptions {
    disaster?: PaletteOptions["primary"];
    resource?: PaletteOptions["primary"];
    ageGroups?: {
      baby?: string;
      child?: string;
      adult?: string;
      elderly?: string;
    };
    status?: {
      missing?: string;
      injured?: string;
      disabled?: string;
      bedridden?: string;
    };
  }
}

// Extend the theme for components that use custom palette
// This allows using theme.palette.disaster in styled components
declare module "@mui/material" {
  interface ButtonPropsColorOverrides {
    disaster: true;
    resource: true;
  }
  interface ChipPropsColorOverrides {
    disaster: true;
    resource: true;
  }
}

// Apply custom palette extensions to the theme
(theme as typeof theme & { palette: typeof customPalette }).palette = {
  ...theme.palette,
  ...customPalette,
};

export default theme;
