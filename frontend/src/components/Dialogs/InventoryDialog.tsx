import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import type { InventoryItem } from "../../types";

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
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState<InventoryItem["status"]>("available");

  useEffect(() => {
    if (item) {
      setType(item.type);
      setQuantity(item.quantity.toString());
      setStatus(item.status);
    } else {
      setType("");
      setQuantity("1");
      setStatus("available");
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) return;

    const newItem: InventoryItem = {
      id: item?.id || `inv-${Date.now()}`,
      type,
      location: item?.location || { lat: 0, lng: 0 },
      status,
      quantity: parseInt(quantity) || 1,
      assignedDisaster: item?.assignedDisaster,
    };
    onSave(newItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{action === "add" ? "Add" : "Edit"} Inventory</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          <TextField
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g. Water, Food, Medical"
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
          <TextField
            label="Status"
            select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as InventoryItem["status"])
            }
            fullWidth
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="deployed">Deployed</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
          </TextField>
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
