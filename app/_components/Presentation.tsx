"use client";
import "regenerator-runtime/runtime";
import { useTimer } from "react-use-precision-timer";
import getTimestampFromPosition from "@/app/_utils/getTimestampFromPosition";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ActionPanel from "@/app/_components/ActionPanel";

import { usePresentation } from "../_contexts/PresentationContext";
import { useOpenAIRealtime } from "../_contexts/OpenAIRealtimeContext";
import PresentationMain from "./PresentationMain";
import matchToScript from "../_lib/matchToScript";
import { usePCMStream } from "../_hooks/usePCMStream";

export default function Presentation() {
  const {
    presentation,
    speaker,
    flatWords,
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
    timestamps,
    isMuted,
  } = usePresentation();

  const {
    connectToProxy,
    sendAudio,
    transcript,
    connectionState,
    isConnected,
  } = useOpenAIRealtime();

  const [microphoneActive, setMicrophoneActive] = useState(false);
  const connectionInitialized = useRef(false);
  const previousMutedState = useRef<boolean>(isMuted);

  const handlePCMChunk = useCallback(
    (chunk: ArrayBuffer) => {
      // Debug logging
      console.log("PCM Chunk received:", {
        size: chunk.byteLength,
        isMuted,
        speakerId: speaker?.id,
        controllerId: controller?.current,
        isController: speaker?.id === controller?.current,
        connectionState,
        isConnected,
      });

      // Only forward if unmuted, user is the controller, and connection is ready
      if (
        !isMuted &&
        speaker?.id === controller?.current &&
        isConnected &&
        connectionState === "OPEN"
      ) {
        console.log("Sending audio chunk to OpenAI");
        sendAudio(chunk);
      } else {
        console.log("Audio chunk not sent:", {
          muted: isMuted,
          notController: speaker?.id !== controller?.current,
          notConnected: !isConnected || connectionState !== "OPEN",
        });
      }
    },
    [
      isMuted,
      speaker?.id,
      controller?.current,
      sendAudio,
      connectionState,
      isConnected,
    ]
  );

  const { start, stop } = usePCMStream({ onAudioChunk: handlePCMChunk });

  // Handle microphone start/stop based on mute state
  const startMicrophone = useCallback(async () => {
    if (!microphoneActive) {
      try {
        console.log("Starting microphone...");
        await start();
        setMicrophoneActive(true);
        console.log("Microphone started successfully");
      } catch (error) {
        console.error("Failed to start microphone:", error);
      }
    }
  }, [start, microphoneActive]);

  const stopMicrophone = useCallback(async () => {
    if (microphoneActive) {
      try {
        console.log("Stopping microphone...");
        await stop();
        setMicrophoneActive(false);
        console.log("Microphone stopped successfully");
      } catch (error) {
        console.error("Failed to stop microphone:", error);
      }
    }
  }, [stop, microphoneActive]);

  const timer = useTimer(
    {
      delay: isNaN(totalDuration) ? 0 : totalDuration,
      runOnce: true,
      fireOnStart: false,
      startImmediately: false,
      speedMultiplier: speedMultiplier,
    },
    () => {
      handleTimeChange(totalDuration);
      console.log("Time has expired");
    }
  );

  // Initialize connection once
  useEffect(() => {
    if (!connectionInitialized.current) {
      console.log("Initializing OpenAI connection");
      connectToProxy();
      connectionInitialized.current = true;
    }
  }, [connectToProxy]);

  // Handle microphone based on mute state
  useEffect(() => {
    console.log("Mute state changed:", {
      isMuted,
      previousMuted: previousMutedState.current,
    });

    if (isMuted && !previousMutedState.current) {
      // User just muted - stop microphone
      console.log("User muted - stopping microphone");
      stopMicrophone();
    } else if (!isMuted && previousMutedState.current) {
      // User just unmuted - start microphone
      console.log("User unmuted - starting microphone");
      startMicrophone();
    } else if (!isMuted && !microphoneActive) {
      // Initial unmuted state - start microphone
      console.log("Initial unmuted state - starting microphone");
      startMicrophone();
    }

    previousMutedState.current = isMuted;
  }, [isMuted, startMicrophone, stopMicrophone, microphoneActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("Component unmounting, stopping microphone");
      stopMicrophone();
    };
  }, [stopMicrophone]);

  // Handle transcript changes
  useEffect(() => {
    if (!transcript) return;
    console.log("[Transcription received]:", transcript);
  }, [transcript]);

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
      setScrollMode("continuous");
    }
  };

  // render interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer.isRunning()) {
        setElapsedTime(timer.getElapsedRunningTime());
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, [timer, isSeeking]);

  // observe and manage control over the presentation
  useEffect(() => {
    if (!speaker || !presentation || !controller) return;

    if (controller?.current === speaker?.id) {
      if (controller?.previous !== speaker?.id) {
        !isAutoscrollOn ? setIsAutoscrollOn(true) : "";
      }
    } else if (controller?.previous === speaker?.id) {
      if (scrollMode === "continuous") {
        if (timer.isRunning()) {
          handleTimerRun();
        }
      }
    }
  }, [speaker, controller]);

  // handle messages
  useEffect(() => {
    if (!flatWords || !presentation || !presentation?.lastMessage) return;
    const { position: newPosition, senderId } = presentation.lastMessage;

    // Don't update UI for your own messages; you already did that locally.
    if (senderId === speaker.id) return;

    const newTimestamp = flatWords[newPosition]?.timestamp;
    if (typeof newTimestamp === "number") {
      handleTimeChange(newTimestamp);
    }
  }, [presentation?.id, presentation?.lastMessage, flatWords]);

  // update presentation if scroll mode is dynamic
  useEffect(() => {
    if (
      !controller?.current ||
      !transcript ||
      !presentation ||
      transcript.length === 0 ||
      speaker?.id !== controller?.current // Only process if user is controller
    )
      return;

    console.log("Processing transcript for matching:", transcript);

    // Extract last spoken words and normalize
    const lastSpokenWords: any = transcript.trim().split(/\s+/).slice(-3);

    // Run the matching logic (using flatWords)
    const newPosition = matchToScript(
      progress,
      presentation.nodes.words,
      lastSpokenWords
    );

    console.log("Match result:", {
      currentProgress: progress,
      newPosition,
      lastSpokenWords,
    });

    // If position changed, update UI locally and broadcast
    if (newPosition !== progress) {
      const newTimestamp = getTimestampFromPosition(timestamps, newPosition);
      if (typeof newTimestamp === "number") {
        console.log("Updating time based on transcript match:", newTimestamp);
        handleTimeChange(newTimestamp);
      }
    }
  }, [transcript, controller, speaker, progress, presentation, timestamps]);

  return (
    <div className="flex flex-col relative h-screen w-screen bg-background">
      {/* Debug info */}
      <div className="px-2 py-1 text-xs text-gray-500 border-b">
        Connection: {connectionState} | Microphone:{" "}
        {microphoneActive ? "ON" : "OFF"} | Muted: {isMuted ? "YES" : "NO"} |
        Controller: {speaker?.id === controller?.current ? "YES" : "NO"}
      </div>

      <div className="px-2 pt-2 grow min-h-0">
        <PresentationMain handleTimeChange={handleTimeChange} timer={timer} />
      </div>

      <ActionPanel
        handleTimeChange={handleTimeChange}
        toggleScrollMode={toggleScrollMode}
        handleTimerRun={handleTimerRun}
        timer={timer}
      />
    </div>
  );
}
