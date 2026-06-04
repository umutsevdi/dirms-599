import type { Coordinates } from "../../../shared/types/common.types";

export interface Need {
  archetypeId: string;
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
  genderCounts: { women: number };
  servicesAccess: {
    water: boolean;
    electricity: boolean;
  };
  statusCounts: {
    missing: number;
    injured: number;
    disabled: number;
    bedridden: number;
    chronicDisease: Record<string, number>;
  };
  details: string;
  timestamp: string;
}
