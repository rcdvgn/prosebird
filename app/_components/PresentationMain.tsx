// PresentationMain.tsx
"use client";
import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import PresentationScript from "./presentation/PresentationScript";
import PresentationLeftSideControls from "./presentation/PresentationLeftSideControls";
import PresentationRightSideControls from "./presentation/PresentationRightSideControls";
import ProgressBar from "./ProgressBar";
import SideView from "./presentation/SideView";
import { usePresentation } from "../_contexts/PresentationContext";

export default function PresentationMain({
  handleTimeChange,
  timer,
}: {
  handleTimeChange: (ms: number) => void;
  timer: any;
}) {
  const {
    elapsedTime,
    totalDuration,
    flatWords,
    progress,
    isAutoscrollOn,
    setIsAutoscrollOn,
    timestamps,
    setTimestamps,
  } = usePresentation();

  const slateRef = useRef<HTMLDivElement>(null);
  const scriptContainer = useRef<any>(null);

  const [slateHeight, setSlateHeight] = useState(0);

  // Update slateHeight on resize/layout
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (slateRef.current) setSlateHeight(slateRef.current.clientHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useLayoutEffect(() => {
    const container = slateRef.current;
    if (!container || totalDuration === 0) {
      return;
    }

    // 1. Select all word spans and sort by data-word-index
    const spans = Array.from(
      container.querySelectorAll<HTMLElement>(".word-span")
    ).sort((a, b) => {
      const indexA = Number(a.dataset.wordIndex);
      const indexB = Number(b.dataset.wordIndex);
      return indexA - indexB;
    });

    if (spans.length === 0) {
      return;
    }

    // 2. Group spans by their offsetTop (i.e., lines)
    const lines: HTMLElement[][] = [];
    let lastOffsetTop: number | undefined = undefined;
    spans.forEach((span) => {
      const offsetTop = span.offsetTop;
      if (
        lastOffsetTop === undefined ||
        Math.abs(offsetTop - lastOffsetTop) > 1
      ) {
        lines.push([span]);
        lastOffsetTop = offsetTop;
      } else {
        lines[lines.length - 1].push(span);
      }
    });

    if (lines.length === 0) {
      return;
    }

    // 3. Calculate per-line duration
    const durationPerLine = totalDuration / lines.length;

    console.log(lines);

    const newCalculatedTimestamps: number[] = [];

    lines.forEach((line, lineIndex) => {
      const lineStart = lineIndex * durationPerLine;
      const numWordsInLine = line.length;
      if (numWordsInLine === 0) return; // Skip empty lines

      line.forEach((span, wordIdxInLine) => {
        const pos = Number(span.dataset.wordIndex);
        if (isNaN(pos)) {
          console.warn("Word span found with invalid data-word-index:", span);
          return;
        }
        const ts =
          lineStart + (durationPerLine * wordIdxInLine) / numWordsInLine;
        newCalculatedTimestamps[pos] = ts;
      });
    });

    // Update the timestamps in the context with the newly calculated values.
    setTimestamps(newCalculatedTimestamps);
  }, [flatWords, totalDuration]);

  // 2️⃣ Auto‐scroll effect
  useEffect(() => {
    if (!isAutoscrollOn || !slateRef.current || !totalDuration) return;
    const container = slateRef.current;
    const maxScroll = container.scrollHeight - container.clientHeight;
    const scrollProgress = Math.min(elapsedTime / totalDuration, 1);

    let target = scrollProgress * maxScroll - 100;
    if (target < 0) target = 0;

    container.scrollTo({ top: target, behavior: "auto" });
  }, [elapsedTime, isAutoscrollOn, totalDuration]);

  // 3️⃣ Only disable on genuine user scroll
  const onScroll = (_e: React.UIEvent<HTMLDivElement>) => {
    if (isAutoscrollOn) {
      setIsAutoscrollOn(false);
    }
  };

  return (
    <div className="flex h-full w-full">
      <div
        ref={slateRef}
        className="slate group grow h-full flex min-w-0 overflow-y-auto"
      >
        {/* <PresentationLeftSideControls /> */}

        <PresentationScript
          timer={timer}
          handleTimeChange={handleTimeChange}
          slateHeight={slateHeight}
          scriptContainer={scriptContainer}
        />

        {/* <PresentationRightSideControls /> */}

        {/* <ProgressBar handleTimeChange={handleTimeChange} /> */}
        <SyncToPresentation />
      </div>
      {/* <SideView /> */}
    </div>
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
