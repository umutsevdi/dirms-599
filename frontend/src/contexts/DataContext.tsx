import { createContext, useContext, useState, type ReactNode } from "react";
import type { Disaster } from "../types";

// Sample disasters data - in real app, this would come from an API
const sampleDisasters: Disaster[] = [
  {
    id: "1",
    type: "Earthquake",
    location: { lat: 38.4192, lng: 27.1287, address: "Izmir, Turkey" },
    address: "Izmir, Turkey",
    severity: "critical",
    status: "active",
    timestamp: "2026-04-15T10:30:00Z",
    description: "Magnitude 5.8 earthquake reported in Izmir region.",
    affectedRadius: 5000,
  },
  {
    id: "2",
    type: "Flood",
    location: { lat: 41.0082, lng: 28.9784, address: "Istanbul, Turkey" },
    address: "Istanbul, Turkey",
    severity: "critical",
    status: "contained",
    timestamp: "2026-04-14T08:15:00Z",
    description: "Flash flooding in low-lying areas due to heavy rainfall.",
    affectedRadius: 2000,
  },
  {
    id: "3",
    type: "Wildfire",
    location: { lat: 36.8969, lng: 30.7133, address: "Antalya, Turkey" },
    address: "Antalya, Turkey",
    severity: "moderate",
    status: "active",
    timestamp: "2026-04-13T14:45:00Z",
    description: "Forest fire spreading in mountainous region.",
    affectedRadius: 3000,
  },
  {
    id: "4",
    type: "Landslide",
    location: { lat: 40.7486, lng: 29.9243, address: "Sakarya, Turkey" },
    address: "Sakarya, Turkey",
    severity: "low",
    status: "resolved",
    timestamp: "2026-04-12T06:00:00Z",
    description: "Minor landslide on highway, road cleared.",
  },
];

interface DataContextType {
  disasters: Disaster[];
  setDisasters: (disasters: Disaster[] | ((prev: Disaster[]) => Disaster[])) => void;
}

const DataContext = createContext<DataContextType | null>(null);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [disasters, setDisastersState] = useState<Disaster[]>(sampleDisasters);

  const setDisasters = (value: Disaster[] | ((prev: Disaster[]) => Disaster[])) => {
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
