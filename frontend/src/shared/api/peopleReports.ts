import { apiClient } from "./client";
import type {
  ApiPeopleReportResponse,
  ApiPeopleReportCreate,
  ApiPeopleReportUpdate,
  ApiNeedsArchetypeResponse,
  ApiNeedsArchetypeCreate,
  ApiNeedsArchetypeUpdate,
  ApiSuccessResponse,
  ApiUrgencyResult,
  ArchetypeSource,
} from "./types";

export async function listPeopleReports(): Promise<ApiPeopleReportResponse[]> {
  return apiClient.get<ApiPeopleReportResponse[]>("/api/people-reports");
}

export async function getPeopleReport(id: string): Promise<ApiPeopleReportResponse> {
  return apiClient.get<ApiPeopleReportResponse>(`/api/people-reports/${id}`);
}

export async function createPeopleReport(
  data: ApiPeopleReportCreate
): Promise<ApiPeopleReportResponse> {
  return apiClient.post<ApiPeopleReportResponse>("/api/people-reports", data);
}

export async function updatePeopleReport(
  id: string,
  data: ApiPeopleReportUpdate
): Promise<ApiPeopleReportResponse> {
  return apiClient.patch<ApiPeopleReportResponse>(`/api/people-reports/${id}`, data);
}

export async function deletePeopleReport(id: string): Promise<ApiSuccessResponse> {
  return apiClient.delete<ApiSuccessResponse>(`/api/people-reports/${id}`);
}

export async function listNeedsArchetypes(params?: {
  source?: ArchetypeSource;
  search?: string;
}): Promise<ApiNeedsArchetypeResponse[]> {
  const qs = new URLSearchParams();
  if (params?.source) qs.set("source", params.source);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  return apiClient.get<ApiNeedsArchetypeResponse[]>(
    `/api/archetypes/needs${query ? `?${query}` : ""}`
  );
}

export async function getNeedsArchetype(
  id: string
): Promise<ApiNeedsArchetypeResponse> {
  return apiClient.get<ApiNeedsArchetypeResponse>(`/api/archetypes/needs/${id}`);
}

export async function createNeedsArchetype(
  data: ApiNeedsArchetypeCreate
): Promise<ApiNeedsArchetypeResponse> {
  return apiClient.post<ApiNeedsArchetypeResponse>("/api/archetypes/needs", data);
}

export async function updateNeedsArchetype(
  id: string,
  data: ApiNeedsArchetypeUpdate
): Promise<ApiNeedsArchetypeResponse> {
  return apiClient.patch<ApiNeedsArchetypeResponse>(`/api/archetypes/needs/${id}`, data);
}

export async function deleteNeedsArchetype(
  id: string
): Promise<ApiSuccessResponse> {
  return apiClient.delete<ApiSuccessResponse>(`/api/archetypes/needs/${id}`);
}

export async function duplicateNeedsArchetype(
  id: string,
  newId: string
): Promise<ApiNeedsArchetypeResponse> {
  return apiClient.post<ApiNeedsArchetypeResponse>(
    `/api/archetypes/needs/${id}/duplicate?new_id=${encodeURIComponent(newId)}`
  );
}

export async function calculateNeedsArchetypeUrgency(
  id: string,
  values: Record<string, unknown>
): Promise<ApiUrgencyResult> {
  return apiClient.post<ApiUrgencyResult>(
    `/api/archetypes/needs/${id}/calculate-urgency`,
    { values }
  );
}
