import * as archetypesApi from "../../../shared/api/archetypes";
import type {
  IncidentArchetype,
  InventoryArchetype,
  ArchetypeListEntry,
  UrgencyLevel,
} from "../types/archetypes.types";
import type {
  ApiIncidentArchetypeResponse,
  ApiInventoryArchetypeResponse,
  ApiArchetypeListEntry,
  ApiIncidentArchetypeCreate,
  ApiInventoryArchetypeCreate,
  ApiIncidentArchetypeUpdate,
  ApiInventoryArchetypeUpdate,
} from "../../../shared/api/types";

function mapFieldSchema(api: ApiIncidentArchetypeResponse["field_schema"]): IncidentArchetype["fieldSchema"] {
  return api.map((f) => ({
    field: f.field,
    label: f.label,
    type: f.type,
    required: f.required,
    options: f.options,
    defaultValue: f.defaultValue,
  }));
}

function mapUrgencyRules(api: ApiIncidentArchetypeResponse["urgency_rules"]): IncidentArchetype["urgencyRules"] {
  return api.map((r) => ({
    field: r.field,
    operator: r.operator,
    value: r.value,
    setUrgency: r.setUrgency,
    message: r.message,
  }));
}

function mapListEntry(api: ApiArchetypeListEntry): ArchetypeListEntry {
  return {
    type: api.type,
    id: api.id,
    name: api.name,
    category: api.category,
    source: api.source,
    version: api.version,
    parentArchetypeId: api.parent_archetype_id,
  };
}

function mapIncidentArchetype(api: ApiIncidentArchetypeResponse): IncidentArchetype {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    category: "incident",
    source: api.source,
    fieldSchema: mapFieldSchema(api.field_schema),
    urgencyRules: mapUrgencyRules(api.urgency_rules),
    implications: api.implications,
    defaultReportUrgency: api.default_report_urgency as UrgencyLevel | undefined,
    wikidataId: api.wikidata_id,
    parentArchetypeId: api.parent_archetype_id,
    createdBy: api.created_by,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    version: api.version,
  };
}

function mapInventoryArchetype(api: ApiInventoryArchetypeResponse): InventoryArchetype {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    category: api.category,
    source: api.source,
    fieldSchema: mapFieldSchema(api.field_schema),
    urgencyRules: mapUrgencyRules(api.urgency_rules),
    resolvesNeeds: api.resolves_needs,
    targetDemographics: api.target_demographics,
    physicalProperties: api.physical_properties,
    quantityUnit: api.quantity_unit,
    foodProperties: api.food_properties,
    medicalProperties: api.medical_properties,
    brand: api.brand,
    learning: api.learning,
    wikidataId: api.wikidata_id,
    parentArchetypeId: api.parent_archetype_id,
    createdBy: api.created_by,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    version: api.version,
  };
}

export async function fetchArchetypeList(params?: {
  category?: string;
  source?: string;
  search?: string;
}): Promise<ArchetypeListEntry[]> {
  const entries = await archetypesApi.listArchetypes(params as Parameters<typeof archetypesApi.listArchetypes>[0]);
  return entries.map(mapListEntry);
}

export async function fetchIncidentArchetype(id: string): Promise<IncidentArchetype> {
  const api = await archetypesApi.getIncidentArchetype(id);
  return mapIncidentArchetype(api);
}

export async function fetchInventoryArchetype(id: string): Promise<InventoryArchetype> {
  const api = await archetypesApi.getInventoryArchetype(id);
  return mapInventoryArchetype(api);
}

export async function createIncidentArchetype(
  data: Omit<IncidentArchetype, "source" | "createdBy" | "createdAt" | "updatedAt" | "version" | "parentArchetypeId" | "wikidataId">
): Promise<IncidentArchetype> {
  const apiData: ApiIncidentArchetypeCreate = {
    id: data.id,
    name: data.name,
    description: data.description,
    field_schema: data.fieldSchema.map((f) => ({
      field: f.field,
      label: f.label,
      type: f.type,
      required: f.required,
      options: f.options,
      defaultValue: f.defaultValue,
    })),
    urgency_rules: data.urgencyRules.map((r) => ({
      field: r.field,
      operator: r.operator,
      value: r.value,
      setUrgency: r.setUrgency,
      message: r.message,
    })),
    implications: data.implications,
    default_report_urgency: data.defaultReportUrgency,
  };
  const api = await archetypesApi.createIncidentArchetype(apiData);
  return mapIncidentArchetype(api);
}

export async function createInventoryArchetype(
  data: Omit<InventoryArchetype, "source" | "createdBy" | "createdAt" | "updatedAt" | "version" | "parentArchetypeId" | "wikidataId">
): Promise<InventoryArchetype> {
  const apiData: ApiInventoryArchetypeCreate = {
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    field_schema: data.fieldSchema.map((f) => ({
      field: f.field,
      label: f.label,
      type: f.type,
      required: f.required,
      options: f.options,
      defaultValue: f.defaultValue,
    })),
    urgency_rules: data.urgencyRules.map((r) => ({
      field: r.field,
      operator: r.operator,
      value: r.value,
      setUrgency: r.setUrgency,
      message: r.message,
    })),
    resolves_needs: data.resolvesNeeds,
    target_demographics: data.targetDemographics,
    physical_properties: data.physicalProperties,
    quantity_unit: data.quantityUnit,
    food_properties: data.foodProperties,
    medical_properties: data.medicalProperties,
    brand: data.brand,
    learning: data.learning,
  };
  const api = await archetypesApi.createInventoryArchetype(apiData);
  return mapInventoryArchetype(api);
}

export async function updateIncidentArchetype(
  id: string,
  data: Partial<IncidentArchetype>
): Promise<IncidentArchetype> {
  const apiData: ApiIncidentArchetypeUpdate = {};
  if (data.name !== undefined) apiData.name = data.name;
  if (data.description !== undefined) apiData.description = data.description;
  if (data.fieldSchema) apiData.field_schema = data.fieldSchema.map((f) => ({
    field: f.field,
    label: f.label,
    type: f.type,
    required: f.required,
    options: f.options,
    defaultValue: f.defaultValue,
  }));
  if (data.urgencyRules) apiData.urgency_rules = data.urgencyRules.map((r) => ({
    field: r.field,
    operator: r.operator,
    value: r.value,
    setUrgency: r.setUrgency,
    message: r.message,
  }));
  if (data.implications) apiData.implications = data.implications;
  if (data.defaultReportUrgency) apiData.default_report_urgency = data.defaultReportUrgency;

  const api = await archetypesApi.updateIncidentArchetype(id, apiData);
  return mapIncidentArchetype(api);
}

export async function updateInventoryArchetype(
  id: string,
  data: Partial<InventoryArchetype>
): Promise<InventoryArchetype> {
  const apiData: ApiInventoryArchetypeUpdate = {};
  if (data.name !== undefined) apiData.name = data.name;
  if (data.description !== undefined) apiData.description = data.description;
  if (data.fieldSchema) apiData.field_schema = data.fieldSchema.map((f) => ({
    field: f.field,
    label: f.label,
    type: f.type,
    required: f.required,
    options: f.options,
    defaultValue: f.defaultValue,
  }));
  if (data.urgencyRules) apiData.urgency_rules = data.urgencyRules.map((r) => ({
    field: r.field,
    operator: r.operator,
    value: r.value,
    setUrgency: r.setUrgency,
    message: r.message,
  }));
  if (data.resolvesNeeds) apiData.resolves_needs = data.resolvesNeeds;
  if (data.targetDemographics) apiData.target_demographics = data.targetDemographics;
  if (data.physicalProperties) apiData.physical_properties = data.physicalProperties;
  if (data.quantityUnit) apiData.quantity_unit = data.quantityUnit;
  if (data.foodProperties) apiData.food_properties = data.foodProperties;
  if (data.medicalProperties) apiData.medical_properties = data.medicalProperties;
  if (data.brand) apiData.brand = data.brand;
  if (data.learning) apiData.learning = data.learning;

  const api = await archetypesApi.updateInventoryArchetype(id, apiData);
  return mapInventoryArchetype(api);
}

export async function deleteIncidentArchetype(id: string): Promise<void> {
  await archetypesApi.deleteIncidentArchetype(id);
}

export async function deleteInventoryArchetype(id: string): Promise<void> {
  await archetypesApi.deleteInventoryArchetype(id);
}

export async function duplicateIncidentArchetype(
  id: string,
  newId: string
): Promise<IncidentArchetype> {
  const api = await archetypesApi.duplicateIncidentArchetype(id, newId);
  return mapIncidentArchetype(api);
}

export async function duplicateInventoryArchetype(
  id: string,
  newId: string
): Promise<InventoryArchetype> {
  const api = await archetypesApi.duplicateInventoryArchetype(id, newId);
  return mapInventoryArchetype(api);
}

export async function calculateIncidentUrgency(
  id: string,
  values: Record<string, unknown>
): Promise<{ urgency: string; reason: string }> {
  return archetypesApi.calculateIncidentUrgency(id, values);
}

export async function calculateInventoryArchetypeUrgency(
  id: string,
  values: Record<string, unknown>
): Promise<{ urgency: string; reason: string }> {
  return archetypesApi.calculateInventoryArchetypeUrgency(id, values);
}
