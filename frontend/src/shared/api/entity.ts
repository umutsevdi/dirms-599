import { apiClient } from "./client";
import type { ApiEntityResponse, ApiEntityUpdate } from "./types";

export async function getCurrentEntity(): Promise<ApiEntityResponse> {
  return apiClient.get<ApiEntityResponse>("/api/entity");
}

export async function updateEntity(
  data: ApiEntityUpdate
): Promise<ApiEntityResponse> {
  return apiClient.patch<ApiEntityResponse>("/api/entity", data);
}
