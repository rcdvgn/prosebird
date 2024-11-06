"use client";
import "regenerator-runtime/runtime";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";
import { pusherClient } from "@/app/_config/pusher";
import calculateTimestamps from "@/app/_lib/addTimestamps";
import Scrollbar from "@/app/_components/Scrollbar";

export default function Page({
  params,
}: {
  params: { presentationCode: string };
}) {
  const { presentationCode } = params;
  // const { script } = useScriptEditor();
  // const scriptData = script.data;
  const { user } = useAuth();

  const [presentation, setPresentation] = useState<any>(null);
  const [wordsWithTimestamps, setWordsWithTimestamps] = useState<any>(null);
  const [containerWidth, setContainerWidth] = useState<any>(520);
  const [speedMultiplier, setSpeedMultiplier] = useState<any>(1);
  const [totalDuration, setTotalDuration] = useState<any>(null);

  const [currPosition, setCurrPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const elapsedTime = wordsWithTimestamps
    ? wordsWithTimestamps[currPosition].timestamp
    : null;

  const updatePresentation = async (targetPosition: any) => {
    try {
      const response = await fetch("/api/presentation/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presentationCode: presentationCode,
          currentPosition: currPosition,
          targetPosition: targetPosition,
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

    updatePresentation(null);
  }, [transcript, presentation]);

  useEffect(() => {
    if (!presentation) return;
    // console.log(presentation);

    pusherClient.subscribe(presentationCode);

    pusherClient.bind("update-position", (newPosition: any) => {
      setCurrPosition(newPosition);
    });

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

  return (
    <div className="flex relative h-full">
      <div className="w-[275px]"></div>

      <ScriptContainer
        containerWidth={containerWidth}
        wordsWithTimestamps={wordsWithTimestamps}
        updatePresentation={updatePresentation}
        currPosition={currPosition}
        totalDuration={totalDuration}
        elapsedTime={elapsedTime}
      />

      <div className="w-[275px]"></div>
      <div className="w-full h-56 fixed bottom-0 bg-gradient-to-t from-background-primary to-background-primary/0 pointer-events-none"></div>
      <div className="w-full pb-[10px] px-[10px] fixed bottom-0">
        <ControlBar />
      </div>
    </div>
  );
}

function ControlBar() {
  return (
    <div className="bg-foreground-primary h-16 rounded-[10px] border-[1px] border-border"></div>
  );
}

// import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";

function ScriptContainer({
  containerWidth,
  wordsWithTimestamps,
  updatePresentation,
  currPosition,
  totalDuration,
  elapsedTime,
}: {
  containerWidth: any;
  wordsWithTimestamps: any;
  updatePresentation: any;
  currPosition: any;
  totalDuration: any;
  elapsedTime: any;
}) {
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

  const textSize = "0px"; // placeholder CHANGE LATER

  useLayoutEffect(() => {
    calculateScrollbarHeight();
  }, [wordsWithTimestamps, textSize]);

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
                        wordObject.index < currPosition
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
