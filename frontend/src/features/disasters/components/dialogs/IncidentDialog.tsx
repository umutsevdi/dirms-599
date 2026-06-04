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
import type { Disaster } from "../../types/disasters.types";
import type { Coordinates } from "../../../../shared/types/common.types";

interface IncidentDialogProps {
  action: "add" | "edit";
  disaster?: Disaster | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (incident: Disaster) => void;
  initialLocation?: Coordinates | null;
  initialAddress?: string;
}

const IncidentDialog = ({
  action,
  disaster,
  isOpen,
  onClose,
  onSave,
  initialLocation,
  initialAddress,
}: IncidentDialogProps) => {
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState<Disaster["severity"]>("düşük");
  const [status, setStatus] = useState<Disaster["status"]>("aktif");
  const [description, setDescription] = useState("");
  const [affectedRadius, setAffectedRadius] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (action === "edit" && disaster) {
        setType(disaster.type);
        setSeverity(disaster.severity);
        setStatus(disaster.status);
        setDescription(disaster.description);
        setAffectedRadius(
          disaster.affectedRadius ? disaster.affectedRadius.toString() : ""
        );
        setAddress(disaster.address);
      } else {
        setType("");
        setSeverity("düşük");
        setStatus("aktif");
        setDescription("");
        setAffectedRadius("");
        setAddress(initialAddress || "");
      }
    }
  }, [isOpen, action, disaster, initialAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    const location =
      action === "edit" && disaster ? disaster.location : initialLocation;

    if (!location) return;

    const incident: Disaster = {
      id: action === "edit" && disaster ? disaster.id : `d-${Date.now()}`,
      type,
      location,
      address: address || "Unknown location",
      severity,
      status,
      timestamp:
        action === "edit" && disaster
          ? disaster.timestamp
          : new Date().toISOString(),
      description,
      affectedRadius: affectedRadius ? parseInt(affectedRadius) : undefined,
    };
    onSave(incident);
    onClose();
  };

  const isEdit = action === "edit";
  const location = isEdit && disaster ? disaster.location : initialLocation;

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Hasar {isEdit ? "Düzenle" : "Bildir"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          {location && (
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Konum
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </Typography>
            </Box>
          )}

          <TextField
            label="Hasar Türü"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="örn. Hasarlı Hastane, Çökmüş Bina..."
            fullWidth
            required
          />

          <TextField
            label="Konum"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="örn. Şehir merkezi, Ana cadde"
            fullWidth
          />

          <FormControl fullWidth required>
            <InputLabel id="severity-label">Risk</InputLabel>
            <Select
              labelId="severity-label"
              label="Risk"
              value={severity}
              onChange={(e) =>
                setSeverity(e.target.value as Disaster["severity"])
              }
            >
              <MenuItem value="düşük">Düşük</MenuItem>
              <MenuItem value="orta">Orta</MenuItem>
              <MenuItem value="kritik">Kritik</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel id="status-label">Durum</InputLabel>
            <Select
              labelId="status-label"
              label="Durum"
              value={status}
              onChange={(e) => setStatus(e.target.value as Disaster["status"])}
            >
              <MenuItem value="aktif">Aktif</MenuItem>
              <MenuItem value="kontrol-altında">Kontrol Altında</MenuItem>
              <MenuItem value="çözüldü">Çözüldü</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Hasarı açıkla..."
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Etki Alanı"
            type="number"
            value={affectedRadius}
            onChange={(e) => setAffectedRadius(e.target.value)}
            placeholder="İsteğe bağlı - örn. 5000"
            slotProps={{ htmlInput: { min: 0 } }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal Et</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!type || !location}
          >
            Kaydet
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IncidentDialog;
