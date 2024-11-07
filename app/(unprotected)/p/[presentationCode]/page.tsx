"use client";
import "regenerator-runtime/runtime";
import ProgressBar from "@/app/_components/ProgressBar";
import { useTimer } from "react-use-precision-timer";
import getTimestampFromIndex from "@/app/_utils/getTimestampFromIndex";
import PlayPauseButton from "@/app/_components/PlayPauseButton";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";
import { pusherClient } from "@/app/_config/pusher";
import calculateTimestamps from "@/app/_lib/addTimestamps";
import Scrollbar from "@/app/_components/Scrollbar";
import getLineFromIndex from "@/app/_utils/getLineFromIndex";

export default function Page({
  params,
}: {
  params: { presentationCode: string };
}) {
  const { presentationCode } = params;
  // const { script } = useScriptEditor();
  // const scriptData = script.data;
  const { user } = useAuth();

  const [scrollMode, setScrollMode] = useState<any>("continuous");
  const [continuousElapsedTime, setContinuousElapsedTime] = useState<any>(0);
  const [presentation, setPresentation] = useState<any>(null);
  const [wordsWithTimestamps, setWordsWithTimestamps] = useState<any>(null);
  const [containerWidth, setContainerWidth] = useState<any>(520);
  const [speedMultiplier, setSpeedMultiplier] = useState<any>(1);
  const [totalDuration, setTotalDuration] = useState<any>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const elapsedTime =
    scrollMode === "continuous"
      ? continuousElapsedTime
      : wordsWithTimestamps
      ? getTimestampFromIndex(wordsWithTimestamps, position)
      : null;

  const handleTimerExpire = () => {
    console.log("Time has expired");
  };

  const timer = useTimer(
    {
      delay: isNaN(totalDuration) ? 0 : totalDuration,
      runOnce: true,
      fireOnStart: false,
      startImmediately: false,
      speedMultiplier: speedMultiplier,
    },
    handleTimerExpire
  );

  const handleTimerRun = () => {
    if (!timer.isStarted()) {
      timer.start(Date.now() - elapsedTime);
    } else {
      timer.isRunning() ? timer.pause() : timer.resume();
    }
  };

  const handleTimeChange = (newTime: number) => {
    setContinuousElapsedTime(newTime);
    if (timer.isStarted()) {
      if (timer.isRunning()) {
        timer.start(Date.now() - newTime);
      } else {
        timer.start(Date.now() - newTime);
        timer.pause();
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer.isRunning()) {
        setContinuousElapsedTime(timer.getElapsedRunningTime());
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, [timer, isSeeking]);

  const toggleScrollMode = () => {
    if (scrollMode === "continuous") {
      if (timer.isRunning()) {
        timer.pause();
      }

      setScrollMode("dynamic");
    } else {
      const timestampFromIndex = getTimestampFromIndex(
        wordsWithTimestamps,
        position
      );
      setContinuousElapsedTime(timestampFromIndex);
      handleTimerRun();
      setScrollMode("continuous");
    }
  };

  const updatePresentation = async (targetPosition: any) => {
    try {
      const response = await fetch("/api/presentation/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presentationCode: presentationCode,
          currentPosition: position,
          targetPosition: targetPosition,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating presentation:", error);
    }
  };

  const dynamicallyUpdatePresentation = async () => {
    try {
      const response = await fetch("/api/presentation/dynamically-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presentationCode: presentationCode,
          currentPosition: position,
          words: presentation?.nodes.words,
          userId: user.id,
          transcript: transcript,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error updating presentation:", error);
    }
  };

  const {
    transcript,
    resetTranscript,
    listening,
    interimTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  useEffect(() => {
    const validatePresentation = async () => {
      try {
        const response = await fetch("/api/presentation/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ presentationCode }),
        });

        const data = await response.json();

        if (data.presentation) {
          setPresentation(data.presentation);
        } else {
          setError("Invalid or inactive presentation code.");
        }
      } catch (err) {
        console.error("Error validating presentation code:", err);
        setError("Error fetching presentation data.");
      }
    };

    validatePresentation();
  }, [presentationCode]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      alert("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!transcript || !presentation || transcript.length === 0) return;

    dynamicallyUpdatePresentation();
  }, [transcript, presentation]);

  useEffect(() => {
    if (!presentation) return;
    // console.log(presentation);

    pusherClient.subscribe(presentationCode);
    if (scrollMode === "dynamic") {
      pusherClient.bind("update-position", (newPosition: any) => {
        setPosition(newPosition);
      });
    }

    return () => {
      pusherClient.unsubscribe(presentationCode);
    };
  }, [presentation, presentationCode]);

  useEffect(() => {
    const fetchWordsWithTimestamps = async () => {
      try {
        if (presentation) {
          const { scriptWithTimestamps, totalDuration } =
            await calculateTimestamps(
              presentation.nodes.words,
              presentation.nodes.chapters,
              containerWidth,
              speedMultiplier
            );
          // console.log(scriptWithTimestamps);
          setTotalDuration(totalDuration);
          setWordsWithTimestamps(scriptWithTimestamps);
        }
      } catch (error) {
        console.error("Error fetching words with timestamps:", error);
      }
    };

    fetchWordsWithTimestamps();
  }, [presentation, containerWidth, speedMultiplier]);

  useEffect(() => {
    if (scrollMode === "continuous") {
      const nextWordLineKey = getLineFromIndex(
        wordsWithTimestamps,
        position + 1
      );

      if (nextWordLineKey) {
        if (elapsedTime >= wordsWithTimestamps[nextWordLineKey].timestamp)
          updatePresentation(position + 1);
      }
    }
  }, [elapsedTime]);

  return (
    <div className="flex relative h-full">
      <div className="w-[275px]"></div>

      <ScriptContainer
        containerWidth={containerWidth}
        wordsWithTimestamps={wordsWithTimestamps}
        updatePresentation={updatePresentation}
        position={position}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
        handleTimeChange={handleTimeChange}
      />

      <div className="w-[275px]"></div>
      <div className="w-full h-56 fixed bottom-0 bg-gradient-to-t from-background-primary to-background-primary/0 pointer-events-none"></div>
      <div className="w-full pb-[10px] px-[10px] fixed bottom-0">
        <ActionPanel
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          isSeeking={isSeeking}
          setIsSeeking={setIsSeeking}
          handleTimeChange={handleTimeChange}
          scrollMode={scrollMode}
          toggleScrollMode={toggleScrollMode}
          handleTimerRun={handleTimerRun}
          timer={timer}
        />
      </div>
    </div>
  );
}

function ActionPanel({
  elapsedTime,
  totalDuration,
  isSeeking,
  setIsSeeking,
  handleTimeChange,
  scrollMode,
  toggleScrollMode,
  handleTimerRun,
  timer,
}: {
  elapsedTime: any;
  totalDuration: any;
  isSeeking: any;
  setIsSeeking: any;
  handleTimeChange: any;
  scrollMode: any;
  toggleScrollMode: any;
  handleTimerRun: any;
  timer: any;
}) {
  return (
    <div className="flex flex-col bg-foreground-primary h-16 rounded-[10px] border-[1px] border-border">
      <ProgressBar
        elapsedTime={elapsedTime}
        totalDuration={totalDuration}
        handleTimeChange={handleTimeChange}
        isSeeking={isSeeking}
        setIsSeeking={setIsSeeking}
      />
      <div className="h-full w-full flex">
        <span>{`Scroll mode: ${scrollMode}`}</span>

        <button onClick={toggleScrollMode} className="">{`Switch to ${
          scrollMode === "continuous" ? "Dynamic" : "Continuous"
        }`}</button>

        <PlayPauseButton handleTimerRun={handleTimerRun} timer={timer} />
      </div>
    </div>
  );
}

import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";

function ScriptContainer({
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

  // const { isAutoscrollOn, setIsAutoscrollOn } = useAutoscroll()
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

  const handleJump = (newTime: any) => {
    handleTimeChange(newTime);
    setIsAutoscrollOn(true);
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
          top-0
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
                      onClick={() => updatePresentation(wordObject.index)}
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
