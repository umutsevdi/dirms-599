export type InventoryCategory = "food" | "medical" | "shelter" | "clothing" | "equipment" | "hygiene" | "other";
export type ArchetypeCategory = "incident" | InventoryCategory;
export type ArchetypeSource = "system" | "wikidata" | "user";
export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface ArchetypeFieldSchema {
  field: string;
  label: string;
  type: "number" | "text" | "boolean";
  required: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
}

export interface ArchetypeUrgencyRule {
  field: string;
  operator: "<" | ">" | "=" | "<=" | ">=";
  value: string | number | boolean;
  setUrgency: UrgencyLevel;
  message: string;
}

export interface IncidentArchetype {
  id: string;
  name: string;
  description?: string;
  category: "incident";
  source: ArchetypeSource;
  fieldSchema: ArchetypeFieldSchema[];
  urgencyRules: ArchetypeUrgencyRule[];
  implications: Record<string, unknown>;
  defaultReportUrgency?: UrgencyLevel;
  wikidataId?: string;
  parentArchetypeId?: string | null;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface InventoryArchetype {
  id: string;
  name: string;
  description?: string;
  category: InventoryCategory;
  source: ArchetypeSource;
  fieldSchema: ArchetypeFieldSchema[];
  urgencyRules: ArchetypeUrgencyRule[];
  resolvesNeeds: string[];
  targetDemographics: string[];
  physicalProperties?: Record<string, unknown>;
  quantityUnit: string;
  foodProperties?: Record<string, unknown>;
  medicalProperties?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  learning?: Record<string, unknown>;
  wikidataId?: string;
  parentArchetypeId?: string | null;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface NeedsArchetype {
  id: string;
  name: string;
  description?: string;
  category: "need";
  source: ArchetypeSource;
  urgencyRules: ArchetypeUrgencyRule[];
  icon?: string;
  color?: string;
  wikidataId?: string;
  parentArchetypeId?: string | null;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type AnyArchetype = IncidentArchetype | InventoryArchetype | NeedsArchetype;

export interface ArchetypeListEntry {
  type: "incident" | "inventory" | "need";
  id: string;
  name: string;
  category: string;
  source: ArchetypeSource;
  version: number;
  parentArchetypeId?: string | null;
  resolvesNeeds?: string[];
  targetDemographics?: string[];
  fieldSchema?: { field: string; label: string; type: string }[];
  urgencyRules?: { field: string; operator: string; value: unknown; setUrgency: string; message: string }[];
  icon?: string;
  color?: string;
}
