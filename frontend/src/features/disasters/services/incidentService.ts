import * as incidentsApi from "../../../shared/api/incidents";
import type { Disaster } from "../types/disasters.types";
import type {
  ApiIncidentResponse,
  ApiIncidentCreate,
  ApiIncidentUpdate,
} from "../../../shared/api/types";

function mapIncident(api: ApiIncidentResponse): Disaster {
  return {
    id: api.id,
    type: api.type,
    location: { lat: api.location_lat, lng: api.location_lng, address: api.location_address },
    address: api.location_address,
    severity: api.severity as Disaster["severity"],
    status: api.status as Disaster["status"],
    timestamp: api.timestamp,
    description: api.description,
    affectedRadius: api.affected_radius ?? undefined,
  };
}

function toApiCreate(item: Disaster): ApiIncidentCreate {
  return {
    type: item.type,
    location_lat: item.location.lat,
    location_lng: item.location.lng,
    location_address: item.location.address,
    severity: item.severity,
    status: item.status,
    timestamp: item.timestamp,
    description: item.description,
    affected_radius: item.affectedRadius,
  };
}

function toApiUpdate(item: Disaster): ApiIncidentUpdate {
  return {
    type: item.type,
    location_lat: item.location.lat,
    location_lng: item.location.lng,
    location_address: item.location.address,
    severity: item.severity,
    status: item.status,
    description: item.description,
    affected_radius: item.affectedRadius,
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
