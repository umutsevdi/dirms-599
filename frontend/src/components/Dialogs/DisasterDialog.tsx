import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import type { Disaster, InventoryItem } from "../../types";

interface DisasterDialogProps {
  disaster: Disaster | null;
  isOpen: boolean;
  onClose: () => void;
  inventoryItems?: InventoryItem[];
}

const DisasterDialog = ({
  disaster,
  isOpen,
  onClose,
  inventoryItems = [],
}: DisasterDialogProps) => {
  if (!disaster) return null;

  const getSeverityColor = (
    severity: string
  ): "error" | "warning" | "success" => {
    if (severity === "critical") return "error";
    if (severity === "moderate") return "warning";
    return "success";
  };

  const getStatusColor = (status: string): "error" | "warning" | "success" => {
    if (status === "active") return "error";
    if (status === "contained") return "warning";
    return "success";
  };

  // Show cargo warning if there are inventory items available
  const hasInventory = inventoryItems.length > 0;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{disaster.type}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {disaster.description}
        </Typography>

        {hasInventory && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 2 }}>
            Check available inventory items that could resolve needs for this
            incident
          </Alert>
        )}

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
        {disaster.status === "active" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              // In a real app, this would update the disaster status
              // For now, just show an alert
              alert(`Incident "${disaster.type}" marked as resolved!`);
              onClose();
            }}
          >
            Resolve
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DisasterDialog;
