"use client";

import React, { createContext, useContext, useRef, useCallback } from "react";
import { usePresentation } from "./PresentationContext"; // Import the existing context

// Create the context
const ScrollContext = createContext<any>(null);

export function ScrollProvider({ children }: any) {
  // These refs will be initialized by components when they mount
  const scrollContainerRef = useRef<any>(null);
  const scriptContainerRef = useRef<any>(null);
  const scrollThumbRef = useRef<any>(null);

  // Get totalDuration and setIsAutoscrollOn from the existing PresentationContext
  const { totalDuration, setIsAutoscrollOn } = usePresentation();

  // Register functions to set references from different components
  const registerScrollContainer = useCallback((ref: any) => {
    scrollContainerRef.current = ref;
  }, []);

  const registerScriptContainer = useCallback((ref: any) => {
    scriptContainerRef.current = ref;
  }, []);

  const registerScrollThumb = useCallback((ref: any) => {
    scrollThumbRef.current = ref;
  }, []);

  // The scrollToTimestamp function with access to all necessary refs
  const scrollToTimestamp = useCallback(
    (timestamp: any) => {
      // Ensure timestamp is a number
      const numericTimestamp =
        typeof timestamp === "string" ? parseFloat(timestamp) : timestamp;

      if (isNaN(numericTimestamp)) {
        console.error("Invalid timestamp format. Expected a number.");
        return;
      }

      // Turn off auto-scroll
      setIsAutoscrollOn(false);

      // Check if all required elements are available
      if (
        !scrollThumbRef.current ||
        !scriptContainerRef.current ||
        !scrollContainerRef.current
      ) {
        console.error("Required DOM elements not available");
        return;
      }

      const scrollContainerHeight = scrollContainerRef.current.clientHeight;
      const scriptContainerHeight = scriptContainerRef.current.scrollHeight;

      // Calculate scroll ratio based on timestamp and total duration
      const scrollRatio = Math.min(numericTimestamp / totalDuration, 1); // Ensure we don't exceed 1

      // Calculate new positions
      const newThumbTop =
        scrollRatio *
        (scrollContainerHeight - scrollThumbRef.current.offsetHeight);
      const newScriptTop =
        -scrollRatio * (scriptContainerHeight - scrollContainerHeight);

      // Update the scrollThumb and scriptContainer positions
      scrollThumbRef.current.style.top = `${newThumbTop}px`;
      scriptContainerRef.current.style.top = `${newScriptTop}px`;
    },
    [totalDuration, setIsAutoscrollOn]
  );

  // Value object to be provided by the context
  const value: any = {
    scrollToTimestamp,
    registerScrollContainer,
    registerScriptContainer,
    registerScrollThumb,
  };

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}

// Custom hook to use the ScrollContext
export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === null) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
}
