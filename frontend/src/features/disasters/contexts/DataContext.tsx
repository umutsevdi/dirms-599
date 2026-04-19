import { createContext, useContext, useState, type ReactNode } from "react";
import type { Disaster } from "../types/disasters.types";
import { sampleDisasters } from "../../../mocks/disasters";

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
