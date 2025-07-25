"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// type ModalContextType = {
//   currentModal: React.ReactNode | null;
//   openModal: (modalContent: React.ReactNode) => void;
//   closeModal: () => void;
// };

const ModalContext = createContext<any>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentModal, setCurrentModal] = useState<React.ReactNode | null>(
    null
  );

  const openModal = (modalObject: any) => {
    setCurrentModal(modalObject);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  return (
    <ModalContext.Provider value={{ currentModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
