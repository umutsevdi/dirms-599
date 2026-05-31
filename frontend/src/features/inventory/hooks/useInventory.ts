import { useState, useEffect, useCallback } from "react";
import type { InventoryItem } from "../types/inventory.types";
import * as inventoryService from "../services/inventoryService";

interface UseInventoryReturn {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveItem: (item: InventoryItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export function useInventory(): UseInventoryReturn {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.fetchInventory();
      setItems(data);
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveItem = useCallback(async (item: InventoryItem) => {
    try {
      setError(null);
      const saved = await inventoryService.saveInventoryItem(item);
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) => (i.id === item.id ? saved : i));
        }
        return [...prev, saved];
      });
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to save inventory item");
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);
      await inventoryService.deleteInventoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to delete inventory item");
      throw err;
    }
  }, []);

  return { items, loading, error, refresh, saveItem, deleteItem };
}
