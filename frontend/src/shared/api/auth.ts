import { apiClient } from "./client";
import type {
  ApiMagicLinkRequest,
  ApiMagicLinkResponse,
  ApiLoginResponse,
  ApiCurrentUserResponse,
  ApiSuccessResponse,
} from "./types";

export async function requestMagicLink(
  email: string,
  baseUrl?: string
): Promise<ApiMagicLinkResponse> {
  const body: ApiMagicLinkRequest = { email };
  if (baseUrl) body.base_url = baseUrl;
  return apiClient.post<ApiMagicLinkResponse>("/api/auth/magic-link", body);
}

export async function verifyMagicLink(
  token: string
): Promise<ApiLoginResponse> {
  return apiClient.post<ApiLoginResponse>("/api/auth/verify", { token });
}

export async function getCurrentSession(): Promise<ApiCurrentUserResponse> {
  return apiClient.get<ApiCurrentUserResponse>("/api/auth/session");
}

export async function logout(): Promise<ApiSuccessResponse> {
  return apiClient.post<ApiSuccessResponse>("/api/auth/logout");
}
