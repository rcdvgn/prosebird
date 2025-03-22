"use client";
import { Resizable } from "re-resizable";

import React, { useState, useRef, useLayoutEffect } from "react";
import Scrollbar from "./Scrollbar";
import { usePresentation } from "../_contexts/PresentationContext";

import ProgressBar from "./ProgressBar";
import PresentationScript from "./presentation/PresentationScript";
import PresentationRightSideControls from "./presentation/PresentationRightSideControls";
import PresentationLeftSideControls from "./presentation/PresentationLeftSideControls";
import SideView from "./presentation/SideView";
import { useScroll } from "../_contexts/ScrollNavigationContext";

export default function PresentationMain({
  handleTimeChange,
  timer,
}: {
  handleTimeChange: any;
  timer: any;
}) {
  const { elapsedTime, totalDuration, wordsWithTimestamps, isAutoscrollOn } =
    usePresentation();

  const [scrollbarHeight, setScrollbarHeight] = useState(0);

  const scriptContainer = useRef<any>(null);
  const scrollContainer = useRef<any>(null);
  const { registerScrollContainer, registerScriptContainer } = useScroll();

  const calculateScrollbarHeight = () => {
    if (scrollContainer.current && scriptContainer.current) {
      const containerHeight = scrollContainer.current.clientHeight;
      const contentHeight = scriptContainer.current.scrollHeight;

      const newScrollbarHeight =
        (containerHeight / contentHeight) * containerHeight;
      setScrollbarHeight(newScrollbarHeight);
    }
  };

  const textSize = "0px"; // placeholder CHANGE LATER

  useLayoutEffect(() => {
    if (scrollContainer.current) {
      registerScrollContainer(scrollContainer.current);
    }
    if (scriptContainer.current) {
      registerScriptContainer(scriptContainer.current);
    }
  }, [registerScrollContainer, registerScriptContainer]);

  useLayoutEffect(() => {
    calculateScrollbarHeight();
  }, [wordsWithTimestamps, textSize]);

  useLayoutEffect(() => {
    if (scriptContainer.current && isAutoscrollOn) {
      const progressPercentage =
        (elapsedTime / totalDuration) * scriptContainer.current.clientHeight;
      scriptContainer.current.style.top = `-${progressPercentage}px`;
    }
  }, [elapsedTime, totalDuration, isAutoscrollOn]);

  return (
    <>
      <div className="flex h-full w-full">
        <div className="relative slate group grow h-full flex min-w-0">
          <PresentationLeftSideControls />

          <PresentationScript
            timer={timer}
            handleTimeChange={handleTimeChange}
            scrollContainer={scrollContainer}
            scriptContainer={scriptContainer}
          />

          <PresentationRightSideControls />

          <ProgressBar handleTimeChange={handleTimeChange} />

          <SyncToPresentation />

          <Scrollbar
            calculateScrollbarHeight={calculateScrollbarHeight}
            scrollContainer={scrollContainer}
            scriptContainer={scriptContainer}
            scrollbarHeight={scrollbarHeight}
          />
        </div>

        <SideView />
      </div>
    </>
  );
}

const SyncToPresentation = () => {
  const { isSeeking, isAutoscrollOn, setIsAutoscrollOn } = usePresentation();

  const handleEngageAutoScroll = () => {
    if (isAutoscrollOn || isSeeking) return;
    setIsAutoscrollOn(true);
  };

  return isAutoscrollOn ? null : (
    <div
      onClick={handleEngageAutoScroll}
      className="z-30 absolute px-5 h-11 grid place-items-center rounded-full bg-battleground ring-1 ring-stroke bottom-10 right-1/2 translate-x-1/2 cursor-pointer text-inactive hover:text-primary transition-colors duration-100 ease-in-out"
    >
      <span className="font-bold text-[13px]">Sync to presentation</span>
    </div>
  );
};
