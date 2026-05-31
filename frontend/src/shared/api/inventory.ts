import { apiClient } from "./client";
import type {
  ApiInventoryResponse,
  ApiInventoryCreate,
  ApiInventoryUpdate,
  ApiSuccessResponse,
  ApiUrgencyResult,
} from "./types";

export async function listInventory(params?: {
  status?: string;
  archetype_id?: string;
}): Promise<ApiInventoryResponse[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.archetype_id) qs.set("archetype_id", params.archetype_id);
  const query = qs.toString();
  return apiClient.get<ApiInventoryResponse[]>(
    `/api/inventory${query ? `?${query}` : ""}`
  );
}

export async function getInventory(id: string): Promise<ApiInventoryResponse> {
  return apiClient.get<ApiInventoryResponse>(`/api/inventory/${id}`);
}

export async function createInventory(
  data: ApiInventoryCreate
): Promise<ApiInventoryResponse> {
  return apiClient.post<ApiInventoryResponse>("/api/inventory", data);
}

export async function updateInventory(
  id: string,
  data: ApiInventoryUpdate
): Promise<ApiInventoryResponse> {
  return apiClient.patch<ApiInventoryResponse>(`/api/inventory/${id}`, data);
}

export async function deleteInventory(id: string): Promise<ApiSuccessResponse> {
  return apiClient.delete<ApiSuccessResponse>(`/api/inventory/${id}`);
}

export async function calculateInventoryUrgency(
  id: string
): Promise<ApiUrgencyResult> {
  return apiClient.get<ApiUrgencyResult>(`/api/inventory/${id}/calculate-urgency`);
}
