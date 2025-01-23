"use client";

import React from "react";

import OutsideClickHandler from "./OutsideClickHandler";
import { useModal } from "@/app/_contexts/ModalContext";
import Settings from "../Settings";

const Modal: React.FC<{}> = () => {
  const { currentModal, closeModal } = useModal();

  // if (!currentModal) return null;

  return (
    <OutsideClickHandler onOutsideClick={closeModal} exceptionRefs={[]}>
      <div className="z-50 h-screen w-screen fixed top-0 left-0 bg-red-500/50 flex justify-center items-center">
        {/* {currentModal} */}
        <Settings />
      </div>
    </OutsideClickHandler>
  );
};

export default Modal;
