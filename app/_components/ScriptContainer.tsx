"use client";
import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Scrollbar from "./Scrollbar";
// import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";
import { usePresentation } from "../_contexts/PresentationContext";
import getTimestampFromPosition from "../_utils/getTimestampFromPosition";
import Draggable from "react-draggable";
import {
  AboutIcon,
  BellIcon,
  ChaptersIcon,
  LeaveIcon,
  ParticipantsIcon,
  PauseIcon,
  PlayIcon,
  ResizeIcon,
  SearchIcon,
  SettingsIcon,
} from "../_assets/icons";
import ProfilePicture from "./ProfilePicture";
import ProgressBar from "./ProgressBar";

export default function ScriptContainer({
  handleTimeChange,
  timer,
}: {
  handleTimeChange: any;
  timer: any;
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
    speaker,
    chaptersWithTimestamps,
  } = usePresentation();

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
      <div className="relative slate group w-full h-full flex">
        <div className="h-full">
          <div className="flex items-center gap-1.5 h-20 mx-3 px-3">
            <span className="h-9 w-9 rounded-full grid place-items-center hover-bg-hover cursor-pointer">
              <span className="relative">
                <ProfilePicture
                  profilePictureURL={speaker?.profilePictureURL}
                  firstName={speaker?.firstName || speaker?.alias}
                  lastName={speaker?.lastName || null}
                  className="h-8"
                />

                <div className="absolute bottom-[2px] right-[2px] rounded-full bg-online-green h-1.5 w-1.5 ring-[3px] ring-middleground"></div>
              </span>
            </span>
            <span className="presentation-view-options">
              <BellIcon className="h-[18px]" filled={false} />
            </span>
            <span className="presentation-view-options">
              <SettingsIcon className="h-[18px]" filled={false} />
            </span>
          </div>
        </div>

        <div
          ref={scrollContainer}
          className="overflow-hidden relative h-full grow"
        >
          <div
            ref={scriptContainer}
            className="absolute text-left m-auto left-0 right-0 select-none"
            style={{
              width: tempContainerWidth + "px",
            }}
          >
            {chaptersWithTimestamps &&
              Object.entries(chaptersWithTimestamps).map(
                ([chapterIndex, chapterData]: any, scopedIndex: any) => {
                  return (
                    <div key={chapterIndex} className="">
                      <ChapterTitle speaker={speaker} timer={timer} />

                      <div className="px-3">
                        {wordsWithTimestamps &&
                          Object.values(wordsWithTimestamps)
                            .map((line: any, lineIndex: any) => {
                              return line[0].chapterIndex === scopedIndex ? (
                                <div key={lineIndex} className="">
                                  {line.map(
                                    (wordObject: any, wordIndex: any) => (
                                      <span
                                        key={wordIndex}
                                        style={{
                                          lineHeight: "160%",
                                          fontSize: "36px",
                                        }}
                                        onClick={() =>
                                          handleJump(wordObject.position)
                                        }
                                        className={`cursor-pointer font-bold ${
                                          wordObject.position <
                                          wordsWithTimestamps[progress.line][
                                            progress.index
                                          ].position
                                            ? "text-[#D23262]"
                                            : "text-primary/30 hover:text-primary"
                                        }`}
                                      >
                                        {wordIndex === 0
                                          ? wordObject.word
                                          : " " + wordObject.word}
                                      </span>
                                    )
                                  )}
                                </div>
                              ) : null;
                            })
                            .filter(Boolean)}
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>

        <div className="h-full">
          <div className="flex items-center gap-1.5 h-20 mx-3 px-3">
            <span className="presentation-view-options">
              <AboutIcon className="h-[18px]" filled={false} />
            </span>

            <span className="presentation-view-options">
              <ParticipantsIcon className="h-[18px]" filled={false} />
            </span>

            <span className="presentation-view-options">
              <ChaptersIcon className="h-[18px]" filled={false} />
            </span>

            <span className="presentation-view-options">
              <SearchIcon className="h-[18px]" filled={false} />
            </span>

            <span className="presentation-view-options hover:!bg-danger-red/15">
              <LeaveIcon className="text-danger-red h-[18px]" />
            </span>
          </div>
        </div>

        <ProgressBar handleTimeChange={handleTimeChange} />
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

const ChapterTitle = ({ speaker, timer }: any) => {
  return (
    <div className="z-10 sticky grid place-items-center h-20 bg-gradient-to-b from-middleground via-middleground to-transparent from-0% via-85% to-100% top-0">
      <div className="flex items-center bg-[#D23262]/15 border-[1px] border-[#D23262]/5 rounded-2xl h-14 w-full px-3 min-w-0">
        <div className="flex gap-3.5 items-center grow min-w-0">
          <ProfilePicture
            profilePictureURL={speaker?.profilePictureURL}
            firstName={speaker?.firstName || speaker?.alias}
            lastName={speaker?.lastName || null}
            className="h-8 ring-[1px] ring-[#D23262]"
          />

          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-bold text-[#D23262] text-sm hover:underline cursor-pointer truncate">
              The Importance of Nutrition
            </span>
            <span className="font-semibold text-[#D23262] text-xs hover:underline cursor-pointer">
              {(speaker?.firstName || speaker?.alias) +
                " " +
                (speaker?.lastName || null)}
            </span>
          </div>
        </div>

        <div className="h-8 w-8 grid place-items-center rounded-[10px] bg-[#D23262] cursor-pointer shrink-0">
          {timer.isStarted() && timer.isRunning() ? (
            <PauseIcon className="h-3.5 text-primary" />
          ) : (
            <PlayIcon className="h-3.5 text-primary translate-x-[1px]" />
          )}
        </div>
      </div>
    </div>
  );
};
