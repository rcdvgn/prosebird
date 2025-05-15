// TooltipWrapper.tsx
import React, { ReactNode, useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";

// your tooltip components
import DefaultTooltip from "../tooltips/DefaultTooltip";
import AboutTooltip from "../tooltips/AboutTooltip";
import PresentationTooltip from "../tooltips/PresentationTooltip";
import OutsideClickHandler from "./OutsideClickHandler";

type Placement = "top" | "bottom" | "left" | "right";
type OpenOn = "hover" | "click";

interface TooltipWrapperProps {
  children: ReactNode;
  position?: Placement;
  tooltipType?: any;
  data: any;
  delay?: number; // seconds before show (default 0.5)
  disabled?: boolean; // if true, never open
  openOn?: OpenOn; // "hover" (default) or "click"
  className?: string;
}

export default function TooltipWrapper({
  children,
  position = "top",
  tooltipType = DefaultTooltip,
  data,
  delay = 0.5,
  disabled = false,
  openOn = "hover",
  className = "",
}: TooltipWrapperProps) {
  const [open, setOpen] = useState(false);

  // —— Floating UI setup ——
  const { refs, x, y, strategy } = useFloating({
    placement: position,
    middleware: [
      offset(16), // bigger gap
      flip(), // auto-flip on edges
      shift({ padding: 5 }), // nudge into view
    ],
    whileElementsMounted: autoUpdate,
  });

  // —— pull-away offset so it “slides in” from outside its final spot
  const pullAwayMap: Record<Placement, { x?: number; y?: number }> = {
    top: { y: 12 },
    bottom: { y: -12 },
    left: { x: 12 },
    right: { x: -12 },
  };
  const pullAway = pullAwayMap[position];

  // —— build the event props for the trigger element
  const triggerProps: Record<string, any> = {};
  if (!disabled) {
    if (openOn === "hover") {
      triggerProps.onMouseEnter = () => setOpen(true);
      triggerProps.onMouseLeave = () => setOpen(false);
    } else if (openOn === "click") {
      triggerProps.onClick = () => setOpen((o) => !o);
    }
  }

  // —— the trigger node itself
  const triggerNode = (
    <div
      className={className}
      ref={refs.setReference}
      {...triggerProps}
      // keep its bounding-box predictable even if children are inline
      // style={{ display: "inline-block" }}
    >
      {children}
    </div>
  );

  // —— the tooltip bubble
  const tooltipNode = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={refs.setFloating}
          initial={{ opacity: 0, scale: 0.9, ...pullAway }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, ...pullAway }}
          transition={{ duration: 0.2, delay, ease: "easeInOut" }}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
          className="z-[9999] pointer-events-none"
        >
          {React.createElement(tooltipType, { data })}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // —— if disabled, just render the trigger
  if (disabled) {
    return triggerNode;
  }

  // —— if click-to-open, wrap both in OutsideClickHandler
  if (openOn === "click") {
    return (
      <OutsideClickHandler
        onOutsideClick={() => setOpen(false)}
        exceptionRefs={[refs.reference, refs.floating]}
        isActive={open}
      >
        {triggerNode}
        {tooltipNode}
      </OutsideClickHandler>
    );
  }

  // —— hover-to-open (default)
  return (
    <>
      {triggerNode}
      {tooltipNode}
    </>
  );
}
