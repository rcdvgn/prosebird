"use client";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Scrollbar from "./Scrollbar";
// import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";
import { usePresentation } from "../_contexts/PresentationContext";
import getTimestampFromPosition from "../_utils/getTimestampFromPosition";
import Draggable from "react-draggable";
import { ResizeIcon } from "../_assets/icons";

export default function ScriptContainer({
  handleTimeChange,
}: {
  handleTimeChange: any;
}) {
  const {
    progress,
    containerWidth,
    setContainerWidth,
    elapsedTime,
    totalDuration,
    wordsWithTimestamps,
    isAutoscrollOn,
    setIsAutoscrollOn,
  } = usePresentation();

  // const { isAutoscrollOn, setIsAutoscrollOn } = useAutoscroll();
  const [maxDelta, setMaxDelta] = useState<any>(null);

  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [tempContainerWidth, setTempContainerWidth] =
    useState<any>(containerWidth);

  const initialPosition = { x: 0, y: 0 };
  const [draggablePositionLeft, setDraggablePositionLeft] =
    useState<any>(initialPosition);
  const [draggablePositionRight, setDraggablePositionRight] =
    useState<any>(initialPosition);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [bounds, setBounds] = useState({ left: 0, right: 0 });

  const leftDraggableRef = useRef<HTMLDivElement>(null);
  const rightDraggableRef = useRef<HTMLDivElement>(null);

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

    if (
      wordsWithTimestamps[progress.line][progress.index].position !==
      newPosition
    ) {
      const newElapsedTime = getTimestampFromPosition(
        wordsWithTimestamps,
        newPosition
      );
      handleTimeChange(newElapsedTime);
    }
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

  const handleStartDrag = (e: any, data: any) => {
    setIsDragging(true);

    const scrollWidth = scrollContainer.current!.offsetWidth;
    const scriptWidth = scriptContainer.current!.offsetWidth;

    const left = -1 * ((scrollWidth - scriptWidth) / 2);

    setBounds({
      right: scriptWidth / 2 - 200,
      left: left <= 0 ? left : 0,
    });
  };

  const handleDragMoveLeft = (e: any, data: any) => {
    setDraggablePositionLeft({ x: data.x, y: 0 });

    setDraggablePositionRight({
      x: draggablePositionRight.x - data.deltaX,
      y: 0,
    });

    const newWidth = tempContainerWidth + data.deltaX * -2;
    setTempContainerWidth(newWidth > 100 ? newWidth : 100);
  };

  const handleDragMoveRight = (e: any, data: any) => {
    setDraggablePositionRight({ x: data.x, y: 0 });

    setDraggablePositionLeft({
      x: draggablePositionLeft.x - data.deltaX,
      y: 0,
    });

    const newWidth = tempContainerWidth + data.deltaX * 2;
    setTempContainerWidth(newWidth > 100 ? newWidth : 100);
  };

  const handleDragStopLeft = (e: any, data: any) => {
    setDraggablePositionLeft(initialPosition);
    setDraggablePositionRight(initialPosition);

    setContainerWidth(tempContainerWidth);
    setIsDragging(false);
  };

  const handleDragStopRight = (e: any, data: any) => {
    setDraggablePositionRight(initialPosition);
    setDraggablePositionLeft(initialPosition);

    setContainerWidth(tempContainerWidth);
    setIsDragging(false);
  };

  return (
    <>
      <div
        ref={scrollContainer}
        className="group border-[1px] border-pink-500 grow h-full flex flex-col items-center shrink-0 overflow-hidden relative"
      >
        <div
          className={`border-[1px] border-blue-500 flex justify-center h-full fixed top-0 transition-opacity duration-200 ease-in-out ${
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          // style={{
          //   width: `${containerWidth}px`,
          // }}
        >
          <div className="pr-6 border-[1px] border-red-500 h-screen grid place-items-center left-0 top-0">
            <Draggable
              axis="x"
              position={draggablePositionLeft}
              onStart={handleStartDrag}
              onDrag={handleDragMoveLeft}
              onStop={handleDragStopLeft}
              bounds={bounds}
              nodeRef={leftDraggableRef}
            >
              <div
                ref={leftDraggableRef}
                className="aspect-square h-[30px] bg-brand rounded-full grid place-items-center cursor-pointer"
              >
                <ResizeIcon className="h-2.5 text-primary" />
              </div>
            </Draggable>
          </div>

          <div
            className="pointer-events-none"
            style={{
              width: `${containerWidth}px`,
            }}
          ></div>

          <div className="pl-6 border-[1px] border-red-500 h-screen grid place-items-center right-0 top-0">
            <Draggable
              axis="x"
              position={draggablePositionRight}
              onStart={handleStartDrag}
              onDrag={handleDragMoveRight}
              onStop={handleDragStopRight}
              bounds={{ left: -1 * bounds.right, right: -1 * bounds.left }}
              nodeRef={rightDraggableRef}
            >
              <div
                ref={rightDraggableRef}
                className="aspect-square h-[30px] bg-brand rounded-full grid place-items-center cursor-pointer"
              >
                <ResizeIcon className="h-2.5 text-primary" />
              </div>
            </Draggable>
          </div>
        </div>

        <div
          ref={scriptContainer}
          className="border-[1px] border-yellow-500 absolute text-left m-auto left-0 right-0"
          style={{
            width: tempContainerWidth + "px",
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
                      onClick={() => handleJump(wordObject.position)}
                      className={`transtion-all transition-100 cursor-pointer font-bold hover:opacity-100 hover:font-bold text-primary ${
                        wordObject.position <
                        wordsWithTimestamps[progress.line][progress.index]
                          .position
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
      />
    </>
  );
}
