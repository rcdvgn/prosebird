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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="z-50 h-screen w-screen fixed top-0 left-0 bg-background/25 backdrop-blur-md flex justify-center items-center"
        >
          <OutsideClickHandler onOutsideClick={closeModal} exceptionRefs={[]}>
            <div>{currentModal?.content}</div>
          </OutsideClickHandler>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import OutsideClickHandler from "./OutsideClickHandler";
// import { useModal } from "@/app/_contexts/ModalContext";

// const Modal: React.FC = () => {
//   const { currentModal, closeModal } = useModal();

//   if (!currentModal) return null;

//   return (
//     <div className="z-50 h-screen w-screen fixed top-0 left-0 bg-background/25 backdrop-blur-md flex justify-center items-center">
//       <OutsideClickHandler onOutsideClick={closeModal} exceptionRefs={[]}>
//         {currentModal?.content}
//       </OutsideClickHandler>
//     </div>
//   );
// };

// export default Modal;
