"use client";
import "regenerator-runtime/runtime";

import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";
import { pusherClient } from "@/app/_config/pusher";
import calculateTimestamps from "@/app/_lib/addTimestamps";

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

    const updatePresentation = async () => {
      try {
        // console.log(
        //   presentationCode,
        //   currPosition,
        //   presentation?.nodes.words,
        //   transcript
        // );
        const response = await fetch("/api/presentation/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            presentationCode: presentationCode,
            currentPosition: currPosition,
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

    updatePresentation();
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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{`Current position ${currPosition}`}</h1>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleStartListening} disabled={listening}>
          Start Listening
        </button>
        <button onClick={handleStopListening} disabled={!listening}>
          Stop Listening
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Last Spoken Word: {interimTranscript}</h2>
      </div>
      <div
        className="ring-1 ring-blue-500 text-left"
        style={{
          width: containerWidth + "px",
        }}
      >
        {/* {wordsWithTimestamps &&
          Object.values(wordsWithTimestamps).map((item: any, index: any) => (
            <span
              key={index}
              style={{
                opacity: index < currPosition ? 1 : 0.5,
              }}
            >
              {index === 0 ? item.word : " " + item.word}
            </span>
          ))} */}

        {wordsWithTimestamps &&
          Object.values(wordsWithTimestamps).map(
            (line: any, lineIndex: any) => (
              <div key={lineIndex} className="ring-1 ring-red-500">
                {line.map((wordObject: any, wordIndex: any) => (
                  <span
                    key={wordIndex}
                    style={{
                      lineHeight: "160%",
                      fontSize: "36px",
                      opacity: wordObject.index < currPosition ? 1 : 0.5,
                    }}
                  >
                    {/* {wordIndex > 0 ? " " : "" + wordObject.word} */}
                    {wordIndex === 0 ? wordObject.word : " " + wordObject.word}
                  </span>
                ))}
              </div>
            )
          )}
      </div>
    </div>
  );
}
