"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OutsideClickHandler from "./OutsideClickHandler";
import { useModal } from "@/app/_contexts/ModalContext";

const Modal: React.FC = () => {
  const { currentModal, closeModal } = useModal();

  return (
    <AnimatePresence>
      {currentModal && (
        <div className="z-50 h-screen w-screen fixed top-0 left-0 bg-background/25 backdrop-blur-md flex justify-center items-center">
          <OutsideClickHandler onOutsideClick={closeModal} exceptionRefs={[]}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {currentModal?.content}
            </motion.div>
          </OutsideClickHandler>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
