import { useState, useEffect, useCallback } from "react";
import type { Disaster } from "../types/disasters.types";
import * as incidentService from "../services/incidentService";

interface UseIncidentsReturn {
  items: Disaster[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveItem: (item: Disaster) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export function useIncidents(): UseIncidentsReturn {
  const [items, setItems] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidentService.fetchIncidents();
      setItems(data);
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to load incidents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveItem = useCallback(async (item: Disaster) => {
    try {
      setError(null);
      const saved = await incidentService.saveIncident(item);
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) => (i.id === item.id ? saved : i));
        }
        return [...prev, saved];
      });
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to save incident");
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);
      await incidentService.removeIncident(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      const e = err as { detail?: string };
      setError(e.detail || "Failed to delete incident");
      throw err;
    }
  }, []);

  return { items, loading, error, refresh, saveItem, deleteItem };
}
