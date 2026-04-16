import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import type { Disaster } from "../../types";

interface DisasterDialogProps {
  disaster: Disaster | null;
  isOpen: boolean;
  onClose: () => void;
}

const DisasterDialog = ({ disaster, isOpen, onClose }: DisasterDialogProps) => {
  if (!disaster) return null;

  const getSeverityColor = (
    severity: string
  ): "error" | "warning" | "success" => {
    if (severity === "critical" || severity === "high") return "error";
    if (severity === "medium") return "warning";
    return "success";
  };

  const getStatusColor = (status: string): "error" | "warning" | "success" => {
    if (status === "active") return "error";
    if (status === "contained") return "warning";
    return "success";
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{disaster.type}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {disaster.description}
        </Typography>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Location
            </Typography>
            <Typography variant="body2">{disaster.address}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Coordinates
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
            >
              {disaster.location.lat.toFixed(4)},{" "}
              {disaster.location.lng.toFixed(4)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Severity
            </Typography>
            <Chip
              label={disaster.severity}
              size="small"
              color={getSeverityColor(disaster.severity)}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={disaster.status}
              size="small"
              color={getStatusColor(disaster.status)}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Reported
            </Typography>
            <Typography variant="body2">
              {new Date(disaster.timestamp).toLocaleString()}
            </Typography>
          </Box>
          {disaster.affectedRadius && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Affected Radius
              </Typography>
              <Typography variant="body2">
                {disaster.affectedRadius}m
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisasterDialog;
