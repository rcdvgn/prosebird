"use client";

import { useEffect, useCallback } from "react";

const useAutosizeTextArea = (
  textareaRef: HTMLTextAreaElement | null,
  value: string
) => {
  const adjustHeight = useCallback(() => {
    if (!textareaRef) return;

    // Reset height to get correct scrollHeight
    textareaRef.style.height = "0px";
    const scrollHeight = textareaRef.scrollHeight;
    textareaRef.style.height = scrollHeight + "px";
  }, [textareaRef]);

  // Adjust on value change
  useEffect(() => {
    adjustHeight();
  }, [adjustHeight, value]);

  // Adjust on window resize
  useEffect(() => {
    const handleResize = () => {
      adjustHeight();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [adjustHeight]);

  // Optional: Use ResizeObserver to detect parent container changes
  useEffect(() => {
    if (!textareaRef || !window.ResizeObserver) return;

    const resizeObserver = new ResizeObserver(() => {
      adjustHeight();
    });

    // Observe the parent container
    if (textareaRef.parentElement) {
      resizeObserver.observe(textareaRef.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [textareaRef, adjustHeight]);

  return adjustHeight; // Return the function to allow manual triggering if needed
};

export default useAutosizeTextArea;
