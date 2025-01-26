"use client";

import React from "react";

import OutsideClickHandler from "./OutsideClickHandler";
import { useModal } from "@/app/_contexts/ModalContext";
import Settings from "../modals/Settings";

const Modal: React.FC<{}> = () => {
  const { currentModal, closeModal } = useModal();

  if (!currentModal) return null;

  return (
    <div className="z-50 h-screen w-screen fixed top-0 left-0 bg-red-500/50 flex justify-center items-center">
      <OutsideClickHandler onOutsideClick={closeModal} exceptionRefs={[]}>
        {currentModal}
      </OutsideClickHandler>
    </div>
  );
};

export default Modal;
