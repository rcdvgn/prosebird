"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of your context's value
interface ObserverContextType {
  isObserver: boolean;
  setIsObserver: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value (you can use null or a default value)
const ObserverContext = createContext<ObserverContextType | undefined>(
  undefined
);

// Create a provider component
export const ObserverProvider = ({ children }: { children: ReactNode }) => {
  const [isObserver, setIsObserver] = useState<boolean>(false);

  return (
    <ObserverContext.Provider value={{ isObserver, setIsObserver }}>
      {children}
    </ObserverContext.Provider>
  );
};

// Custom hook for using the context
export const useObserver = () => {
  const context = useContext(ObserverContext);
  if (!context) {
    throw new Error("useObserver must be used within a ObserverProvider");
  }
  return context;
};
