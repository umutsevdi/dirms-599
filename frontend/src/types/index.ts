export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Disaster {
  id: string;
  type: string;
  location: Coordinates;
  address: string;
  severity: "low" | "medium" | "high" | "critical";
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
  type: string;
  location: Coordinates;
  status: "available" | "deployed" | "maintenance";
  quantity: number;
  assignedDisaster?: string;
}

export interface Need {
  label: string;
  priority: number;
}

export interface PeopleReport {
  id: string;
  reporter: string;
  location: Coordinates;
  address: string;
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
  };
  details: string;
  timestamp: string;
  disasterId?: string;
  phoneNumber?: string;
  contactMethod?: string;
  contactDetails?: string;
}

export interface GeocodeResult {
  address: string;
  location: Coordinates;
}
