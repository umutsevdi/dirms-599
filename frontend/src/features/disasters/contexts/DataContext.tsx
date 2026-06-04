import { createContext, useContext, type ReactNode } from "react";
import type { Disaster } from "../types/disasters.types";
import { useIncidents } from "../hooks/useIncidents";

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
  const { items: disasters, saveItem, refresh } = useIncidents();

  const setDisasters = (
    value: Disaster[] | ((prev: Disaster[]) => Disaster[])
  ) => {
    if (typeof value === "function") {
      const updater = value as (prev: Disaster[]) => Disaster[];
      const current = disasters;
      const next = updater(current);
      next.forEach((d) => saveItem(d));
    } else {
      value.forEach((d) => saveItem(d));
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
