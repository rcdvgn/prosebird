"use client";

import React from "react";

import OutsideClickHandler from "./OutsideClickHandler";
import { useModal } from "@/app/_contexts/ModalContext";
import Settings from "../modals/Settings";

const Modal: React.FC<{}> = () => {
  const { currentModal, closeModal } = useModal();

  if (!currentModal) return null;

  return (
    <div
      className="z-50 h-screen w-screen fixed top-0 left-0 bg-background/25 backdrop-blur-md
 flex justify-center items-center"
    >
      <OutsideClickHandler onOutsideClick={closeModal} exceptionRefs={[]}>
        {currentModal?.content}
      </OutsideClickHandler>
    </div>
  );
};

export default Modal;
