import type { Coordinates } from "../../../shared/types/common.types";

export interface Disaster {
  id: string;
  archetypeId?: string;
  type: string;
  location: Coordinates;
  address: string;
  severity: "düşük" | "orta" | "kritik";
  status: "aktif" | "kontrol-altında" | "çözüldü";
  timestamp: string;
  description: string;
  affectedRadius?: number;
  archetypeValues?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resource {
  id: string;
  type: string;
  location: Coordinates;
  status: "uygun" | "deployed" | "maintenance";
  quantity: number;
  assignedDisaster?: string;
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  type: "disaster" | "resource" | "people";
  popupContent?: string;
}

export interface IncidentArchetypeDsl {
  id: string;
  name: string;
  description?: string;
  category: string;
  source: string;
  fieldSchema: Array<{
    field: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    defaultValue?: string | number | boolean;
  }>;
  urgencyRules: Array<{
    field: string;
    operator: string;
    value: string | number | boolean;
    setUrgency: string;
    message: string;
  }>;
  implications: {
    needs?: Array<{ label: string; priority: number }>;
    demographics?: Array<{ group: string; count?: number }>;
    chronicDiseases?: Array<{ name: string; severity: string }>;
    statusCounts?: { missing?: number; injured?: number; disabled?: number; bedridden?: number };
  };
  defaultReportUrgency?: string;
  parentArchetypeId?: string;
  version: number;
}
