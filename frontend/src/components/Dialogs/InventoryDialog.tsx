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
  Chip,
  Typography,
  FormLabel,
  FormGroup,
} from "@mui/material";
import type { InventoryItem, InventoryGroup } from "../../types";
import { AVAILABLE_NEEDS, GROUP_OPTIONS } from "../../data";

interface InventoryDialogProps {
  action: "add" | "edit";
  item?: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const InventoryDialog = ({
  action,
  item,
  isOpen,
  onClose,
  onSave,
}: InventoryDialogProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [resolves, setResolves] = useState<string[]>([]);
  const [group, setGroup] = useState<InventoryGroup>("genel");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setResolves(item.resolves || []);
      setGroup(item.group || "genel");
    } else {
      setName("");
      setQuantity("1");
      setResolves([]);
      setGroup("genel");
    }
  }, [item]);

  const handleToggleNeed = (need: string) => {
    setResolves((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newItem: InventoryItem = {
      id: item?.id || `inv-${Date.now()}`,
      name,
      quantity: parseInt(quantity) || 1,
      resolves,
      group: group === "genel" ? undefined : group,
    };
    onSave(newItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Envanter {action === "add" ? "Ekle" : "Düzenle"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            label="Tür"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Su şişesi, İlk Yardım Kiti"
            required
            fullWidth
          />
          <TextField
            label="Miktar"
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
            <FormGroup row sx={{ gap: 1, flexWrap: "wrap" }}>
              {AVAILABLE_NEEDS.map((need) => (
                <Chip
                  key={need}
                  label={need}
                  onClick={() => handleToggleNeed(need)}
                  color={resolves.includes(need) ? "primary" : "default"}
                  variant={resolves.includes(need) ? "filled" : "outlined"}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </FormGroup>
          </Box>
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
