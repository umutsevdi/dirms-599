// Shared types - re-export everything for convenience
export * from "./common.types";

// Re-export feature types (for backward compatibility)
export type {
  Entity,
  Employee,
  AuthSession,
  MagicLinkToken,
  EntityType,
  EmployeeRole,
} from "../../features/auth/types/auth.types";

export type {
  Disaster,
  Resource,
  MapMarker,
} from "../../features/disasters/types/disasters.types";

export type {
  PeopleReport,
  Need,
} from "../../features/people-reports/types/people-reports.types";

export type {
  InventoryItem,
  InventoryGroup,
} from "../../features/inventory/types/inventory.types";
