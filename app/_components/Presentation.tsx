"use client";
import "regenerator-runtime/runtime";
import { useTimer } from "react-use-precision-timer";
import getTimestampFromIndex from "@/app/_utils/getTimestampFromIndex";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { pusherClient } from "@/app/_config/pusher";
import calculateTimestamps from "@/app/_lib/addTimestamps";
import GreenRoom from "@/app/_components/GreenRoom";
import getLineFromIndex from "@/app/_utils/getLineFromIndex";
import ScriptContainer from "@/app/_components/ScriptContainer";
import ActionPanel from "@/app/_components/ActionPanel";

export default function Presentation({
  speaker,
  presentationCode,
  presentationData,
  pusherClient,
}: {
  speaker: any;
  presentationCode: any;
  presentationData: any;
  pusherClient: any;
}) {
  const [scrollMode, setScrollMode] = useState<any>("continuous");
  const [continuousElapsedTime, setContinuousElapsedTime] = useState<any>(0);
  const [wordsWithTimestamps, setWordsWithTimestamps] = useState<any>(null);
  const [containerWidth, setContainerWidth] = useState<any>(520);
  const [speedMultiplier, setSpeedMultiplier] = useState<any>(1);
  const [totalDuration, setTotalDuration] = useState<any>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [position, setPosition] = useState<any>(0);
  const [tempPosition, setTempPosition] = useState(0);

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
          userId: speaker.id,
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
          words: presentationData.nodes.words,
          userId: speaker.id,
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
    if (!browserSupportsSpeechRecognition) {
      console.log("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!transcript || !presentationData || transcript.length === 0) return;

    dynamicallyUpdatePresentation();
  }, [transcript, presentationData]);

  useEffect(() => {
    if (!presentationData) return;
    pusherClient.subscribe(presentationCode);
    pusherClient.bind("update-position", (data: any) => {
      // if continuous, updating elapsedTime consequentially updates position
      if (scrollMode === "continuous") {
        // this check prevents a feedback loop since we shouldnt be listening to our own changes in this scroll mode
        if (data.senderId !== speaker.id && wordsWithTimestamps) {
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

    return () => {
      pusherClient.unsubscribe(presentationCode);
    };
  }, [presentationData, presentationCode]);

  useEffect(() => {
    const fetchWordsWithTimestamps = async () => {
      try {
        if (presentationData) {
          const { scriptWithTimestamps, totalDuration } =
            await calculateTimestamps(
              presentationData.nodes.words,
              presentationData.nodes.chapters,
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
  }, [presentationData, containerWidth, speedMultiplier]);

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
        setTempPosition(tempPosition + 1);
        updatePresentation(tempPosition + 1);
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
