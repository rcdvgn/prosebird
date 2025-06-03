import { useRef, useCallback } from "react";

export function usePCMStream({
  onAudioChunk,
}: {
  onAudioChunk: (chunk: ArrayBuffer) => void;
}) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pcmNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  const start = useCallback(async () => {
    if (isRecordingRef.current) {
      console.log("Recording already started");
      return;
    }

    try {
      console.log("Starting PCM stream...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      console.log("Got media stream");

      const audioContext = new AudioContext({ sampleRate: 24000 });
      await audioContext.audioWorklet.addModule("/pcm-processor.js");

      console.log("Audio worklet loaded");

      const source = audioContext.createMediaStreamSource(stream);
      const pcmNode = new AudioWorkletNode(audioContext, "pcm-processor");

      pcmNode.port.onmessage = (event) => {
        const arrayBuffer = event.data;
        console.log("PCM processor output:", arrayBuffer.byteLength, "bytes");
        onAudioChunk(arrayBuffer);
      };

      source.connect(pcmNode);
      // Don't connect to destination to avoid feedback
      // pcmNode.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      pcmNodeRef.current = pcmNode;
      streamRef.current = stream;
      isRecordingRef.current = true;

      console.log("PCM stream started successfully");
    } catch (error) {
      console.error("Error starting PCM stream:", error);
      throw error;
    }
  }, [onAudioChunk]);

  const stop = useCallback(async () => {
    if (!isRecordingRef.current) {
      console.log("Recording not started");
      return;
    }

    console.log("Stopping PCM stream...");

    try {
      if (pcmNodeRef.current) {
        pcmNodeRef.current.port.postMessage("STOP");
        pcmNodeRef.current.disconnect();
        pcmNodeRef.current = null;
      }

      if (audioContextRef.current) {
        await audioContextRef.current.close();
        audioContextRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped track:", track.kind);
        });
        streamRef.current = null;
      }

      isRecordingRef.current = false;
      console.log("PCM stream stopped successfully");
    } catch (error) {
      console.error("Error stopping PCM stream:", error);
    }
  }, []);

  return { start, stop };
}
