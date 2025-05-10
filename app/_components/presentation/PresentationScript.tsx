"use client";
import { PauseIcon, PlayIcon, ResizeIcon } from "@/app/_assets/icons";
import ProfilePicture from "../ProfilePicture";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";
import { usePresentation } from "@/app/_contexts/PresentationContext";
import getTimestampFromPosition from "@/app/_utils/getTimestampFromPosition";

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
  wordsWithTimestamps,
  chaptersWithTimestamps,
  speaker,
  timer,
  progress,
  handleJump,
}: any) => {
  // useEffect(() => {
  //   console.log(chaptersWithTimestamps);
  // }, [chaptersWithTimestamps]);

  return (
    <>
      {Object.entries(chaptersWithTimestamps).map(
        ([chapterIndex, chapterData]: any, scopedIndex: any) => {
          return (
            <div key={chapterIndex} className="">
              <ChapterTitle
                title={chapterData.title}
                speaker={speaker}
                timer={timer}
              />

              <div className="px-3 text-nowrap">
                {wordsWithTimestamps &&
                  Object.values(wordsWithTimestamps)
                    .map((line: any, lineIndex: any) => {
                      return line[0].chapterIndex === scopedIndex ? (
                        <div key={lineIndex} className="">
                          {line.map((wordObject: any, wordIndex: any) => (
                            <span
                              key={wordIndex}
                              style={{
                                lineHeight: "160%",
                                fontSize: "36px",
                              }}
                              onClick={() => handleJump(wordObject.position)}
                              className={`cursor-pointer font-bold ${
                                wordObject.position <
                                wordsWithTimestamps[progress.line][
                                  progress.index
                                ].position
                                  ? "text-brand"
                                  : "text-primary/30 hover:text-primary"
                              }`}
                            >
                              {wordIndex === 0
                                ? wordObject.word
                                : " " + wordObject.word}
                            </span>
                          ))}
                        </div>
                      ) : null;
                    })
                    .filter(Boolean)}
              </div>
            </div>
          );
        }
      )}
    </>
  );
};

const PresentationScript = ({
  timer,
  handleTimeChange,
  scrollContainer,
  scriptContainer,
}: any) => {
  const {
    progress,
    containerWidth,
    setContainerWidth,
    wordsWithTimestamps,
    setIsAutoscrollOn,
    speaker,
    chaptersWithTimestamps,
  } = usePresentation();

  const [isResizing, setIsResizing] = useState<any>(null);

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

  const handleResizeStart = ({ e, dir, ref }: any) => {
    setIsResizing(dir);
  };

  const handleResizeStop = (d: any) => {
    setIsResizing(null);
    setContainerWidth(containerWidth + d.width);
  };

  return (
    <div
      ref={scrollContainer}
      className="bg-middleground h-full grow flex items-start justify-center"
    >
      <Resizable
        handleStyles={{
          top: { display: "none" },
          bottom: { display: "none" },
          topRight: { display: "none" },
          topLeft: { display: "none" },
          bottomLeft: { display: "none" },
          bottomRight: { display: "none" },
          right: {
            width: "56px",
            cursor: "auto",
            opacity: isResizing === "left" ? "0" : "", // Remove the "1" to let CSS handle it
          },
          left: {
            width: "56px",
            cursor: "auto",
            opacity: isResizing === "right" ? "0" : "", // Remove the "1" to let CSS handle it
          },
        }}
        handleClasses={{
          left: "resizable-handle-container resizable-handle-container-left",
          right: "resizable-handle-container resizable-handle-container-right",
        }}
        handleComponent={{
          left: <ResizeHandle />,
          right: <ResizeHandle />,
        }}
        size={{ width: containerWidth }}
        onResizeStart={(e: any, dir: any, ref: any) => {
          handleResizeStart({ e, dir, ref });
          // Add this line to add a class to the container during resize
          ref.classList.add("resizing-active");
        }}
        onResizeStop={(e: any, dir: any, ref: any, d: any) => {
          handleResizeStop(d);
          // Remove the class when done resizing
          ref.classList.remove("resizing-active");
        }}
        maxWidth={
          scrollContainer.current ? scrollContainer.current.clientWidth : ""
        }
        className="resizable-script"
      >
        <div className="relative overflow-hidden h-full w-full">
          <div
            ref={scriptContainer}
            className="absolute w-full text-left m-auto right-0 select-none"
          >
            {chaptersWithTimestamps && (
              <ScriptChapters
                wordsWithTimestamps={wordsWithTimestamps}
                chaptersWithTimestamps={chaptersWithTimestamps}
                speaker={speaker}
                timer={timer}
                progress={progress}
                handleJump={handleJump}
              />
            )}
          </div>

          <div className="absolute w-full h-[150px] bottom-0 left-0 bg-gradient-to-t from-middleground to-middleground/0"></div>
        </div>
      </Resizable>
    </div>
  );
};

export default PresentationScript;

const ResizeHandle = () => {
  return (
    <div className="shrink-0 rounded-full h-9 w-9 grid place-items-center text-inactive hover:text-primary bg-background cursor-pointer">
      <ResizeIcon className="h-4" />
    </div>
  );
};
