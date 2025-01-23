"use client";
import React, { useRef, useState, useEffect } from "react";

interface TooltipWrapperProps {
  children: React.ReactNode;
  options: {
    text: string;
    position?: "top" | "bottom" | "left" | "right";
    type?: "default" | "about";
  };
}

export default function TooltipWrapper({
  children,
  options,
}: TooltipWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const updateTooltipPosition = () => {
    if (wrapperRef.current && tooltipRef.current) {
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      switch (options.position) {
        case "top":
          setTooltipPosition({
            top: wrapperRect.top - tooltipRect.height,
            left:
              wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2,
          });
          break;
        case "bottom":
          setTooltipPosition({
            top: wrapperRect.bottom,
            left:
              wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2,
          });
          break;
        case "left":
          setTooltipPosition({
            top:
              wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2,
            left: wrapperRect.left - tooltipRect.width,
          });
          break;
        case "right":
          setTooltipPosition({
            top:
              wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2,
            left: wrapperRect.right,
          });
          break;
        default:
          setTooltipPosition({
            top: wrapperRect.top - tooltipRect.height,
            left:
              wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2,
          });
          break;
      }
    }
  };

  const types: any = { default: "tooltip-default", about: "tooltip-about" };

  useEffect(() => {
    updateTooltipPosition();
    window.addEventListener("resize", updateTooltipPosition);

    return () => {
      window.removeEventListener("resize", updateTooltipPosition);
    };
  }, [options.position]);

  return (
    <div className="relative group" ref={wrapperRef}>
      {children}
      <div
        ref={tooltipRef}
        className={`fixed z-[9999] opacity-0 group-hover:opacity-100 pointer-events-none transition-all ease-in-out delay-500 duration-200 ${
          options?.type ? types[options.type] : "tooltip-default"
        } ${
          options.position === "top"
            ? "group-hover:-translate-y-4"
            : options.position === "bottom"
            ? "group-hover:translate-y-4"
            : options.position === "left"
            ? "group-hover:-translate-x-4"
            : "group-hover:-translate-y-4"
        }`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
        }}
      >
        {options.text}
      </div>
    </div>
  );
}
