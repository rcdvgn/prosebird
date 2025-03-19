"use client";

import { useEffect, useState, useRef } from "react";
// import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";
import { PlayIcon } from "../_assets/icons";
import formatTimestamp from "../_utils/formatTimestamp";
import { usePresentation } from "../_contexts/PresentationContext";
import getTimestampFromPosition from "../_utils/getTimestampFromPosition";
import { xor } from "lodash";

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
    presentation,
    wordsWithTimestamps,
    chaptersWithTimestamps,
  } = usePresentation();
  // const { isAutoscrollOn, setIsAutoscrollOn } = useAutoscroll();

  const progressContainer = useRef<HTMLDivElement | null>(null);

  const [hoverElapsedTime, setHoverElapsedTime] = useState<any>(null);

  const handleEngageAutoScroll = () => {
    if (isAutoscrollOn || isSeeking) return;
    setIsAutoscrollOn(true);
  };

  const calculateChapterProgressWidth = (
    initialT: any,
    nextT: any,
    elapsedTime: any
  ) => {
    if (elapsedTime >= nextT) return 100;
    if (elapsedTime < initialT) return 0;

    const relativeElapsedTime = elapsedTime - initialT;
    const chapterLength = nextT - initialT;

    return (relativeElapsedTime * 100) / chapterLength;
  };

  useEffect(() => {
    // Handle dragging (mouse down) for seeking.
    const handleMouseDown = (e: MouseEvent) => {
      if (!progressContainer.current) return;

      setIsSeeking(true);
      setIsAutoscrollOn(true);

      const progressBarRect = progressContainer.current.getBoundingClientRect();
      const maxRight = progressBarRect.width;

      let newElapsedTime = elapsedTime;

      const updateProgressBar = (clientX: number) => {
        const newRightPx = Math.max(
          0,
          Math.min(progressBarRect.right - clientX, maxRight)
        );
        const newRightPercent = (newRightPx / maxRight) * 100;

        newElapsedTime = (1 - newRightPercent / 100) * totalDuration;
        handleTimeChange(newElapsedTime);
      };

      updateProgressBar(e.clientX); // Initial setting

      const handleMouseMove = (e: MouseEvent) => {
        updateProgressBar(e.clientX);
      };

      const handleMouseUp = (e: MouseEvent) => {
        setIsSeeking(false);
        // Reset elapsed time to last known value
        handleTimeChange(newElapsedTime);

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    // Handle hover movement when the mouse is not down.
    const handleMouseHover = (e: MouseEvent) => {
      // Only update hover state when no buttons are pressed.
      if (e.buttons !== 0) return;
      if (!progressContainer.current) return;

      const progressBarRect = progressContainer.current.getBoundingClientRect();
      const maxRight = progressBarRect.width;

      const newRightPx = Math.max(
        0,
        Math.min(progressBarRect.right - e.clientX, maxRight)
      );
      const newRightPercent = (newRightPx / maxRight) * 100;
      const newHoverElapsedTime = (1 - newRightPercent / 100) * totalDuration;
      setHoverElapsedTime(newHoverElapsedTime);
    };

    // Reset hover elapsed time when the mouse leaves the container.
    const handleMouseLeave = () => {
      setHoverElapsedTime(null);
    };

    if (progressContainer.current) {
      progressContainer.current.addEventListener("mousedown", handleMouseDown);
      progressContainer.current.addEventListener("mousemove", handleMouseHover);
      progressContainer.current.addEventListener(
        "mouseleave",
        handleMouseLeave
      );
    }

    return () => {
      if (progressContainer.current) {
        progressContainer.current.removeEventListener(
          "mousedown",
          handleMouseDown
        );
        progressContainer.current.removeEventListener(
          "mousemove",
          handleMouseHover
        );
        progressContainer.current.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      }
    };
  }, [totalDuration, handleTimeChange, setIsSeeking, setHoverElapsedTime]);

  return (
    <div className="px-[7px] w-full absolute left-0 bottom-0">
      {/* <div className="text-primary font-semibold text-sm">
        {formatTimestamp(elapsedTime)} / {formatTimestamp(totalDuration)}
      </div> */}
      <div
        ref={progressContainer}
        className="flex items-center justify-between h-[18px]"
      >
        {chaptersWithTimestamps &&
          totalDuration &&
          (() => {
            const chapterKeys = Object.keys(chaptersWithTimestamps);
            return chapterKeys.map((chapterKey, scopedIndex) => {
              const chapterData = chaptersWithTimestamps[chapterKey];

              const isLastChapter = scopedIndex === chapterKeys.length - 1;
              const isFirstChapter = scopedIndex === 0 ? true : false;

              const nextTimestamp = isLastChapter
                ? totalDuration
                : chaptersWithTimestamps[chapterKeys[scopedIndex + 1]]
                    .timestamp;

              const chapterDuration = nextTimestamp - chapterData.timestamp;

              const pbWidth = (100 * chapterDuration) / totalDuration;

              const gapTax =
                0 + (isLastChapter ? 0 : 1) + (isFirstChapter ? 0 : 1);

              return (
                <div
                  key={chapterKey}
                  style={{ width: `calc(${pbWidth}% - ${gapTax}px)` }}
                  className="scale-y-[-1] h-full group/progressBar cursor-pointer"
                >
                  <div className="relative h-1 bg-progressbar-inactive group-hover/progressBar:h-2 transition-all ease-in-out duration-150 group-hover/progressBar:translate-y-[-2px]">
                    {/* chapterHover */}
                    {hoverElapsedTime && (
                      <div
                        style={{
                          width: `${calculateChapterProgressWidth(
                            chapterData.timestamp,
                            nextTimestamp,
                            hoverElapsedTime
                          )}%`,
                        }}
                        className="absolute top-0 left-0 h-full bg-progressbar-hover w-full"
                      ></div>
                    )}

                    {/* chapterProgress */}
                    <div
                      style={{
                        width: `${calculateChapterProgressWidth(
                          chapterData.timestamp,
                          nextTimestamp,
                          elapsedTime
                        )}%`,
                      }}
                      className="absolute top-0 left-0 h-full bg-primary w-full"
                    ></div>
                  </div>
                </div>
              );
            });
          })()}

        {/* <div
          ref={progressBar}
          className="w-full h-2 absolute bottom-[-2px] bg-brand"
        ></div> */}
      </div>

      {/* <button
        style={{ display: !isAutoscrollOn && !isSeeking ? "flex" : "none" }}
        onClick={handleEngageAutoScroll}
        ref={autoScrollButton}
        className="absolute bg-brand py-2 px-1.5 rounded-lg border-none outline-none cursor-pointer -translate-x-1/2 bottom-4 items-center justify-center"
      >
        <PlayIcon className="text-primary w-[8px]" />
        <span className="text-[11px] font-semibold text-primary text-nowrap">
          Jump Here
        </span>
      </button> */}
    </div>
  );
}

{
  /* <div className="h-1 w-full relative mt-auto overflow-x-hidden group-hover/progressBar:h-2 transition-all ease-in-out duration-100 flex items-center justify-between rounded-full">
          <div
            ref={progressBar}
            className="w-full h-full absolute top-0 bg-brand rounded-full"
          ></div>
        </div> */
}
