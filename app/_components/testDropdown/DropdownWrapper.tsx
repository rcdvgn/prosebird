// DropdownWrapper.tsx
"use client";

import React, { ReactNode, useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  Placement,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import DefaultDropdown, { DefaultDropdownProps } from "./Default";
import OutsideClickHandler from "../wrappers/OutsideClickHandler";

type PositionOption = "bottom-left" | "bottom-right" | "bottom";
type OpenOn = "click" | "hover";

export interface DropdownWrapperProps {
  type?: React.ComponentType<DefaultDropdownProps>;
  position?: PositionOption;
  options: DefaultDropdownProps["options"];
  openOn?: OpenOn;
  disabled?: boolean;
  closeOnClick?: boolean;
  isActive?: boolean | null;
  setIsActive?: any;
  metadata?: any;
  children: ReactNode;
}

export default function DropdownWrapper({
  type: DropdownComponent = DefaultDropdown,
  position = "bottom-left",
  options,
  openOn = "click",
  disabled = false,
  closeOnClick = true,
  isActive: controlledOpen = null,
  setIsActive: setControlledOpen = null,
  metadata = null,
  children,
}: DropdownWrapperProps) {
  if (disabled) return <>{children}</>;

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== null ? controlledOpen : uncontrolledOpen;
  const setOpen = (v: any) => {
    if (setControlledOpen) setControlledOpen(v);
    else setUncontrolledOpen(v);
  };

  const placementMap: Record<PositionOption, Placement> = {
    "bottom-left": "bottom-start",
    "bottom-right": "bottom-end",
    bottom: "bottom",
  };
  const placement = placementMap[position];

  const { refs, x, y, strategy } = useFloating({
    placement,
    middleware: [offset(8), flip(), shift({ padding: 5 })],
    whileElementsMounted: autoUpdate,
  });

  const triggerProps: any = {};
  if (!disabled) {
    if (openOn === "hover") {
      triggerProps.onMouseEnter = () => setOpen(true);
      triggerProps.onMouseLeave = () => setOpen(false);
    } else {
      triggerProps.onClick = () => setOpen((o: any) => !o);
    }
  }

  const trigger = (
    <div
      ref={refs.setReference}
      style={{ display: "inline-block" }}
      {...triggerProps}
    >
      {children}
    </div>
  );

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={refs.setFloating}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          className="z-[9999]"
          onClick={() => closeOnClick && setOpen(false)}
        >
          <DropdownComponent
            options={options}
            onSelect={() => {}}
            metadata={metadata}
            position={position}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (openOn === "click") {
    return (
      <OutsideClickHandler
        onOutsideClick={() => setOpen(false)}
        exceptionRefs={[refs.reference, refs.floating]}
        isActive={open}
      >
        {trigger}
        {menu}
      </OutsideClickHandler>
    );
  }

  return (
    <>
      {trigger}
      {menu}
    </>
  );
}
