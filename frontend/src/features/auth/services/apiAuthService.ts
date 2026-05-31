import type {
  AuthSession,
  Employee,
  Entity,
  EmployeeRole,
} from "../types/auth.types";
import * as authApi from "../../../shared/api/auth";
import * as entityApi from "../../../shared/api/entity";
import * as employeesApi from "../../../shared/api/employees";
import type {
  ApiEmployeeResponse,
  ApiEntityResponse,
  ApiLoginResponse,
} from "../../../shared/api/types";

let currentSession: AuthSession | null = null;

const loadSessionFromStorage = () => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("auth_session");
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored) as AuthSession;
    if (new Date(parsed.expiresAt) > new Date()) {
      currentSession = parsed;
    } else {
      localStorage.removeItem("auth_session");
    }
  } catch {
    localStorage.removeItem("auth_session");
  }
};

loadSessionFromStorage();

function mapApiEmployee(api: ApiEmployeeResponse): Employee {
  return {
    id: api.id,
    fullName: api.full_name,
    email: api.email,
    entityId: api.entity_id,
    role: api.role,
    enabled: api.enabled,
    createdAt: api.created_at,
    lastLoginAt: api.last_login_at,
  };
}

function mapApiEntity(api: ApiEntityResponse): Entity {
  return {
    id: api.id,
    name: api.name,
    type: api.type as Entity["type"],
    logoUrl: api.logo_url,
    description: api.description,
    website: api.website,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export const apiAuthService = {
  getSession: (): AuthSession | null => {
    if (!currentSession) return null;
    if (new Date(currentSession.expiresAt) < new Date()) {
      apiAuthService.logout();
      return null;
    }
    return currentSession;
  },

  getCurrentUser: async (): Promise<Employee | null> => {
    const session = apiAuthService.getSession();
    if (!session) return null;
    try {
      const user = await authApi.getCurrentSession();
      return {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        entityId: user.entity.id,
        role: user.role,
        enabled: true,
        createdAt: user.entity.created_at,
        lastLoginAt: undefined,
      };
    } catch {
      return null;
    }
  },

  getCurrentEntity: async (): Promise<Entity | null> => {
    const session = apiAuthService.getSession();
    if (!session) return null;
    try {
      const entity = await entityApi.getCurrentEntity();
      return mapApiEntity(entity);
    } catch {
      return null;
    }
  },

  requestMagicLink: async (
    email: string
  ): Promise<{ success: boolean; token?: string; error?: string }> => {
    try {
      const result = await authApi.requestMagicLink(email);
      return { success: true, token: result.token };
    } catch (err: unknown) {
      let message = "Failed to send magic link";
      if (err && typeof err === "object" && "detail" in err) {
        const d = (err as Record<string, unknown>).detail;
        if (typeof d === "string") message = d;
      }
      return { success: false, error: message };
    }
  },

  verifyMagicLink: async (
    token: string
  ): Promise<{ success: boolean; session?: AuthSession; error?: string }> => {
    try {
      const result: ApiLoginResponse = await authApi.verifyMagicLink(token);
      if (!result.success || !result.session) {
        return { success: false, error: result.error || "Failed to verify link" };
      }

      const session: AuthSession = {
        token: result.session.token,
        userId: result.session.user_id,
        entityId: result.session.entity_id,
        role: result.session.role,
        expiresAt: result.session.expires_at,
      };

      currentSession = session;

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_session", JSON.stringify(session));
      }

      return { success: true, session };
    } catch (err: unknown) {
      const error = err as { detail?: string };
      return { success: false, error: error.detail || "Failed to verify link" };
    }
  },

  logout: async (): Promise<void> => {
    if (currentSession) {
      try {
        await authApi.logout();
      } catch {
        // ignore server error on logout
      }
    }
    currentSession = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session");
    }
  },

  isAdmin: (): boolean => {
    const session = apiAuthService.getSession();
    return session?.role === "ADMIN";
  },

  getEntityEmployees: async (): Promise<Employee[]> => {
    try {
      const employees = await employeesApi.listEmployees();
      return employees.map(mapApiEmployee);
    } catch {
      return [];
    }
  },

  addEmployee: async (data: {
    fullName: string;
    email: string;
    role: EmployeeRole;
  }): Promise<{ success: boolean; employee?: Employee; error?: string }> => {
    try {
      const result = await employeesApi.addEmployee({
        full_name: data.fullName,
        email: data.email,
        role: data.role,
      });

      if (!result.success) {
        return { success: false, error: result.message };
      }

      const employees = await employeesApi.listEmployees();
      const newEmp = employees.find((e) => e.email === data.email);
      if (!newEmp) {
        return { success: true };
      }

      return { success: true, employee: mapApiEmployee(newEmp) };
    } catch (err: unknown) {
      const error = err as { detail?: string };
      return { success: false, error: error.detail || "Failed to add employee" };
    }
  },

  editEmployee: async (
    employeeId: string,
    data: Partial<Pick<Employee, "fullName" | "role" | "enabled">>
  ): Promise<{ success: boolean; employee?: Employee; error?: string }> => {
    try {
      const apiData = {
        full_name: data.fullName,
        role: data.role,
        enabled: data.enabled,
      };
      const updated = await employeesApi.updateEmployee(employeeId, apiData);
      return { success: true, employee: mapApiEmployee(updated) };
    } catch (err: unknown) {
      const error = err as { detail?: string };
      return { success: false, error: error.detail || "Failed to update employee" };
    }
  },

  toggleEmployeeEnabled: async (
    employeeId: string
  ): Promise<{ success: boolean; employee?: Employee; error?: string }> => {
    try {
      const updated = await employeesApi.toggleEmployee(employeeId);
      return { success: true, employee: mapApiEmployee(updated) };
    } catch (err: unknown) {
      const error = err as { detail?: string };
      return { success: false, error: error.detail || "Failed to toggle employee" };
    }
  },

  updateEntity: async (
    data: Partial<Pick<Entity, "name" | "logoUrl" | "description" | "website">>
  ): Promise<{ success: boolean; entity?: Entity; error?: string }> => {
    try {
      const updated = await entityApi.updateEntity({
        name: data.name,
        logo_url: data.logoUrl,
        description: data.description,
        website: data.website,
      });
      return { success: true, entity: mapApiEntity(updated) };
    } catch (err: unknown) {
      const error = err as { detail?: string };
      return { success: false, error: error.detail || "Failed to update entity" };
    }
  },
};
