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

interface InventoryDialogProps {
  action: "add" | "edit";
  item?: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

const AVAILABLE_NEEDS = [
  "Water",
  "Food",
  "Medical",
  "Shelter",
  "Clothing",
  "Blankets",
  "Power",
];

const GROUP_OPTIONS: { value: InventoryGroup; label: string }[] = [
  { value: "general", label: "General" },
  { value: "baby", label: "Baby" },
  { value: "child", label: "Child" },
  { value: "adult", label: "Adult" },
  { value: "elderly", label: "Elderly" },
  { value: "women", label: "Women" },
];

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
  const [group, setGroup] = useState<InventoryGroup>("general");

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity.toString());
      setResolves(item.resolves || []);
      setGroup(item.group || "general");
    } else {
      setName("");
      setQuantity("1");
      setResolves([]);
      setGroup("general");
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
      group: group === "general" ? undefined : group,
    };
    onSave(newItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{action === "add" ? "Add" : "Edit"} Inventory</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Water Bottles, First Aid Kits"
            required
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
            required
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="group-label">Target Group (Optional)</InputLabel>
            <Select
              labelId="group-label"
              label="Target Group (Optional)"
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
            <FormLabel component="legend">Resolves Needs</FormLabel>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mb: 1 }}
            >
              Select which needs this inventory item can resolve
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {action === "edit" ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InventoryDialog;
