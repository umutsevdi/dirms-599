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
  Chip,
  Typography,
  FormLabel,
  FormGroup,
  Autocomplete,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import type { InventoryItem, InventoryGroup, InventoryArchetypeDsl } from "../../types/inventory.types";
import { GROUP_OPTIONS } from "../../../../shared/constants/options";
import { listInventoryArchetypes, fetchInventoryArchetypeWithInheritance } from "../../services/inventoryService";
import { useNeedsArchetypes, getNeedName } from "../../../../features/needs/services/needsService";

interface InventoryDialogProps {
  action: "add" | "edit";
  item?: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

type ArchetypeOption = {
  id: string;
  name: string;
  category: string;
};

const InventoryDialog = ({
  action,
  item,
  isOpen,
  onClose,
  onSave,
}: InventoryDialogProps) => {
  const { needsArchetypes, loading: loadingNeeds } = useNeedsArchetypes();
  const [quantity, setQuantity] = useState("1");
  const [resolves, setResolves] = useState<string[]>([]);
  const [group, setGroup] = useState<InventoryGroup>("genel");
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeOption | null>(null);
  const [archetypeDsl, setArchetypeDsl] = useState<InventoryArchetypeDsl | null>(null);
  const [archetypeValues, setArchetypeValues] = useState<Record<string, unknown>>({});
  const [archetypes, setArchetypes] = useState<ArchetypeOption[]>([]);
  const [loadingArchetypes, setLoadingArchetypes] = useState(false);
  const [loadingDsl, setLoadingDsl] = useState(false);
  const [autoFillDone, setAutoFillDone] = useState(false);

  const loadArchetypes = useCallback(async () => {
    setLoadingArchetypes(true);
    try {
      const list = await listInventoryArchetypes();
      setArchetypes(list.map((a) => ({ id: a.id, name: a.name, category: a.category })));
    } catch (e) {
      console.error("Failed to load archetypes:", e);
      setArchetypes([]);
    } finally {
      setLoadingArchetypes(false);
    }
  }, []);

  const loadArchetypeDsl = useCallback(async (archetypeId: string, existingValues?: Record<string, unknown>) => {
    setLoadingDsl(true);
    try {
      const { dsl } = await fetchInventoryArchetypeWithInheritance(archetypeId);
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
    if (item) {
      setQuantity(item.quantity.toString());
      setResolves(item.resolves || []);
      setGroup(item.group || "genel");
      setAutoFillDone(true);
      if (item.archetypeId) {
        const opt = archetypes.find((a) => a.id === item.archetypeId);
        if (opt) {
          setSelectedArchetype(opt);
          loadArchetypeDsl(item.archetypeId, item.archetypeValues);
        }
      }
    } else {
      setQuantity("1");
      setResolves([]);
      setGroup("genel");
      setSelectedArchetype(null);
      setArchetypeDsl(null);
      setArchetypeValues({});
      setAutoFillDone(false);
    }
  }, [item, archetypes, loadArchetypeDsl]);

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
    if (archetypeDsl && selectedArchetype && !autoFillDone) {
      setResolves(archetypeDsl.resolvesNeeds);
      const demo = archetypeDsl.targetDemographics;
      if (demo && demo.length > 0) {
        const validGroup = demo.find((d) =>
          ["bebek", "çocuk", "yetişkin", "yaşlı", "kadın", "genel"].includes(d)
        );
        if (validGroup) setGroup(validGroup as InventoryGroup);
      }
      setAutoFillDone(true);
    }
  }, [archetypeDsl, selectedArchetype, autoFillDone]);

  const handleToggleNeed = (need: string) => {
    setResolves((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setArchetypeValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArchetype) return;

    const displayName = selectedArchetype.name;

    const newItem: InventoryItem = {
      id: item?.id || `inv-${Date.now()}`,
      archetypeId: selectedArchetype.id,
      name: displayName,
      quantity: parseInt(quantity) || 1,
      resolves,
      group: group === "genel" ? undefined : group,
      archetypeValues: Object.keys(archetypeValues).length > 0 ? archetypeValues : undefined,
    };
    console.log("Saving inventory item:", newItem);
    console.log("archetypeValues:", archetypeValues);
    onSave(newItem);
    onClose();
  };

  const renderField = (field: InventoryArchetypeDsl["fieldSchema"][number]) => {
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

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Envanter {action === "add" ? "Ekle" : "Düzenle"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
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
            label={`Miktar${archetypeDsl?.quantityUnit ? ` (${archetypeDsl.quantityUnit})` : ""}`}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
            required
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="group-label">Hedef Kitle</InputLabel>
            <Select
              labelId="group-label"
              label="Hedef Kitle"
              value={group}
              onChange={(e) => setGroup(e.target.value as InventoryGroup)}
            >
              {GROUP_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <FormLabel component="legend">İhtiyaçlar</FormLabel>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Bu ürünün giderebileceği ihtiyaçları seçiniz.
            </Typography>
            {loadingNeeds ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <FormGroup row sx={{ gap: 1, flexWrap: "wrap" }}>
                {needsArchetypes.map((need) => (
                  <Chip
                    key={need.id}
                    label={need.name}
                    onClick={() => handleToggleNeed(need.id)}
                    color={resolves.includes(need.id) ? "primary" : "default"}
                    variant={resolves.includes(need.id) ? "filled" : "outlined"}
                    sx={{ cursor: "pointer" }}
                  />
                ))}
              </FormGroup>
            )}
          </Box>

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
          <Button type="submit" variant="contained" color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InventoryDialog;
