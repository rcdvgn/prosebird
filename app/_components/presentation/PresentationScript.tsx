// PresentationScript.tsx
"use client";
import React, { useRef, useState } from "react";
import { PauseIcon, PlayIcon, ResizeIcon } from "@/app/_assets/icons";
import ProfilePicture from "../ProfilePicture";
import { Resizable } from "re-resizable";
import { usePresentation } from "@/app/_contexts/PresentationContext";

const ChapterTitle = ({ speaker, timer, title }: any) => {
  return (
    <div className="z-10 sticky grid place-items-center h-20 bg-gradient-to-b from-middleground via-middleground to-transparent from-0% via-85% to-100% top-0">
      <div className="flex items-center bg-brand/15 border-[1px] border-brand/5 rounded-2xl h-14 w-full px-3 min-w-0">
        <div className="flex gap-3.5 items-center grow min-w-0">
          <ProfilePicture
            profilePictureURL={speaker?.profilePictureURL}
            displayName={speaker?.displayName || speaker?.alias}
            className="h-8"
          />

          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-bold text-brand text-sm hover:underline cursor-pointer truncate">
              {title}
            </span>
            <span className="font-semibold text-brand text-xs hover:underline cursor-pointer">
              {speaker?.displayName || speaker?.alias}
            </span>
          </div>
        </div>

        <div className="h-8 w-8 grid place-items-center rounded-[10px] bg-brand cursor-pointer shrink-0">
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

const ScriptChapters = ({
  flatWords,
  speaker,
  timer,
  progress,
  handleJump,
  timestamps,
  elapsedTime,
}: any) => {
  // useEffect(() => {
  //   console.log(chaptersWithTimestamps);
  // }, [chaptersWithTimestamps]);

  const groupedByChapter: { [chapterIndex: number]: typeof flatWords } =
    flatWords.reduce((acc: any, word: any) => {
      if (!acc[word.chapterIndex]) {
        acc[word.chapterIndex] = [];
      }
      acc[word.chapterIndex].push(word);
      return acc;
    }, {} as { [chapterIndex: number]: typeof flatWords });

  return Object.entries(groupedByChapter).map(([chapterIndex, wordsArray]) => (
    <div key={chapterIndex}>
      <ChapterTitle
        title={wordsArray[0].chapterTitle}
        speaker={speaker}
        timer={timer}
      />
      <div style={{ lineHeight: "160%", fontSize: "36px" }} className="px-3">
        {wordsArray.map(
          (
            word: any,
            wordIndex: any // Renamed wordIndex to wordIndexInChapter for clarity
          ) => (
            <span
              key={word.position}
              className={`word-span inline-block p-0 align-top cursor-pointer font-bold ${
                timestamps[word.position] < elapsedTime
                  ? "text-brand"
                  : "text-primary/30 hover:text-primary"
              }`}
              style={{
                marginRight:
                  wordIndex !== wordsArray.length - 1 ? "0.2em" : "0",
              }}
              data-word-index={word.position}
              onClick={() =>
                handleJump(word.position, timestamps[word.position])
              }
            >
              {word.word}
            </span>
          )
        )}
      </div>
    </div>
  ));
};

export default function PresentationScript({
  timer,
  handleTimeChange,
  slateHeight,
}: any) {
  const {
    flatWords,
    chaptersWithTimestamps,
    progress,
    containerWidth,
    setContainerWidth,
    speaker,
    setIsAutoscrollOn,
    timestamps,
    scriptContainer,
    elapsedTime,
  } = usePresentation();
  const [isResizing, setIsResizing] = useState<any>(null);

  // when user clicks a word
  const handleJump = (pos: number, ts: number) => {
    setIsAutoscrollOn(true);
    handleTimeChange(ts);
  };

  return (
    <div
      ref={scriptContainer}
      className="bg-middleground h-full grow flex items-start justify-center"
    >
      <Resizable
        size={{ width: containerWidth }}
        maxWidth={scriptContainer?.current?.clientWidth}
        onResizeStart={(_e, dir, ref) => {
          setIsResizing(dir);
          ref.classList.add("resizing-active");
        }}
        onResizeStop={(_e, _dir, ref, d) => {
          setIsResizing(null);
          setContainerWidth(containerWidth + d.width);
          ref.classList.remove("resizing-active");
        }}
        handleClasses={{
          left: "resizable-handle-container-left",
          right: "resizable-handle-container-right",
        }}
        handleComponent={{
          left: <ResizeHandle />,
          right: <ResizeHandle />,
        }}
        enable={{ top: false, bottom: false, left: true, right: true }}
        className="resizable-script"
      >
        <div className="relative h-full w-full">
          <div
            ref={scriptContainer}
            style={{
              paddingBottom: slateHeight ? `${slateHeight}px` : undefined,
            }}
            className="w-full text-left select-none"
          >
            {chaptersWithTimestamps && (
              <ScriptChapters
                flatWords={flatWords}
                speaker={speaker}
                timer={timer}
                progress={progress}
                handleJump={handleJump}
                timestamps={timestamps}
                elapsedTime={elapsedTime}
              />
            )}
          </div>

          <div className="absolute w-full h-[150px] bottom-0 left-0 bg-gradient-to-t from-middleground to-middleground/0"></div>
        </div>
        <div className="absolute bottom-0 w-full h-[150px] bg-gradient-to-t from-middleground to-transparent" />
      </Resizable>
    </div>
  );
}

const ResizeHandle = () => (
  <div className="h-9 w-9 grid place-items-center rounded-full bg-background cursor-pointer hover:text-primary">
    <ResizeIcon className="h-4" />
  </div>
);
