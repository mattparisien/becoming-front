'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface LocationModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const LocationModalContext = createContext<LocationModalContextType | undefined>(undefined);

export const useLocationModal = () => {
  const context = useContext(LocationModalContext);
  if (!context) {
    throw new Error("useLocationModal must be used within a LocationModalProvider");
  }
  return context;
};

export const LocationModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <LocationModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </LocationModalContext.Provider>
  );
};
