import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import type { Disaster, Coordinates } from "../../types";

interface IncidentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (incident: Disaster) => void;
  initialLocation?: Coordinates | null;
  initialAddress?: string;
}

const INCIDENT_TYPES = [
  "Earthquake",
  "Flood",
  "Wildfire",
  "Landslide",
  "Hurricane",
  "Tornado",
  "Tsunami",
  "Other",
];

const IncidentDialog = ({
  isOpen,
  onClose,
  onSave,
  initialLocation,
  initialAddress,
}: IncidentDialogProps) => {
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState<Disaster["severity"]>("low");
  const [status, setStatus] = useState<Disaster["status"]>("active");
  const [description, setDescription] = useState("");
  const [affectedRadius, setAffectedRadius] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isOpen) {
      setType("");
      setSeverity("low");
      setStatus("active");
      setDescription("");
      setAffectedRadius("");
      setAddress(initialAddress || "");
    }
  }, [isOpen, initialAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !initialLocation) return;

    const newIncident: Disaster = {
      id: `d-${Date.now()}`,
      type,
      location: initialLocation,
      address: address || "Unknown location",
      severity,
      status,
      timestamp: new Date().toISOString(),
      description,
      affectedRadius: affectedRadius ? parseInt(affectedRadius) : undefined,
    };
    onSave(newIncident);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Incident</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          {initialLocation && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {initialLocation.lat.toFixed(4)},{" "}
                {initialLocation.lng.toFixed(4)}
              </Typography>
            </Box>
          )}

          <FormControl fullWidth required>
            <InputLabel id="type-label">Incident Type</InputLabel>
            <Select
              labelId="type-label"
              label="Incident Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {INCIDENT_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Address / Location Description"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Downtown area, Main Street"
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel id="severity-label">Severity Level</InputLabel>
            <Select
              labelId="severity-label"
              label="Severity Level"
              value={severity}
              onChange={(e) =>
                setSeverity(e.target.value as Disaster["severity"])
              }
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Disaster["status"])}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="contained">Contained</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident..."
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Affected Radius (meters)"
            type="number"
            value={affectedRadius}
            onChange={(e) => setAffectedRadius(e.target.value)}
            placeholder="Optional - e.g. 5000"
            slotProps={{ htmlInput: { min: 0 } }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!type || !initialLocation}
          >
            Report Incident
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IncidentDialog;
