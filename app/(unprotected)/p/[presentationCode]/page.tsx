"use client";
import "regenerator-runtime/runtime";

import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";
import { pusherClient } from "@/app/_config/pusher";

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
  const [presentationScript, setPresentationScript] = useState<any>(null);

  const [currPosition, setCurrPosition] = useState(-1);
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

  // Check if the presentation code is valid
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

  // Update presentation progress in Firestore
  useEffect(() => {
    if (!transcript || !presentation || transcript.length === 0) return;

    const updatePresentation = async () => {
      try {
        const response = await fetch("/api/presentation/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            presentationCode: presentationCode,
            currentPosition: currPosition,
            nodes: presentation?.script,
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

  // Subscribe to Pusher updates
  useEffect(() => {
    if (!presentation) return;
    console.log(presentation);

    pusherClient.subscribe(presentationCode);

    pusherClient.bind("update-position", (newPosition: any) => {
      setCurrPosition(newPosition);
    });

    return () => {
      pusherClient.unsubscribe(presentationCode);
    };
  }, [presentation, presentationCode]);

  useEffect(() => {
    console.log(currPosition);
  }, [currPosition]);

  const renderScript = (script: any) => {
    if (!presentation || currPosition === null) return null;

    const allWords = script.flatMap((node: any) =>
      Object.values(node.paragraph)
    );

    return (
      <div
        style={{
          width: "500px",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          lineHeight: "160%",
          fontSize: "36px",
        }}
      >
        {allWords.map((word: any, index: any) => (
          <span
            key={index}
            style={{
              opacity: index <= currPosition ? 1 : 0.5,
            }}
          >
            {word}
          </span>
        ))}
      </div>
    );
  };

  if (!presentation || error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{`Speech Guided Script #${presentationCode}`}</h1>
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
      {renderScript(presentation?.script)}
    </div>
  );
}
