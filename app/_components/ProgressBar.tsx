"use client";

import { useEffect, useState, useRef } from "react";
// import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";
import { PlayIcon } from "../_assets/icons";
import formatTimestamp from "../_utils/formatTimestamp";
import { usePresentation } from "../_contexts/PresentationContext";

export default function ProgressBar({
  handleTimeChange,
}: {
  handleTimeChange: (newTime: number) => void;
}) {
  const {
    totalDuration,
    elapsedTime,
    isSeeking,
    setIsSeeking,
    isAutoscrollOn,
    setIsAutoscrollOn,
  } = usePresentation();
  // const { isAutoscrollOn, setIsAutoscrollOn } = useAutoscroll();

  const progressContainer = useRef<HTMLDivElement | null>(null);
  const progressBar = useRef<HTMLDivElement | null>(null);
  const autoScrollButton = useRef<HTMLButtonElement | null>(null);

  const handleEngageAutoScroll = () => {
    if (isAutoscrollOn || isSeeking) return;
    setIsAutoscrollOn(true);
  };

  useEffect(() => {
    const progressPercentage = (elapsedTime / totalDuration) * 100;
    if (!isSeeking && progressBar.current && progressContainer.current) {
      progressBar.current.style.right = `${100 - progressPercentage}%`;
    }
    if (autoScrollButton.current) {
      autoScrollButton.current.style.left = `${progressPercentage}%`;
    }
  }, [elapsedTime, totalDuration, isSeeking]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!progressBar.current || !progressContainer.current) return;

      setIsSeeking(true);
      setIsAutoscrollOn(true);

      const progressBarRect = progressContainer.current.getBoundingClientRect();
      const maxRight = progressBarRect.width;

      let newElapsedTime = elapsedTime; // Keep track of the updated elapsed time locally

      const updateProgressBar = (clientX: number) => {
        const newRightPx = Math.max(
          0,
          Math.min(progressBarRect.right - clientX, maxRight)
        );
        const newRightPercent = (newRightPx / maxRight) * 100;
        progressBar.current!.style.right = `${newRightPercent}%`;

        // const newElapsedTime = (1 - newRight / maxRight) * totalDuration;
        newElapsedTime = (1 - newRightPercent / 100) * totalDuration;
        handleTimeChange(newElapsedTime);
      };

      updateProgressBar(e.clientX); // Initial setting

      const handleMouseMove = (e: MouseEvent) => {
        updateProgressBar(e.clientX);
      };

      const handleMouseUp = (e: MouseEvent) => {
        setIsSeeking(false);

        // this is just seting the elapsed time back to what it was before started seeking
        handleTimeChange(newElapsedTime);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    if (progressContainer.current) {
      progressContainer.current.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (progressContainer.current) {
        progressContainer.current.removeEventListener(
          "mousedown",
          handleMouseDown
        );
      }
    };
  }, [totalDuration, handleTimeChange, setIsSeeking]);

  return (
    <div className="mx-6 translate-y-[2px]">
      <div className="text-text-primary font-semibold text-sm py-1">
        {formatTimestamp(elapsedTime)} / {formatTimestamp(totalDuration)}
      </div>
      <div ref={progressContainer} className="flex cursor-pointer h-[10px]">
        <div className="h-2.5 w-full rounded-full relative mt-auto overflow-x-hidden">
          <div
            ref={progressBar}
            className="w-full h-full absolute top-0 bg-brand"
          ></div>
        </div>
      </div>

      <button
        style={{ display: !isAutoscrollOn && !isSeeking ? "flex" : "none" }}
        onClick={handleEngageAutoScroll}
        ref={autoScrollButton}
        className="absolute bg-brand py-2 px-1.5 rounded-lg border-none outline-none cursor-pointer -translate-x-1/2 bottom-[10px] items-center justify-center"
      >
        <PlayIcon className="fill-text-primary w-[8px]" />
        <span className="text-[11px] font-semibold text-text-primary text-nowrap">
          Jump Here
        </span>
      </button>
    </div>
  );
}
