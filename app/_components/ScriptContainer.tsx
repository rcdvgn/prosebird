"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import Scrollbar from "./Scrollbar";
import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";

export default function ScriptContainer({
  containerWidth,
  wordsWithTimestamps,
  updatePresentation,
  position,
  totalDuration,
  elapsedTime,
  handleTimeChange,
}: {
  containerWidth: any;
  wordsWithTimestamps: any;
  updatePresentation: any;
  position: any;
  totalDuration: any;
  elapsedTime: any;
  handleTimeChange: any;
}) {
  const { isAutoscrollOn, setIsAutoscrollOn } = useAutoscroll();
  const [scrollbarHeight, setScrollbarHeight] = useState(0);

  const scriptContainer = useRef<HTMLDivElement | null>(null);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const calculateScrollbarHeight = () => {
    if (scrollContainer.current && scriptContainer.current) {
      const containerHeight = scrollContainer.current.clientHeight;
      const contentHeight = scriptContainer.current.scrollHeight;

      const newScrollbarHeight =
        (containerHeight / contentHeight) * containerHeight;
      setScrollbarHeight(newScrollbarHeight);
    }
  };

  const handleJump = (newPosition: any) => {
    setIsAutoscrollOn(true);
    updatePresentation(newPosition);
  };

  const textSize = "0px"; // placeholder CHANGE LATER

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
      <div
        ref={scrollContainer}
        className="grow h-full flex flex-col items-center ring-1 ring-blue-500  shrink-0 overflow-hidden relative"
      >
        <div
          ref={scriptContainer}
          className="absolute border-[1px] border-red-500 text-left m-auto left-0 right-0
          "
          style={{
            width: containerWidth + "px",
          }}
        >
          {wordsWithTimestamps &&
            Object.values(wordsWithTimestamps).map(
              (line: any, lineIndex: any) => (
                <div key={lineIndex} className="">
                  {line.map((wordObject: any, wordIndex: any) => (
                    <span
                      key={wordIndex}
                      style={{
                        lineHeight: "160%",
                        fontSize: "36px",
                      }}
                      onClick={() => handleJump(wordObject.index)}
                      className={`transtion-all transition-100 cursor-pointer font-medium hover:opacity-100 hover:font-semibold ${
                        wordObject.index < position
                          ? "opacity-100"
                          : "opacity-40 medium"
                      }`}
                    >
                      {wordIndex === 0
                        ? wordObject.word
                        : " " + wordObject.word}
                    </span>
                  ))}
                </div>
              )
            )}
        </div>
      </div>
      <Scrollbar
        calculateScrollbarHeight={calculateScrollbarHeight}
        scrollContainer={scrollContainer}
        scriptContainer={scriptContainer}
        scrollbarHeight={scrollbarHeight}
        elapsedTime={elapsedTime}
        totalDuration={totalDuration}
      />
    </>
  );
}
