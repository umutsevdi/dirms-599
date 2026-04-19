export interface Coordinates {
  lat: number;
  lng: number;
  address: string; // Human readable address
}

export interface Disaster {
  id: string;
  type: string;
  location: Coordinates;
  address: string;
  severity: "low" | "moderate" | "critical";
  status: "active" | "contained" | "resolved";
  timestamp: string;
  description: string;
  affectedRadius?: number;
}

export interface Resource {
  id: string;
  type: string;
  location: Coordinates;
  status: "available" | "deployed" | "maintenance";
  quantity: number;
  assignedDisaster?: string;
}

export interface MapMarker {
  id: string;
  position: Coordinates;
  type: "disaster" | "resource" | "people";
  popupContent?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  resolves: string[]; // e.g., ["Medical", "Water", "Food"]
  group?: InventoryGroup; // e.g., "baby", "women", "elderly", etc.
}

export type InventoryGroup =
  | "baby"
  | "child"
  | "adult"
  | "elderly"
  | "women"
  | "general";

export interface Need {
  label: string;
  priority: number;
}

export interface PeopleReport {
  id: string;
  reporter: {
      name: string;
      phoneNumber?: string;
      contactMethod?: string;
      contactDetails?: string;
  };
  location: Coordinates;
  needs: Need[];
  counts: {
    baby: number;
    child: number;
    adult: number;
    elderly: number;
  };
  genderCounts: {
    women: number;
  };
  statusCounts: {
    missing: number;
    injured: number;
    disabled: number;
    bedridden: number;
    chronicDisease: Record<string, number>; // Chronic Disease type - count map
  };
  details: string;
  timestamp: string;
  disasterId?: string;
}
