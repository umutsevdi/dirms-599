import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { sizing, layout, colors, shapes, typography } from "./tokens";

// LAYOUT COMPONENTS

/**
 * Flex container with common flex properties
 */
export const FlexBox = styled(Box)({
  display: "flex",
});

/**
 * Flex column container
 */
export const FlexColumn = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

/**
 * Centered flex container
 */
export const CenteredBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// PANEL COMPONENTS

/**
 * Resizable side panel container
 */
export const SidePanelContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width: number }>(({ width }) => ({
  position: "relative",
  flexShrink: 0,
  width,
  borderRight: 1,
  borderColor: "divider",
}));

/**
 * Resizable handle for panels
 */
export const ResizeHandle = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  width: 4,
  height: "100%",
  cursor: "col-resize",
  backgroundColor: theme.palette.action.hover,
  zIndex: 10,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

/**
 * Map container with proper sizing
 */
export const MapContainerBox = styled(Box)({
  flex: 1,
  position: "relative",
  minHeight: 0,
  borderRadius: shapes.borderRadius.md,
  overflow: "hidden",
});

// INFO BOARD COMPONENTS

/**
 * Floating info board card (used in MapInfoBoard)
 */
export const FloatingInfoCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "width",
})<{ width: number }>(({ theme, width }) => ({
  position: "absolute",
  top: layout.spacing.md,
  right: layout.spacing.md,
  zIndex: layout.zIndex.mapOverlay,
  width,
  maxHeight: "calc(100% - 32px)",
  overflow: "auto",
  boxShadow: theme.shadows[3],
}));

// CHIP STYLE VARIANTS

/**
 * Get chip styles for age groups
 */
export const getAgeGroupChipStyles = (
  type: "baby" | "child" | "adult" | "elderly"
) => {
  const colorMap = {
    baby: { bg: "pink.50", color: "pink.700", icon: colors.ageGroups.baby },
    child: { bg: "info.50", color: "info.700", icon: colors.ageGroups.child },
    adult: {
      bg: "success.50",
      color: "success.700",
      icon: colors.ageGroups.adult,
    },
    elderly: {
      bg: "warning.50",
      color: "warning.700",
      icon: colors.ageGroups.elderly,
    },
  };
  return {
    height: sizing.chip.sm,
    minWidth: 28,
    bgcolor: colorMap[type].bg,
    color: colorMap[type].color,
    [`& .MuiChip-icon`]: {
      color: colorMap[type].icon,
    },
  };
};

// TYPOGRAPHY UTILITIES

/**
 * Common caption text styles
 */
export const captionStyles = {
  fontSize: typography.fontSize.sm,
};

/**
 * Monospace text styles
 */
export const monospaceStyles = {
  fontFamily: typography.fontFamilyMono,
};

// SX PROP HELPERS

/**
 * Common flex row sx prop
 */
export const flexRowSx = {
  display: "flex",
  alignItems: "center",
};

/**
 * Common flex row with gap sx prop
 */
export const flexRowGapSx = (gap: number = 1) => ({
  display: "flex",
  alignItems: "center",
  gap,
});

/**
 * Common flex space between sx prop
 */
export const flexSpaceBetweenSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
