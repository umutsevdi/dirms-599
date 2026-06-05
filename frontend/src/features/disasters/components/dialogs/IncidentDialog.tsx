import { useState, useEffect, useCallback } from "react";
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
  Autocomplete,
  Checkbox,
  CircularProgress,
  Chip,
} from "@mui/material";
import type { Disaster, IncidentArchetypeDsl } from "../../types/disasters.types";
import type { Coordinates } from "../../../../shared/types/common.types";
import {
  listIncidentArchetypes,
  fetchIncidentArchetypeWithInheritance,
} from "../../services/incidentService";

interface IncidentDialogProps {
  action: "add" | "edit";
  disaster?: Disaster | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (incident: Disaster) => void;
  initialLocation?: Coordinates | null;
  initialAddress?: string;
}

type ArchetypeOption = {
  id: string;
  name: string;
  category: string;
};

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
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeOption | null>(null);
  const [archetypeDsl, setArchetypeDsl] = useState<IncidentArchetypeDsl | null>(null);
  const [archetypeValues, setArchetypeValues] = useState<Record<string, unknown>>({});
  const [archetypes, setArchetypes] = useState<ArchetypeOption[]>([]);
  const [loadingArchetypes, setLoadingArchetypes] = useState(false);
  const [loadingDsl, setLoadingDsl] = useState(false);
  const [autoFillDone, setAutoFillDone] = useState(false);

  const loadArchetypes = useCallback(async () => {
    setLoadingArchetypes(true);
    try {
      const list = await listIncidentArchetypes();
      setArchetypes(list.map((a) => ({ id: a.id, name: a.name, category: a.category })));
    } catch {
      setArchetypes([]);
    } finally {
      setLoadingArchetypes(false);
    }
  }, []);

  const loadArchetypeDsl = useCallback(async (archetypeId: string, existingValues?: Record<string, unknown>) => {
    setLoadingDsl(true);
    try {
      const { dsl } = await fetchIncidentArchetypeWithInheritance(archetypeId);
      setArchetypeDsl(dsl);
      if (existingValues && Object.keys(existingValues).length > 0) {
        setArchetypeValues(existingValues);
      } else {
        const initialValues: Record<string, unknown> = {};
        for (const field of dsl.fieldSchema) {
          if (field.defaultValue !== undefined) {
            initialValues[field.field] = field.defaultValue;
          }
        }
        setArchetypeValues(initialValues);
      }
    } catch {
      setArchetypeDsl(null);
    } finally {
      setLoadingDsl(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadArchetypes();
    }
  }, [isOpen, loadArchetypes]);

  useEffect(() => {
    if (disaster) {
      setType(disaster.type);
      setSeverity(disaster.severity);
      setStatus(disaster.status);
      setDescription(disaster.description);
      setAffectedRadius(disaster.affectedRadius ? disaster.affectedRadius.toString() : "");
      setAddress(disaster.address);
      setArchetypeValues(disaster.archetypeValues || {});
      setAutoFillDone(true);
      if (disaster.archetypeId) {
        const opt = archetypes.find((a) => a.id === disaster.archetypeId);
        if (opt) {
          setSelectedArchetype(opt);
          loadArchetypeDsl(disaster.archetypeId, disaster.archetypeValues);
        }
      }
    } else {
      setType("");
      setSeverity("düşük");
      setStatus("aktif");
      setDescription("");
      setAffectedRadius("");
      setAddress(initialAddress || "");
      setSelectedArchetype(null);
      setArchetypeDsl(null);
      setArchetypeValues({});
      setAutoFillDone(false);
    }
  }, [disaster, archetypes, loadArchetypeDsl, initialAddress]);

  const handleArchetypeChange = useCallback((_: unknown, value: ArchetypeOption | null) => {
    setSelectedArchetype(value);
    if (value) {
      loadArchetypeDsl(value.id);
    } else {
      setArchetypeDsl(null);
      setArchetypeValues({});
      setAutoFillDone(false);
    }
  }, [loadArchetypeDsl]);

  useEffect(() => {
    if (archetypeDsl && selectedArchetype && !autoFillDone && !disaster) {
      setDescription(archetypeDsl.description || "");
      setAutoFillDone(true);
    }
  }, [archetypeDsl, selectedArchetype, autoFillDone, disaster]);

  const handleFieldChange = (field: string, value: unknown) => {
    setArchetypeValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArchetype) return;

    const displayName = type.trim() || selectedArchetype.name;
    const location = action === "edit" && disaster ? disaster.location : initialLocation;
    if (!location) return;

    const incident: Disaster = {
      id: action === "edit" && disaster ? disaster.id : `d-${Date.now()}`,
      archetypeId: selectedArchetype.id,
      type: displayName,
      location,
      address: address || "Unknown location",
      severity,
      status,
      timestamp: action === "edit" && disaster ? disaster.timestamp : new Date().toISOString(),
      description,
      affectedRadius: affectedRadius ? parseInt(affectedRadius) : undefined,
      archetypeValues: Object.keys(archetypeValues).length > 0 ? archetypeValues : undefined,
    };
    onSave(incident);
    onClose();
  };

  const renderField = (field: IncidentArchetypeDsl["fieldSchema"][number]) => {
    const value = archetypeValues[field.field] ?? "";
    switch (field.type) {
      case "number":
        return (
          <TextField
            key={field.field}
            label={field.label}
            type="number"
            value={value as string | number}
            onChange={(e) => handleFieldChange(field.field, parseFloat(e.target.value) || 0)}
            required={field.required}
            fullWidth
            slotProps={{ htmlInput: { step: "any" } }}
          />
        );
      case "select":
        return (
          <FormControl key={field.field} fullWidth>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value as string}
              label={field.label}
              onChange={(e) => handleFieldChange(field.field, e.target.value)}
              required={field.required}
            >
              {(field.options || []).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case "boolean":
        return (
          <Box key={field.field} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Checkbox
              checked={!!value}
              onChange={(e) => handleFieldChange(field.field, e.target.checked)}
            />
            <Typography variant="body2">{field.label}</Typography>
          </Box>
        );
      default:
        return (
          <TextField
            key={field.field}
            label={field.label}
            value={value as string}
            onChange={(e) => handleFieldChange(field.field, e.target.value)}
            required={field.required}
            fullWidth
          />
        );
    }
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

          <Autocomplete
            options={archetypes}
            loading={loadingArchetypes}
            value={selectedArchetype}
            onChange={handleArchetypeChange}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Arketip"
                placeholder="Arketip seçiniz"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingArchetypes ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps?.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {selectedArchetype && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={selectedArchetype.category}
                size="small"
                color="info"
                sx={{ textTransform: "capitalize" }}
              />
              {archetypeDsl?.description && (
                <Typography variant="body2" color="text.secondary">
                  {archetypeDsl.description}
                </Typography>
              )}
            </Box>
          )}

          <TextField
            label="Başlık (İsteğe Bağlı)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Boş bırakılırsa arketip adı kullanılır"
            fullWidth
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
              onChange={(e) => setSeverity(e.target.value as Disaster["severity"])}
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
            label="Etki Alanı (metre)"
            type="number"
            value={affectedRadius}
            onChange={(e) => setAffectedRadius(e.target.value)}
            placeholder="İsteğe bağlı - örn. 5000"
            slotProps={{ htmlInput: { min: 0 } }}
            fullWidth
          />

          {loadingDsl && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {!loadingDsl &&
            archetypeDsl?.fieldSchema.map((field) => renderField(field))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal Et</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!selectedArchetype || !location}
          >
            Kaydet
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IncidentDialog;
