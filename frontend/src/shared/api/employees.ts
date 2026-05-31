import { apiClient } from "./client";
import type {
  ApiEmployeeResponse,
  ApiEmployeeCreate,
  ApiEmployeeUpdate,
  ApiMagicLinkResponse,
} from "./types";

export async function listEmployees(): Promise<ApiEmployeeResponse[]> {
  return apiClient.get<ApiEmployeeResponse[]>("/api/employees");
}

export async function addEmployee(
  data: ApiEmployeeCreate
): Promise<ApiMagicLinkResponse> {
  return apiClient.post<ApiMagicLinkResponse>("/api/employees", data);
}

export async function updateEmployee(
  id: string,
  data: ApiEmployeeUpdate
): Promise<ApiEmployeeResponse> {
  return apiClient.patch<ApiEmployeeResponse>(`/api/employees/${id}`, data);
}

export async function toggleEmployee(
  id: string
): Promise<ApiEmployeeResponse> {
  return apiClient.post<ApiEmployeeResponse>(`/api/employees/${id}/toggle`);
}
