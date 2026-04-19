import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Slider,
  Button,
  Box,
} from "@mui/material";
import type { Coordinates } from "../../types";

interface RadiusToolProps {
  onRadiusDraw: (center: Coordinates, radius: number) => void;
}

const RadiusTool = ({ onRadiusDraw }: RadiusToolProps) => {
  const [radius, setRadius] = useState(1000);
  const [mode, setMode] = useState(0);

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Radius Tool
        </Typography>
        <Tabs
          value={mode}
          onChange={(_, v) => setMode(v)}
          variant="fullWidth"
          sx={{ mb: 2 }}
        >
          <Tab label="Click on Map" />
          <Tab label="Manual" />
        </Tabs>
        <Typography variant="caption" color="text.secondary">
          Radius (meters)
        </Typography>
        <Slider
          value={radius}
          min={100}
          max={10000}
          step={100}
          onChange={(_, v) => setRadius(v as number)}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v}m`}
          sx={{ mt: 1 }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          <span>100m</span>
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
            {radius}m
          </Typography>
          <span>10km</span>
        </Box>
        <Button
          variant="contained"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => onRadiusDraw({ lat: 39.9334, lng: 32.8597, address: "" }, radius)}
        >
          Draw Radius
        </Button>
      </CardContent>
    </Card>
  );
};

export default RadiusTool;
