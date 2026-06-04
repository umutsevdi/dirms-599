import { apiClient } from "./client";
import type { ApiIncidentResponse, ApiIncidentCreate, ApiIncidentUpdate } from "./types";

export async function listIncidents(params?: { status?: string; severity?: string; search?: string }): Promise<ApiIncidentResponse[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.severity) qs.set("severity", params.severity);
  if (params?.search) qs.set("search", params.search);
  return apiClient.get<ApiIncidentResponse[]>(`/api/incidents?${qs.toString()}`);
}

export async function getIncident(id: string): Promise<ApiIncidentResponse> {
  return apiClient.get<ApiIncidentResponse>(`/api/incidents/${id}`);
}

export async function createIncident(data: ApiIncidentCreate): Promise<ApiIncidentResponse> {
  return apiClient.post<ApiIncidentResponse>("/api/incidents", data);
}

export async function updateIncident(id: string, data: ApiIncidentUpdate): Promise<ApiIncidentResponse> {
  return apiClient.patch<ApiIncidentResponse>(`/api/incidents/${id}`, data);
}

export async function deleteIncident(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/incidents/${id}`);
}
