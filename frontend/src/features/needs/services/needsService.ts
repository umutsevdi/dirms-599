import { useState, useEffect, useCallback } from "react";
import * as peopleReportsApi from "../../../shared/api/peopleReports";
import type { NeedsArchetype, NeedsCache } from "../types/needs.types";

let cache: NeedsCache = {
  list: [],
  map: new Map(),
  loaded: false,
};

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function useNeedsArchetypes() {
  const [data, setData] = useState<NeedsArchetype[]>(cache.list);
  const [loading, setLoading] = useState(!cache.loaded);

  useEffect(() => {
    if (cache.loaded) {
      setData(cache.list);
      setLoading(false);
      return;
    }

    let cancelled = false;
    peopleReportsApi
      .listNeedsArchetypes()
      .then((apiList) => {
        if (cancelled) return;
        cache.list = apiList.map((a) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          category: a.category,
          source: a.source,
          urgencyRules: a.urgency_rules ?? [],
          fieldSchema: a.field_schema ?? [],
          icon: a.icon ?? undefined,
          color: a.color ?? undefined,
        }));
        cache.map = new Map(cache.list.map((a) => [a.id, a.name]));
        cache.loaded = true;
        setData(cache.list);
        setLoading(false);
        notifyListeners();
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { needsArchetypes: data, loading };
}

export function getNeedName(archetypeId: string): string {
  if (cache.map.has(archetypeId)) {
    return cache.map.get(archetypeId)!;
  }
  return archetypeId;
}

export function getAllNeedsArchetypes(): NeedsArchetype[] {
  return cache.list;
}

export function subscribeToNeeds(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function invalidateNeedsCache() {
  cache = { list: [], map: new Map(), loaded: false };
  notifyListeners();
}
