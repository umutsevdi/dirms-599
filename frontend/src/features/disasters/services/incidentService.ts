import * as incidentsApi from "../../../shared/api/incidents";
import * as archetypesApi from "../../../shared/api/archetypes";
import type { Disaster, IncidentArchetypeDsl } from "../types/disasters.types";
import type {
  ApiIncidentResponse,
  ApiIncidentCreate,
  ApiIncidentUpdate,
  ApiIncidentArchetypeResponse,
} from "../../../shared/api/types";

function mapIncident(api: ApiIncidentResponse): Disaster {
  const values = api.archetype_values as Record<string, unknown> | undefined;
  const restValues = values ? { ...values } : {};
  delete restValues.type;
  return {
    id: api.id,
    archetypeId: api.archetype_id || undefined,
    type: api.type,
    location: { lat: api.location_lat, lng: api.location_lng, address: api.location_address },
    address: api.location_address,
    severity: api.severity as Disaster["severity"],
    status: api.status as Disaster["status"],
    timestamp: api.timestamp,
    description: api.description,
    affectedRadius: api.affected_radius ?? undefined,
    archetypeValues: Object.keys(restValues).length > 0 ? restValues : undefined,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

function toApiCreate(item: Disaster): ApiIncidentCreate {
  return {
    archetype_id: item.archetypeId,
    type: item.type,
    location_lat: item.location.lat,
    location_lng: item.location.lng,
    location_address: item.location.address,
    severity: item.severity,
    status: item.status,
    timestamp: item.timestamp,
    description: item.description,
    affected_radius: item.affectedRadius,
    archetype_values: {
      ...(item.archetypeValues || {}),
    },
  };
}

function toApiUpdate(item: Disaster): ApiIncidentUpdate {
  return {
    archetype_id: item.archetypeId,
    type: item.type,
    location_lat: item.location.lat,
    location_lng: item.location.lng,
    location_address: item.location.address,
    severity: item.severity,
    status: item.status,
    description: item.description,
    affected_radius: item.affectedRadius,
    archetype_values: {
      ...(item.archetypeValues || {}),
    },
  };
}

export async function fetchIncidents(params?: {
  status?: string;
  severity?: string;
  search?: string;
}): Promise<Disaster[]> {
  const entries = await incidentsApi.listIncidents(params);
  return entries.map(mapIncident);
}

export async function saveIncident(item: Disaster): Promise<Disaster> {
  const existing = await incidentsApi.listIncidents({ search: item.id });
  if (existing.length > 0) {
    const api = await incidentsApi.updateIncident(item.id, toApiUpdate(item));
    return mapIncident(api);
  }
  const api = await incidentsApi.createIncident(toApiCreate(item));
  return mapIncident(api);
}

export async function removeIncident(id: string): Promise<void> {
  await incidentsApi.deleteIncident(id);
}

function mapApiArchetypeToDsl(api: ApiIncidentArchetypeResponse): IncidentArchetypeDsl {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    category: api.category,
    source: api.source,
    fieldSchema: api.field_schema || [],
    urgencyRules: api.urgency_rules || [],
    implications: api.implications || {},
    defaultReportUrgency: api.default_report_urgency || undefined,
    parentArchetypeId: api.parent_archetype_id || undefined,
    version: api.version,
  };
}

export async function listIncidentArchetypes(): Promise<IncidentArchetypeDsl[]> {
  const allArchetypes = await archetypesApi.listArchetypes();
  return allArchetypes
    .filter((a) => a.type === "incident")
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
      implications: {},
      version: a.version,
    }));
}

export async function fetchIncidentArchetypeWithInheritance(
  archetypeId: string
): Promise<{ dsl: IncidentArchetypeDsl; chain: IncidentArchetypeDsl[] }> {
  const chain: IncidentArchetypeDsl[] = [];
  let currentId: string | undefined = archetypeId;

  while (currentId) {
    const api = await archetypesApi.getIncidentArchetype(currentId);
    const dsl = mapApiArchetypeToDsl(api);
    chain.push(dsl);
    currentId = dsl.parentArchetypeId;
  }

  const child = chain[0];
  const parent = chain.length > 1 ? chain[1] : null;

  const merged: IncidentArchetypeDsl = {
    ...child,
    fieldSchema: mergeFieldSchemas(parent?.fieldSchema || [], child.fieldSchema),
    urgencyRules: parent?.urgencyRules
      ? mergeUrgencyRules(parent.urgencyRules, child.urgencyRules)
      : child.urgencyRules,
    implications: {
      ...(parent?.implications || {}),
      ...child.implications,
    },
  };

  return { dsl: merged, chain };
}

function mergeFieldSchemas(
  parentFields: IncidentArchetypeDsl["fieldSchema"],
  childFields: IncidentArchetypeDsl["fieldSchema"]
): IncidentArchetypeDsl["fieldSchema"] {
  const fieldMap = new Map<string, IncidentArchetypeDsl["fieldSchema"][number]>();
  for (const f of parentFields) {
    fieldMap.set(f.field, f);
  }
  for (const f of childFields) {
    fieldMap.set(f.field, { ...fieldMap.get(f.field), ...f });
  }
  return Array.from(fieldMap.values());
}

function mergeUrgencyRules(
  parentRules: IncidentArchetypeDsl["urgencyRules"],
  childRules: IncidentArchetypeDsl["urgencyRules"]
): IncidentArchetypeDsl["urgencyRules"] {
  const ruleKey = (r: IncidentArchetypeDsl["urgencyRules"][number]) =>
    `${r.field}|${r.operator}|${r.value}`;
  const ruleMap = new Map<string, IncidentArchetypeDsl["urgencyRules"][number]>();
  for (const r of parentRules) {
    ruleMap.set(ruleKey(r), r);
  }
  for (const r of childRules) {
    ruleMap.set(ruleKey(r), r);
  }
  return Array.from(ruleMap.values());
}
