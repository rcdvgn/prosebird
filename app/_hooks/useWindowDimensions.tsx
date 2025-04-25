"use client";

import { useState, useEffect } from "react";

function getWindowDimensions() {
  // Check if window is defined (client-side)
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  // Return default values for server-side rendering
  return {
    width: 0,
    height: 0,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    // Initial call to set dimensions once mounted
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
