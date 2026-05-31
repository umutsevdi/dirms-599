export type ArchetypeSource = "system" | "wikidata" | "user";
export type UrgencyLevel = "critical" | "high" | "medium" | "low";
export type InventoryStatus = "available" | "deployed" | "reserved" | "expired";
export type EmployeeRole = "ADMIN" | "USER";

export interface ApiFieldSchemaItem {
  field: string;
  label: string;
  type: "number" | "text" | "select" | "boolean";
  required: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
}

export interface ApiUrgencyRuleItem {
  field: string;
  operator: "<" | ">" | "=" | "<=" | ">=";
  value: string | number | boolean;
  setUrgency: UrgencyLevel;
  message: string;
}

export interface ApiIncidentArchetypeResponse {
  id: string;
  name: string;
  description?: string;
  category: string;
  source: ArchetypeSource;
  field_schema: ApiFieldSchemaItem[];
  urgency_rules: ApiUrgencyRuleItem[];
  implications: Record<string, unknown>;
  default_report_urgency?: UrgencyLevel;
  wikidata_id?: string;
  parent_archetype_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface ApiInventoryArchetypeResponse {
  id: string;
  name: string;
  description?: string;
  category: "food" | "medical";
  source: ArchetypeSource;
  field_schema: ApiFieldSchemaItem[];
  urgency_rules: ApiUrgencyRuleItem[];
  resolves_needs: string[];
  target_demographics: string[];
  physical_properties?: Record<string, unknown>;
  quantity_unit: string;
  food_properties?: Record<string, unknown>;
  medical_properties?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  learning?: Record<string, unknown>;
  wikidata_id?: string;
  parent_archetype_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface ApiArchetypeListEntry {
  type: "incident" | "inventory";
  id: string;
  name: string;
  category: string;
  source: ArchetypeSource;
  version: number;
  parent_archetype_id?: string;
}

export interface ApiIncidentArchetypeCreate {
  id: string;
  name: string;
  description?: string;
  field_schema: ApiFieldSchemaItem[];
  urgency_rules: ApiUrgencyRuleItem[];
  implications: Record<string, unknown>;
  default_report_urgency?: UrgencyLevel;
}

export interface ApiInventoryArchetypeCreate {
  id: string;
  name: string;
  description?: string;
  category: "food" | "medical";
  field_schema: ApiFieldSchemaItem[];
  urgency_rules: ApiUrgencyRuleItem[];
  resolves_needs: string[];
  target_demographics: string[];
  physical_properties?: Record<string, unknown>;
  quantity_unit: string;
  food_properties?: Record<string, unknown>;
  medical_properties?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  learning?: Record<string, unknown>;
}

export interface ApiIncidentArchetypeUpdate {
  name?: string;
  description?: string;
  field_schema?: ApiFieldSchemaItem[];
  urgency_rules?: ApiUrgencyRuleItem[];
  implications?: Record<string, unknown>;
  default_report_urgency?: UrgencyLevel;
}

export interface ApiInventoryArchetypeUpdate {
  name?: string;
  description?: string;
  field_schema?: ApiFieldSchemaItem[];
  urgency_rules?: ApiUrgencyRuleItem[];
  resolves_needs?: string[];
  target_demographics?: string[];
  physical_properties?: Record<string, unknown>;
  quantity_unit?: string;
  food_properties?: Record<string, unknown>;
  medical_properties?: Record<string, unknown>;
  brand?: Record<string, unknown>;
  learning?: Record<string, unknown>;
}

export interface ApiInventoryResponse {
  id: string;
  archetype_id: string;
  quantity: number;
  location_lat: number;
  location_lng: number;
  location_address?: string;
  status: InventoryStatus;
  archetype_values: Record<string, unknown>;
  disaster_id?: string;
  assigned_to?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiInventoryCreate {
  archetype_id: string;
  quantity: number;
  location_lat: number;
  location_lng: number;
  location_address?: string;
  status?: InventoryStatus;
  archetype_values?: Record<string, unknown>;
  disaster_id?: string;
  assigned_to?: string;
  notes?: string;
}

export interface ApiInventoryUpdate {
  quantity?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  status?: InventoryStatus;
  archetype_values?: Record<string, unknown>;
  disaster_id?: string;
  assigned_to?: string;
  notes?: string;
}

export interface ApiEntityResponse {
  id: string;
  name: string;
  type: string;
  logo_url?: string;
  description?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiEntityUpdate {
  name?: string;
  logo_url?: string;
  description?: string;
  website?: string;
}

export interface ApiEmployeeResponse {
  id: string;
  full_name: string;
  email: string;
  entity_id: string;
  role: EmployeeRole;
  enabled: boolean;
  created_at: string;
  last_login_at?: string;
}

export interface ApiEmployeeCreate {
  full_name: string;
  email: string;
  role: EmployeeRole;
}

export interface ApiEmployeeUpdate {
  full_name?: string;
  role?: EmployeeRole;
  enabled?: boolean;
}

export interface ApiMagicLinkRequest {
  email: string;
  base_url?: string;
}

export interface ApiMagicLinkResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface ApiLoginResponse {
  success: boolean;
  session?: {
    token: string;
    user_id: string;
    entity_id: string;
    role: EmployeeRole;
    expires_at: string;
  };
  error?: string;
}

export interface ApiCurrentUserResponse {
  id: string;
  full_name: string;
  email: string;
  role: EmployeeRole;
  entity: ApiEntityResponse;
}

export interface ApiSuccessResponse {
  success: boolean;
  message: string;
}

export interface ApiUrgencyResult {
  urgency: string;
  reason: string;
}
