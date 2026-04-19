// Auth feature exports
export { AuthProvider, useAuth } from "./contexts/AuthContext";
export { default as ProtectedRoute } from "./components/ProtectedRoute";
export { mockAuthService } from "./services/mockAuthService";
export type {
  Entity,
  Employee,
  AuthSession,
  MagicLinkToken,
  EntityType,
  EmployeeRole,
} from "./types/auth.types";
