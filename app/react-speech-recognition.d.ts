// src/react-speech-recognition.d.ts

declare module "react-speech-recognition" {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    language?: string;
  }

  export interface SpeechRecognition {
    startListening: (options?: SpeechRecognitionOptions) => Promise<void>;
    stopListening: () => Promise<void>;
    abortListening: () => Promise<void>;
    getRecognition: () => any;
    applyPolyfill: (polyfill: any) => void;
    removePolyfill: () => void;
  }

  export function useSpeechRecognition(): {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    resetTranscript: () => void;
    listening: boolean;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  };

  const SpeechRecognition: SpeechRecognition;

  export default SpeechRecognition;
}
