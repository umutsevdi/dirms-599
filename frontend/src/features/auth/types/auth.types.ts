export type EntityType =
  | "STK"
  | "Üniversite"
  | "Şirket"
  | "Hükumet"
  | "Medya";

export type EmployeeRole = "ADMIN" | "USER";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  logoUrl?: string;
  description?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  entityId: string;
  role: EmployeeRole;
  enabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  entityId: string;
  role: EmployeeRole;
  expiresAt: string; // ISO timestamp, 7 days from login
}

export interface MagicLinkToken {
  token: string;
  email: string;
  employeeId: string;
  expiresAt: string; // ISO timestamp, 6 hours from creation
  used: boolean;
}
