import type { InventoryItem, InventoryGroup } from "../types/inventory.types";
import type {
  ApiInventoryResponse,
  ApiInventoryCreate,
  ApiInventoryUpdate,
} from "../../../shared/api/types";
import * as inventoryApi from "../../../shared/api/inventory";
import * as archetypesApi from "../../../shared/api/archetypes";

const DEFAULT_ARCHETYPE_ID = "gida-rasyonlari";
const DEPOT_LOCATIONS: Record<string, { lat: number; lng: number; address: string }> = {
  default: { lat: 37.7645, lng: 38.6432, address: "Depo Merkezi" },
};

function resolveArchetypeId(item: InventoryItem): string {
  const name = item.name.toLowerCase();
  if (name.includes("su")) return "su-siseleri";
  if (name.includes("ilk yard") || name.includes("first aid")) return "ilk-yardim-kitleri";
  if (name.includes("battaniye")) return "bebek-battaniyeleri";
  if (name.includes("gida") || name.includes("rasyon")) return "gida-rasyonlari";
  if (name.includes("mama")) return "bebek-mamasi";
  if (name.includes("hijyen")) return "kadin-hijyen-kitleri";
  if (name.includes("yasli") || name.includes("bakim")) return "yasli-bakim-malzemeleri";
  if (name.includes("jenerator")) return "acil-durum-jeneratorleri";
  return DEFAULT_ARCHETYPE_ID;
}

export function toApiCreate(
  item: InventoryItem,
  location?: { lat: number; lng: number; address: string }
): ApiInventoryCreate {
  const loc = location || DEPOT_LOCATIONS.default;
  return {
    archetype_id: resolveArchetypeId(item),
    quantity: item.quantity,
    location_lat: loc.lat,
    location_lng: loc.lng,
    location_address: loc.address,
    status: "available",
    archetype_values: {
      cozer: item.resolves,
      grup: item.group || "genel",
      orijinal_ad: item.name,
    },
  };
}

export function toApiUpdate(
  item: InventoryItem,
  location?: { lat: number; lng: number; address: string }
): ApiInventoryUpdate {
  const result: ApiInventoryUpdate = {
    quantity: item.quantity,
    archetype_values: {
      cozer: item.resolves,
      grup: item.group || "genel",
      orijinal_ad: item.name,
    },
  };
  if (location) {
    result.location_lat = location.lat;
    result.location_lng = location.lng;
    result.location_address = location.address;
  }
  return result;
}

export function toFrontendItem(api: ApiInventoryResponse): InventoryItem {
  const values = api.archetype_values as Record<string, unknown>;
  return {
    id: api.id,
    name: (values.orijinal_ad as string) || api.archetype_id,
    quantity: api.quantity,
    resolves: (values.cozer as string[]) || [],
    group: (values.grup as InventoryGroup) || undefined,
  };
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  const items = await inventoryApi.listInventory();
  return items.map(toFrontendItem);
}

export async function createInventoryItem(
  item: InventoryItem,
  location?: { lat: number; lng: number; address: string }
): Promise<InventoryItem> {
  const apiData = toApiCreate(item, location);
  const created = await inventoryApi.createInventory(apiData);
  return toFrontendItem(created);
}

export async function updateInventoryItem(
  id: string,
  item: InventoryItem,
  location?: { lat: number; lng: number; address: string }
): Promise<InventoryItem> {
  const apiData = toApiUpdate(item, location);
  const updated = await inventoryApi.updateInventory(id, apiData);
  return toFrontendItem(updated);
}

export async function deleteInventoryItem(id: string): Promise<void> {
  await inventoryApi.deleteInventory(id);
}

export async function saveInventoryItem(
  item: InventoryItem,
  location?: { lat: number; lng: number; address: string }
): Promise<InventoryItem> {
  const existing = await inventoryApi.listInventory();
  const found = existing.find((i) => i.id === item.id);
  if (found) {
    return updateInventoryItem(item.id, item, location);
  }
  return createInventoryItem(item, location);
}

export async function findArchetypeByName(name: string): Promise<string | null> {
  try {
    const archetypes = await archetypesApi.listArchetypes({ category: "food" });
    const found = archetypes.find((a) =>
      a.name.toLowerCase().includes(name.toLowerCase())
    );
    return found?.id || null;
  } catch {
    return null;
  }
}
