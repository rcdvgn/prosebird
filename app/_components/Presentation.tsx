"use client";
import "regenerator-runtime/runtime";
import { useTimer } from "react-use-precision-timer";
import getTimestampFromIndex from "@/app/_utils/getTimestampFromIndex";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import calculateTimestamps from "@/app/_lib/addTimestamps";
import getLineFromIndex from "@/app/_utils/getLineFromIndex";
import ScriptContainer from "@/app/_components/ScriptContainer";
import ActionPanel from "@/app/_components/ActionPanel";
import { usePresentation } from "../_contexts/PresentationContext";
import { set } from "lodash";

export default function Presentation() {
  const {
    presentation,
    presentationCode,
    speaker,
    pusherChannel,
    position,
    setPosition,
    broadcastProgress,
  } = usePresentation();

  const [scrollMode, setScrollMode] = useState<any>("continuous");
  const [continuousElapsedTime, setContinuousElapsedTime] = useState<any>(0);
  const [wordsWithTimestamps, setWordsWithTimestamps] = useState<any>(null);
  const [totalDuration, setTotalDuration] = useState<any>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [tempPosition, setTempPosition] = useState(0);

  const containerWidth = 520;
  const speedMultiplier = 1;

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
      timer.start(Date.now() - continuousElapsedTime);
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

  const elapsedTime =
    scrollMode === "continuous"
      ? continuousElapsedTime
      : wordsWithTimestamps
      ? getTimestampFromIndex(wordsWithTimestamps, position)
      : null;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer.isRunning()) {
        setContinuousElapsedTime(timer.getElapsedRunningTime());
      }
    }, 10);

    return () => clearInterval(intervalId);

    // maybe remove "isSeeking"
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
      setTempPosition(position);
      setContinuousElapsedTime(timestampFromIndex);
      handleTimerRun();
      setScrollMode("continuous");
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

  // check if browser supports dynamic mode
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.log("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  // generate wordsWithTimestamps
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
  }, [presentation?.nodes, presentation?.id, containerWidth, speedMultiplier]);

  // get and handle pusher messages
  useEffect(() => {
    if (!wordsWithTimestamps || !presentation) return;
    console.log(presentationCode);
    // pusherClient.subscribe(`presence-${presentationCode}`);
    pusherChannel.bind("update-position", (data: any) => {
      // if continuous, updating elapsedTime consequentially updates position
      if (scrollMode === "continuous") {
        console.log(data.senderId);
        // this check prevents a feedback loop since we shouldnt be listening to our own changes in this scroll mode
        if (data.senderId !== speaker.id) {
          console.log(data.position);

          const newTimestamp = getTimestampFromIndex(
            wordsWithTimestamps,
            data.position
          );
          newTimestamp ? handleTimeChange(newTimestamp) : "";
        }

        // if dynamic, updating position consequentially updates elapsedTime
      } else {
        setPosition(data.position);
      }
    });
  }, [presentation?.id, presentationCode, wordsWithTimestamps]);

  // update presentation if scroll mode is dynamic
  useEffect(() => {
    if (!transcript || !presentation || transcript.length === 0) return;
    broadcastProgress(null, transcript);
  }, [transcript]);

  // update presentation if scroll mode is continuous
  useEffect(() => {
    if (!wordsWithTimestamps || scrollMode === "dynamic") return;
    const { nextWordLineKey, nextWordWordIndex }: any = getLineFromIndex(
      wordsWithTimestamps,
      tempPosition + 1
    );

    if (nextWordLineKey) {
      if (
        elapsedTime >=
        wordsWithTimestamps[nextWordLineKey][nextWordWordIndex].timestamp
      ) {
        console.log("sdgdfhgfdhdhdfhfbcv");
        setTempPosition(tempPosition + 1);
        if (timer.isRunning()) {
          broadcastProgress(tempPosition + 1, null);
        }
      }
    }
  }, [continuousElapsedTime]);

  return (
    <div className="flex relative h-full">
      <div className="w-[275px]"></div>

      <ScriptContainer
        containerWidth={containerWidth}
        wordsWithTimestamps={wordsWithTimestamps}
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
