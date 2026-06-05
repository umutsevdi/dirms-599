export type InventoryGroup =
  | "bebek"
  | "çocuk"
  | "yetişkin"
  | "yaşlı"
  | "kadın"
  | "genel";

export type InventoryStatus = "available" | "deployed" | "reserved" | "expired";

export interface InventoryItem {
  id: string;
  archetypeId: string;
  name: string;
  quantity: number;
  resolves: string[];
  group?: InventoryGroup;
  location?: { lat: number; lng: number; address: string };
  status?: InventoryStatus;
  archetypeValues?: Record<string, unknown>;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InventoryArchetypeDsl {
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
  resolvesNeeds: string[];
  targetDemographics: string[];
  physicalProperties?: Record<string, unknown>;
  quantityUnit: string;
  foodProperties?: Record<string, unknown>;
  medicalProperties?: Record<string, unknown>;
  parentArchetypeId?: string;
  version: number;
}
