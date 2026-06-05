import type { InventoryItem, InventoryGroup, InventoryArchetypeDsl } from "../types/inventory.types";
import type {
  ApiInventoryResponse,
  ApiInventoryCreate,
  ApiInventoryUpdate,
  ApiInventoryArchetypeResponse,
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
  return item.archetypeId || DEFAULT_ARCHETYPE_ID;
}

export function toApiCreate(
  item: InventoryItem,
  location?: { lat: number; lng: number; address: string }
): ApiInventoryCreate {
  const loc = location || DEPOT_LOCATIONS.default;
  return {
    archetype_id: item.archetypeId || resolveArchetypeId(item),
    quantity: item.quantity,
    location_lat: loc.lat,
    location_lng: loc.lng,
    location_address: loc.address,
    status: "available",
    archetype_values: {
      cozer: item.resolves,
      grup: item.group || "genel",
      orijinal_ad: item.name,
      ...(item.archetypeValues || {}),
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
      ...(item.archetypeValues || {}),
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
  const { cozer, grup, orijinal_ad, ...restValues } = values;
  return {
    id: api.id,
    archetypeId: api.archetype_id,
    name: (orijinal_ad as string) || api.archetype_id,
    quantity: api.quantity,
    resolves: (cozer as string[]) || [],
    group: (grup as InventoryGroup) || undefined,
    archetypeValues: Object.keys(restValues).length > 0 ? restValues : undefined,
    location: {
      lat: api.location_lat,
      lng: api.location_lng,
      address: api.location_address || "",
    },
    status: api.status as InventoryItem["status"],
    notes: api.notes || undefined,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
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
    const apiData = toApiUpdate(item, location);
    console.log("Updating inventory - API data:", JSON.stringify(apiData, null, 2));
    const updated = await inventoryApi.updateInventory(item.id, apiData);
    console.log("Updated inventory response:", updated);
    return toFrontendItem(updated);
  }
  const apiData = toApiCreate(item, location);
  console.log("Creating inventory - API data:", JSON.stringify(apiData, null, 2));
  const created = await inventoryApi.createInventory(apiData);
  console.log("Created inventory response:", created);
  return toFrontendItem(created);
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

export async function listInventoryArchetypes(): Promise<InventoryArchetypeDsl[]> {
  const allArchetypes = await archetypesApi.listArchetypes();
  return allArchetypes
    .filter((a) => a.type === "inventory")
    .map((a) => ({
      id: a.id,
      name: a.name,
      description: "",
      category: a.category,
      source: a.source,
      fieldSchema: (a.field_schema || []).map((f) => ({
        field: f.field,
        label: f.label,
        type: f.type,
        required: false,
      })),
      urgencyRules: (a.urgency_rules || []).map((r) => ({
        field: r.field,
        operator: r.operator,
        value: r.value,
        setUrgency: r.setUrgency,
        message: r.message,
      })),
      resolvesNeeds: a.resolves_needs || [],
      targetDemographics: a.target_demographics || [],
      quantityUnit: "adet",
      version: a.version,
    }));
}

function mapApiArchetypeToDsl(api: ApiInventoryArchetypeResponse): InventoryArchetypeDsl {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    category: api.category,
    source: api.source,
    fieldSchema: api.field_schema || [],
    urgencyRules: api.urgency_rules || [],
    resolvesNeeds: api.resolves_needs || [],
    targetDemographics: api.target_demographics || [],
    physicalProperties: api.physical_properties,
    quantityUnit: api.quantity_unit,
    foodProperties: api.food_properties,
    medicalProperties: api.medical_properties,
    parentArchetypeId: api.parent_archetype_id || undefined,
    version: api.version,
  };
}

export async function fetchInventoryArchetypeWithInheritance(
  archetypeId: string
): Promise<{ dsl: InventoryArchetypeDsl; chain: InventoryArchetypeDsl[] }> {
  const chain: InventoryArchetypeDsl[] = [];
  let currentId: string | undefined = archetypeId;

  while (currentId) {
    const api = await archetypesApi.getInventoryArchetype(currentId);
    const dsl = mapApiArchetypeToDsl(api);
    chain.push(dsl);
    currentId = dsl.parentArchetypeId;
  }

  const child = chain[0];
  const parent = chain.length > 1 ? chain[1] : null;

  const merged: InventoryArchetypeDsl = {
    ...child,
    fieldSchema: mergeFieldSchemas(parent?.fieldSchema || [], child.fieldSchema),
    urgencyRules: parent?.urgencyRules
      ? mergeUrgencyRules(parent.urgencyRules, child.urgencyRules)
      : child.urgencyRules,
    resolvesNeeds: [
      ...new Set([
        ...(parent?.resolvesNeeds || []),
        ...child.resolvesNeeds,
      ]),
    ],
    targetDemographics: [
      ...new Set([
        ...(parent?.targetDemographics || []),
        ...child.targetDemographics,
      ]),
    ],
  };

  return { dsl: merged, chain };
}

function mergeFieldSchemas(
  parentFields: InventoryArchetypeDsl["fieldSchema"],
  childFields: InventoryArchetypeDsl["fieldSchema"]
): InventoryArchetypeDsl["fieldSchema"] {
  const fieldMap = new Map<string, InventoryArchetypeDsl["fieldSchema"][number]>();
  for (const f of parentFields) {
    fieldMap.set(f.field, f);
  }
  for (const f of childFields) {
    fieldMap.set(f.field, { ...fieldMap.get(f.field), ...f });
  }
  return Array.from(fieldMap.values());
}

function mergeUrgencyRules(
  parentRules: InventoryArchetypeDsl["urgencyRules"],
  childRules: InventoryArchetypeDsl["urgencyRules"]
): InventoryArchetypeDsl["urgencyRules"] {
  const ruleKey = (r: InventoryArchetypeDsl["urgencyRules"][number]) =>
    `${r.field}|${r.operator}|${r.value}`;
  const ruleMap = new Map<string, InventoryArchetypeDsl["urgencyRules"][number]>();
  for (const r of parentRules) {
    ruleMap.set(ruleKey(r), r);
  }
  for (const r of childRules) {
    ruleMap.set(ruleKey(r), r);
  }
  return Array.from(ruleMap.values());
}
