"use client";
import "regenerator-runtime/runtime";
import { useTimer } from "react-use-precision-timer";
import getTimestampFromPosition from "@/app/_utils/getTimestampFromPosition";
import React, { useState, useEffect, useRef } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
import ActionPanel from "@/app/_components/ActionPanel";

import { usePresentation } from "../_contexts/PresentationContext";
import {
  useDeepgram,
  LiveConnectionState,
  LiveTranscriptionEvents,
} from "../_contexts/DeepgramContextProvider";
import {
  useMicrophone,
  MicrophoneEvents,
  MicrophoneState,
} from "../_contexts/MicrophoneContext";
import PresentationMain from "./PresentationMain";

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
  } = usePresentation();

  const { connectToDeepgram, connection, connectionState } = useDeepgram();
  const {
    setupMicrophone,
    microphone,
    startMicrophone,
    stopMicrophone,
    microphoneState,
  } = useMicrophone();
  const [transcript, setTranscript] = useState("");

  const keepAliveInterval = useRef<any>();

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

  useEffect(() => {
    setupMicrophone();
  }, []);

  useEffect(() => {
    if (microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        language: "pt-BR",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 3000,
      });
    }
  }, [microphoneState]);

  useEffect(() => {
    if (!microphone || !connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = (data: any) => {
      console.log(data);
      const thisCaption = data.channel.alternatives[0]?.transcript;
      if (thisCaption) {
        setTranscript((prev) => prev + " " + thisCaption);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);
      // startMicrophone();
    }

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        onTranscript
      );
      microphone.removeEventListener(MicrophoneEvents.DataAvailable, onData);
    };
  }, [connectionState, microphone]);

  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 5000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

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

  // const {
  //   transcript,
  //   resetTranscript,
  //   listening,
  //   // interimTranscript,
  //   browserSupportsSpeechRecognition,
  // } = useSpeechRecognition();

  // const handleStartListening = () => {
  //   resetTranscript();
  //   SpeechRecognition.startListening({
  //     continuous: true,
  //     language: "en-US",
  //   });
  // };

  // const handleStopListening = () => {
  //   SpeechRecognition.stopListening();
  // };

  // check if browser supports dynamic mode
  // useEffect(() => {
  //   if (!browserSupportsSpeechRecognition) {
  //     console.log("Browser doesn't support speech recognition.");
  //   }
  // }, [browserSupportsSpeechRecognition]);

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
      } else {
        microphoneState === MicrophoneState.Open ? stopMicrophone() : "";
      }
    }
  }, [speaker, controller]);

  // handle messages
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

    console.log(transcript);
    broadcastProgress({ transcript });
  }, [transcript]);

  // update presentation if scroll mode is continuous
  useEffect(() => {
    if (!progress || !wordsWithTimestamps || !speaker) return;

    const position =
      wordsWithTimestamps[progress.line][progress.index].position;
    const { isController, didControllerChange } = getController(position);

    if (scrollMode === "continuous") {
      const isProgressZero = position === 0;

      if (isController || (didControllerChange && !isProgressZero)) {
        broadcastProgress({ transcript: null });
      }
    }
  }, [progress]);

  return (
    <div className="flex flex-col relative h-screen w-screen bg-background">
      <div className="px-2 pt-2 grow min-h-0">
        <PresentationMain handleTimeChange={handleTimeChange} timer={timer} />
      </div>

      <ActionPanel
        // handleStartListening={handleStartListening}
        // handleStopListening={handleStopListening}
        // listening={listening}
        handleTimeChange={handleTimeChange}
        toggleScrollMode={toggleScrollMode}
        handleTimerRun={handleTimerRun}
        timer={timer}
      />
    </div>
  );
}

/* <div className="w-full h-56 fixed bottom-0 bg-gradient-to-t from-background to-background/0 pointer-events-none"></div> */
