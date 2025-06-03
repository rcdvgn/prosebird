"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useCallback,
  useEffect,
} from "react";

interface OpenAIRealtimeContextType {
  socket: WebSocket | null;
  connectToProxy: () => void;
  disconnectFromProxy: () => void;
  sendAudio: (arrayBuffer: ArrayBuffer) => void;
  transcript: string;
  connectionState: "CLOSED" | "OPEN" | "CONNECTING" | "ERROR";
  isConnected: boolean;
}

const OpenAIRealtimeContext = createContext<
  OpenAIRealtimeContextType | undefined
>(undefined);

interface OpenAIRealtimeContextProviderProps {
  children: ReactNode;
}

const WS_PROXY_URL =
  process.env.NODE_ENV === "production"
    ? "wss://your-production-domain"
    : "ws://localhost:8080";

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const OpenAIRealtimeContextProvider: React.FC<
  OpenAIRealtimeContextProviderProps
> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionState, setConnectionState] = useState<
    "CLOSED" | "OPEN" | "CONNECTING" | "ERROR"
  >("CLOSED");
  const [transcript, setTranscript] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  const buffer = useRef<string>("");
  const audioChunkCount = useRef<number>(0);
  const errorCount = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttemptRef = useRef<boolean>(false);
  const sessionConfigured = useRef<boolean>(false);

  const connectToProxy = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (
      connectionAttemptRef.current ||
      (socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING))
    ) {
      console.log("Connection already exists or in progress");
      return;
    }

    connectionAttemptRef.current = true;
    sessionConfigured.current = false;
    setConnectionState("CONNECTING");
    setIsConnected(false);

    console.log("Connecting to proxy:", WS_PROXY_URL);
    const ws = new WebSocket(WS_PROXY_URL);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setConnectionState("OPEN");
      setSocket(ws);
      setIsConnected(true);
      connectionAttemptRef.current = false;

      audioChunkCount.current = 0;
      errorCount.current = 0;

      // Send session configuration after connection is established
      const sessionConfig = {
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions:
            "You are a helpful assistant. Please transcribe the user's speech accurately.",
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1",
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
          },
          temperature: 0.8,
          max_response_output_tokens: 4096,
        },
      };

      console.log(
        "Sending session config:",
        JSON.stringify(sessionConfig, null, 2)
      );
      ws.send(JSON.stringify(sessionConfig));
    };

    ws.onmessage = async (event) => {
      let data;
      if (event.data instanceof Blob) {
        data = await event.data.text();
      } else {
        data = event.data;
      }

      try {
        const msg = JSON.parse(data);
        console.log("Received message type:", msg.type);

        if (msg.type === "session.updated") {
          console.log("✅ Session updated successfully");
          console.log("Session details:", JSON.stringify(msg.session, null, 2));
          sessionConfigured.current = true;

          // Check if transcription is properly configured
          if (msg.session.input_audio_transcription) {
            console.log(
              "✅ Input audio transcription enabled:",
              msg.session.input_audio_transcription
            );
          } else {
            console.warn(
              "⚠️ Input audio transcription not configured in session"
            );
          }
        }

        if (
          msg.type === "conversation.item.input_audio_transcription.completed"
        ) {
          const transcriptText = msg.transcript || "";
          console.log("📝 New transcription:", transcriptText);
          if (transcriptText.trim()) {
            buffer.current += transcriptText + " ";
            setTranscript(buffer.current.trim());
          }
        }

        if (msg.type === "conversation.item.input_audio_transcription.failed") {
          console.error("❌ Transcription failed:", msg.error);
        }

        if (msg.type === "input_audio_buffer.committed") {
          console.log("✅ Audio buffer committed");
        }

        if (msg.type === "input_audio_buffer.speech_started") {
          console.log("🎤 Speech started detected");
        }

        if (msg.type === "input_audio_buffer.speech_stopped") {
          console.log("🔇 Speech stopped detected");
        }

        if (msg.type === "error") {
          console.error("❌ OpenAI API Error:", msg.error);
          errorCount.current++;
          if (errorCount.current > 5) {
            console.log("Too many errors, closing connection");
            ws.close();
          }
        }

        if (msg.type === "response.created") {
          console.log("📤 Response created:", msg.response.id);
        }

        if (msg.type === "response.done") {
          console.log("✅ Response completed:", msg.response.status);
          if (msg.response.status === "failed") {
            console.error("❌ Response failed:", msg.response.status_details);
          }
        }
      } catch (err) {
        console.log("Non-JSON response received:", data);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setConnectionState("ERROR");
      setIsConnected(false);
      connectionAttemptRef.current = false;
    };

    ws.onclose = (event) => {
      console.log("🔴 WebSocket closed:", event.code, event.reason);
      setConnectionState("CLOSED");
      setSocket(null);
      setIsConnected(false);
      buffer.current = "";
      connectionAttemptRef.current = false;
      sessionConfigured.current = false;

      // Auto-reconnect after 3 seconds if not manually closed
      if (event.code !== 1000) {
        console.log("Attempting to reconnect in 3 seconds...");
        reconnectTimeoutRef.current = setTimeout(() => {
          connectToProxy();
        }, 3000);
      }
    };

    setSocket(ws);
  }, [socket]);

  const disconnectFromProxy = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socket) {
      console.log("Manually disconnecting from proxy");
      socket.close(1000, "Manual disconnect");
      setSocket(null);
      setConnectionState("CLOSED");
      setIsConnected(false);
    }
  }, [socket]);

  const sendAudio = useCallback(
    (arrayBuffer: ArrayBuffer) => {
      if (!socket || !isConnected || socket.readyState !== WebSocket.OPEN) {
        console.warn("⚠️ Cannot send audio: socket not ready");
        return;
      }

      if (!sessionConfigured.current) {
        console.warn("⚠️ Cannot send audio: session not configured yet");
        return;
      }

      try {
        const base64Audio = arrayBufferToBase64(arrayBuffer);
        const audioMessage = {
          type: "input_audio_buffer.append",
          audio: base64Audio,
        };

        console.log(`📤 Sending audio chunk: ${arrayBuffer.byteLength} bytes`);
        socket.send(JSON.stringify(audioMessage));
        audioChunkCount.current++;

        // Commit the audio buffer after sending chunks
        // This tells OpenAI to process the audio for transcription
        if (audioChunkCount.current % 10 === 0) {
          const commitMessage = {
            type: "input_audio_buffer.commit",
          };
          console.log("📤 Committing audio buffer");
          socket.send(JSON.stringify(commitMessage));
        }
      } catch (error) {
        console.error("❌ Error sending audio:", error);
      }
    },
    [socket, isConnected]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnectFromProxy();
    };
  }, [disconnectFromProxy]);

  return (
    <OpenAIRealtimeContext.Provider
      value={{
        socket,
        connectToProxy,
        disconnectFromProxy,
        sendAudio,
        transcript,
        connectionState,
        isConnected,
      }}
    >
      {children}
    </OpenAIRealtimeContext.Provider>
  );
};

function useOpenAIRealtime(): OpenAIRealtimeContextType {
  const context = useContext(OpenAIRealtimeContext);
  if (!context)
    throw new Error(
      "useOpenAIRealtime must be used within an OpenAIRealtimeContextProvider"
    );
  return context;
}

export { OpenAIRealtimeContextProvider, useOpenAIRealtime };
