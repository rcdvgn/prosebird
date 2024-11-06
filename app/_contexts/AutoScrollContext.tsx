"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of your context's value
interface AutoscrollContextType {
  isAutoscrollOn: boolean;
  setIsAutoscrollOn: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value (you can use null or a default value)
const AutoscrollContext = createContext<AutoscrollContextType | undefined>(
  undefined
);

// Create a provider component
export const AutoscrollProvider = ({ children }: { children: ReactNode }) => {
  const [isAutoscrollOn, setIsAutoscrollOn] = useState<boolean>(true);

  return (
    <AutoscrollContext.Provider value={{ isAutoscrollOn, setIsAutoscrollOn }}>
      {children}
    </AutoscrollContext.Provider>
  );
};

// Custom hook for using the context
export const useAutoscroll = () => {
  const context = useContext(AutoscrollContext);
  if (!context) {
    throw new Error("useAutoscroll must be used within a AutoscrollProvider");
  }
  return context;
};
