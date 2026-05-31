import { apiClient } from "./client";
import type {
  ApiArchetypeListEntry,
  ApiIncidentArchetypeResponse,
  ApiInventoryArchetypeResponse,
  ApiIncidentArchetypeCreate,
  ApiInventoryArchetypeCreate,
  ApiIncidentArchetypeUpdate,
  ApiInventoryArchetypeUpdate,
  ApiSuccessResponse,
  ApiUrgencyResult,
  ArchetypeSource,
} from "./types";

export async function listArchetypes(params?: {
  category?: string;
  source?: ArchetypeSource;
  search?: string;
}): Promise<ApiArchetypeListEntry[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.source) qs.set("source", params.source);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return apiClient.get<ApiArchetypeListEntry[]>(
    `/api/archetypes${query ? `?${query}` : ""}`
  );
}

export async function getIncidentArchetype(
  id: string
): Promise<ApiIncidentArchetypeResponse> {
  return apiClient.get<ApiIncidentArchetypeResponse>(`/api/archetypes/incident/${id}`);
}

export async function getInventoryArchetype(
  id: string
): Promise<ApiInventoryArchetypeResponse> {
  return apiClient.get<ApiInventoryArchetypeResponse>(`/api/archetypes/inventory/${id}`);
}

export async function createIncidentArchetype(
  data: ApiIncidentArchetypeCreate
): Promise<ApiIncidentArchetypeResponse> {
  return apiClient.post<ApiIncidentArchetypeResponse>("/api/archetypes/incident", data);
}

export async function createInventoryArchetype(
  data: ApiInventoryArchetypeCreate
): Promise<ApiInventoryArchetypeResponse> {
  return apiClient.post<ApiInventoryArchetypeResponse>("/api/archetypes/inventory", data);
}

export async function updateIncidentArchetype(
  id: string,
  data: ApiIncidentArchetypeUpdate
): Promise<ApiIncidentArchetypeResponse> {
  return apiClient.patch<ApiIncidentArchetypeResponse>(`/api/archetypes/incident/${id}`, data);
}

export async function updateInventoryArchetype(
  id: string,
  data: ApiInventoryArchetypeUpdate
): Promise<ApiInventoryArchetypeResponse> {
  return apiClient.patch<ApiInventoryArchetypeResponse>(`/api/archetypes/inventory/${id}`, data);
}

export async function deleteIncidentArchetype(
  id: string
): Promise<ApiSuccessResponse> {
  return apiClient.delete<ApiSuccessResponse>(`/api/archetypes/incident/${id}`);
}

export async function deleteInventoryArchetype(
  id: string
): Promise<ApiSuccessResponse> {
  return apiClient.delete<ApiSuccessResponse>(`/api/archetypes/inventory/${id}`);
}

export async function duplicateIncidentArchetype(
  id: string,
  newId: string
): Promise<ApiIncidentArchetypeResponse> {
  return apiClient.post<ApiIncidentArchetypeResponse>(
    `/api/archetypes/incident/${id}/duplicate?new_id=${encodeURIComponent(newId)}`
  );
}

export async function duplicateInventoryArchetype(
  id: string,
  newId: string
): Promise<ApiInventoryArchetypeResponse> {
  return apiClient.post<ApiInventoryArchetypeResponse>(
    `/api/archetypes/inventory/${id}/duplicate?new_id=${encodeURIComponent(newId)}`
  );
}

export async function calculateIncidentUrgency(
  id: string,
  values: Record<string, unknown>
): Promise<ApiUrgencyResult> {
  return apiClient.post<ApiUrgencyResult>(
    `/api/archetypes/incident/${id}/calculate-urgency`,
    { values }
  );
}

export async function calculateInventoryArchetypeUrgency(
  id: string,
  values: Record<string, unknown>
): Promise<ApiUrgencyResult> {
  return apiClient.post<ApiUrgencyResult>(
    `/api/archetypes/inventory/${id}/calculate-urgency`,
    { values }
  );
}
