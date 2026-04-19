import { createContext, useContext, useState, type ReactNode } from "react";
import type { Disaster } from "../types";

// Sample disasters data - in real app, this would come from an API
// Based on 2023 Kahramanmaraş Earthquake affected areas (Adıyaman, Kilis, Hatay)
const sampleDisasters: Disaster[] = [
  {
    id: "d-1",
    type: "Damaged Hospital",
    location: { lat: 37.7645, lng: 38.6432, address: "Adıyaman, Kahta, State Hospital" },
    address: "Adıyaman, Kahta, State Hospital",
    severity: "critical",
    status: "active",
    timestamp: "2023-02-06T04:30:00Z",
    description: "Hospital building severely damaged, emergency services relocated to tent facility. ICU and surgery units non-functional.",
    affectedRadius: 1000,
  },
  {
    id: "d-2",
    type: "Collapsed School",
    location: { lat: 37.8238, lng: 37.5415, address: "Adıyaman, Gölbaşı, Primary School" },
    address: "Adıyaman, Gölbaşı, Primary School",
    severity: "critical",
    status: "active",
    timestamp: "2023-02-06T04:17:00Z",
    description: "Three-story school building completely collapsed. Search and rescue operations ongoing for potential survivors.",
    affectedRadius: 800,
  },
  {
    id: "d-3",
    type: "Broken Road",
    location: { lat: 38.0456, lng: 39.0234, address: "Adıyaman, Gerger, Main Highway" },
    address: "Adıyaman, Gerger, Main Highway D-360",
    severity: "critical",
    status: "active",
    timestamp: "2023-02-06T04:45:00Z",
    description: "Major highway connecting Gerger to Adıyaman city center collapsed at 3 points. 50m section completely unusable. Alternative mountain routes required.",
    affectedRadius: 500,
  },
  {
    id: "d-4",
    type: "Damaged Mosque",
    location: { lat: 37.8156, lng: 38.5845, address: "Adıyaman, Kahta, Central Mosque" },
    address: "Adıyaman, Kahta, Central Mosque",
    severity: "moderate",
    status: "active",
    timestamp: "2023-02-06T04:20:00Z",
    description: "Minaret collapsed onto prayer hall. Main dome cracked, building unsafe for use. Religious services suspended.",
    affectedRadius: 300,
  },
  {
    id: "d-5",
    type: "Gas Leak",
    location: { lat: 37.7345, lng: 37.6212, address: "Adıyaman, Gölbaşı, Natural Gas Pipeline" },
    address: "Adıyaman, Gölbaşı, Natural Gas Pipeline",
    severity: "critical",
    status: "contained",
    timestamp: "2023-02-06T05:00:00Z",
    description: "Major gas pipeline ruptured due to ground movement. Area evacuated within 2km radius. Fire risk mitigated, repairs pending.",
    affectedRadius: 2000,
  },
  {
    id: "d-6",
    type: "Power Outage",
    location: { lat: 38.1156, lng: 38.6876, address: "Adıyaman, Sincik, Power Substation" },
    address: "Adıyaman, Sincik, Power Substation",
    severity: "moderate",
    status: "active",
    timestamp: "2023-02-06T04:15:00Z",
    description: "Main electrical substation damaged. 15 villages without power. Generator deployment ongoing but insufficient capacity.",
    affectedRadius: 8000,
  },
  {
    id: "d-7",
    type: "Damaged Bridge",
    location: { lat: 37.6925, lng: 38.7035, address: "Adıyaman, Kahta, Atatürk Dam Bridge" },
    address: "Adıyaman, Kahta, Atatürk Dam Bridge Access Road",
    severity: "critical",
    status: "active",
    timestamp: "2023-02-06T04:25:00Z",
    description: "Bridge approach collapsed, bridge structure compromised. Only access to north bank communities severed. Ferry service being arranged.",
    affectedRadius: 1200,
  },
  {
    id: "d-8",
    type: "Contaminated Water",
    location: { lat: 37.9548, lng: 38.4523, address: "Adıyaman, Kahta, Water Treatment Plant" },
    address: "Adıyaman, Kahta, Municipal Water Treatment",
    severity: "moderate",
    status: "active",
    timestamp: "2023-02-06T06:30:00Z",
    description: "Water treatment facility damaged, filtration system offline. 8 villages receiving untreated water. Boil advisory in effect.",
    affectedRadius: 5000,
  },
  {
    id: "d-9",
    type: "Collapsed Building",
    location: { lat: 36.0865, lng: 35.9823, address: "Hatay, Samandağ, Apartment Complex" },
    address: "Hatay, Samandağ, Residential Apartment Complex",
    severity: "critical",
    status: "active",
    timestamp: "2023-02-06T04:18:00Z",
    description: "5-story residential building pancaked. 30+ residents estimated trapped. International rescue teams deployed to site.",
    affectedRadius: 600,
  },
  {
    id: "d-10",
    type: "Landslide",
    location: { lat: 36.7423, lng: 37.1389, address: "Kilis, Merkez, Mountain Road" },
    address: "Kilis, Merkez, Regional Road D-850",
    severity: "moderate",
    status: "contained",
    timestamp: "2023-02-06T05:15:00Z",
    description: "Mountain slope collapsed onto main access road. 200m section buried under debris. Heavy machinery clearing route, 48hr estimate.",
    affectedRadius: 400,
  },
];

interface DataContextType {
  disasters: Disaster[];
  setDisasters: (
    disasters: Disaster[] | ((prev: Disaster[]) => Disaster[])
  ) => void;
}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [disasters, setDisastersState] = useState<Disaster[]>(sampleDisasters);

  const setDisasters = (
    value: Disaster[] | ((prev: Disaster[]) => Disaster[])
  ) => {
    if (typeof value === "function") {
      setDisastersState((prev) => value(prev));
    } else {
      setDisastersState(value);
    }
  };

  return (
    <DataContext.Provider value={{ disasters, setDisasters }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
