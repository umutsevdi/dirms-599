import type { Coordinates } from "../../../shared/types/common.types";

export interface Disaster {
  id: string;
  type: string;
  location: Coordinates;
  address: string;
  severity: "düşük" | "orta" | "kritik";
  status: "aktif" | "kontrol-altında" | "çözüldü";
  timestamp: string;
  description: string;
  affectedRadius?: number;
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
