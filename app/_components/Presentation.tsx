"use client";
import "regenerator-runtime/runtime";
import { useTimer } from "react-use-precision-timer";
import getTimestampFromPosition from "@/app/_utils/getTimestampFromPosition";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ScriptContainer from "@/app/_components/ScriptContainer";
import ActionPanel from "@/app/_components/ActionPanel";
import { usePresentation } from "../_contexts/PresentationContext";

export default function Presentation() {
  const {
    presentation,
    speaker,
    pusherChannel,
    wordsWithTimestamps,
    broadcastProgress,
    progress,
    elapsedTime,
    setElapsedTime,
    isSeeking,
    totalDuration,
    speedMultiplier,
    scrollMode,
    setScrollMode,
    getCurrentChapterSpeaker,
    isAutoscrollOn,
    setIsAutoscrollOn,
    controller,
  } = usePresentation();

  const handleTimerExpire = () => {
    // console.log("Time has expired");
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
    // check if its users turn

    if (!timer.isStarted()) {
      timer.start(Date.now() - elapsedTime);
    } else {
      timer.isRunning() ? timer.pause() : timer.resume();
    }
  };

  const handleTimeChange = (newTime: number) => {
    setElapsedTime(newTime);
    if (timer.isStarted()) {
      if (timer.isRunning()) {
        timer.start(Date.now() - newTime);
      } else {
        timer.start(Date.now() - newTime);
        timer.pause();
      }
    }
  };

  const toggleScrollMode = () => {
    if (scrollMode === "continuous") {
      if (timer.isRunning()) {
        timer.pause();
      }

      setScrollMode("dynamic");
    } else {
      // handleTimerRun();
      setScrollMode("continuous");
    }
  };

  const {
    transcript,
    resetTranscript,
    // listening,
    // interimTranscript,
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
    if (!speaker || !controller)
      if (controller.current === speaker.id) {
        if (controller.previous !== speaker.id) {
          if (!timer.isRunning() && scrollMode === "continuous") {
            handleTimerRun();
          }
          isAutoscrollOn ? setIsAutoscrollOn(false) : "";
        }
      } else {
        if (timer.isRunning()) {
          handleTimerRun();
        }
      }
  }, [speaker, controller]);

  // render interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer.isRunning()) {
        setElapsedTime(timer.getElapsedRunningTime());
      }
    }, 10);

    return () => clearInterval(intervalId);

    // maybe remove "isSeeking"
  }, [timer, isSeeking]);

  // check if browser supports dynamic mode
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      // console.log("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  // get and handle pusher messages
  useEffect(() => {
    if (!wordsWithTimestamps || !presentation) return;

    pusherChannel.bind("update-position", (data: any) => {
      if (scrollMode === "continuous" && data.senderId === speaker.id) return;

      const newTimestamp = getTimestampFromPosition(
        wordsWithTimestamps,
        data.newPosition
      );

      newTimestamp ? handleTimeChange(newTimestamp) : "";
    });
  }, [presentation?.id, wordsWithTimestamps]);

  // update presentation if scroll mode is dynamic
  useEffect(() => {
    if (!transcript || !presentation || transcript.length === 0) return;
    broadcastProgress({ transcript });
  }, [transcript]);

  // update presentation if scroll mode is continuous
  useEffect(() => {
    //substitute timer.isRunning() by turn check
    if (!wordsWithTimestamps || !speaker || scrollMode === "dynamic") return;

    const keepController = getCurrentChapterSpeaker(progress.line);
    if (keepController) {
      broadcastProgress({ transcript: null });
    }
  }, [progress]);

  return (
    <div className="flex relative h-full">
      <div className="w-[275px]"></div>

      <ScriptContainer handleTimeChange={handleTimeChange} />

      <div className="w-[275px]"></div>
      <div className="w-full h-56 fixed bottom-0 bg-gradient-to-t from-background-primary to-background-primary/0 pointer-events-none"></div>
      <div className="w-full pb-[10px] px-[10px] fixed bottom-0">
        <ActionPanel
          handleTimeChange={handleTimeChange}
          toggleScrollMode={toggleScrollMode}
          handleTimerRun={handleTimerRun}
          timer={timer}
        />
      </div>
    </div>
  );
}
