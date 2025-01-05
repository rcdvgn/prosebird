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
    getController,
    isAutoscrollOn,
    setIsAutoscrollOn,
    controller,
    setController,
  } = usePresentation();

  const handleTimerExpire = () => {
    handleTimeChange(totalDuration);
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

  // observe and manage control over the presentation
  useEffect(() => {
    if (!speaker || !presentation || !controller) return;

    console.log(progress, controller);
    if (controller?.current === speaker?.id) {
      // console.log("Speaker is the controller of the presentation");

      if (controller?.previous !== speaker?.id) {
        // if (!timer.isRunning() && scrollMode === "continuous") {
        //   handleTimerRun();
        // }
        !isAutoscrollOn ? setIsAutoscrollOn(true) : "";
      }
    } else {
      // console.log("Speaker isnt the controller of the presentation");

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
    if (!wordsWithTimestamps || !presentation || !presentation?.lastMessage)
      return;
    const { position: newPosition, senderId } = presentation.lastMessage;

    if (scrollMode === "continuous" && senderId === speaker.id) return;

    const newTimestamp = getTimestampFromPosition(
      wordsWithTimestamps,
      newPosition
    );
    newTimestamp ? handleTimeChange(newTimestamp) : "";
  }, [presentation?.id, presentation?.lastMessage, wordsWithTimestamps]);

  // update presentation if scroll mode is dynamic
  useEffect(() => {
    if (!transcript || !presentation || transcript.length === 0) return;
    broadcastProgress({ transcript });
  }, [transcript]);

  // update presentation if scroll mode is continuous
  useEffect(() => {
    if (
      !progress ||
      !wordsWithTimestamps ||
      !speaker ||
      scrollMode === "dynamic"
    )
      return;

    const position =
      wordsWithTimestamps[progress.line][progress.index].position;
    const { isController, didControllerChange } = getController(position);

    console.log(isController, didControllerChange);

    const isProgressZero = position > 0;

    if (isController || (didControllerChange && isProgressZero)) {
      console.log("about to broadcast");
      broadcastProgress({ transcript: null });
    }
  }, [progress]);

  return (
    <div className="flex relative h-full">
      <div className="w-[275px]"></div>

      <ScriptContainer handleTimeChange={handleTimeChange} />

      <div className="w-[275px]"></div>
      <div className="w-full h-56 fixed bottom-0 bg-gradient-to-t from-background to-background/0 pointer-events-none"></div>
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
