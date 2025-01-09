"use client";

import ProgressBar from "@/app/_components/ProgressBar";
import PlayPauseButton from "./PlayPauseButton";

import { usePresentation } from "../_contexts/PresentationContext";

export default function ActionPanel({
  handleStartListening,
  handleStopListening,
  listening,
  handleTimeChange,
  toggleScrollMode,
  handleTimerRun,
  timer,
}: {
  handleStartListening: any;
  handleStopListening: any;
  listening: any;
  handleTimeChange: any;
  toggleScrollMode: any;
  handleTimerRun: any;
  timer: any;
}) {
  const { speaker, scrollMode } = usePresentation();

  return (
    <div className="flex flex-col bg-middleground h-16 rounded-[10px] border-[1px] border-border relative">
      <ProgressBar handleTimeChange={handleTimeChange} />
      <div className="h-full w-full flex items-center justify-center">
        <span className="text-primary">{`Scroll mode: ${scrollMode}`}</span>

        <button
          onClick={toggleScrollMode}
          className="text-primary"
        >{`Switch to ${
          scrollMode === "continuous" ? "Dynamic" : "Continuous"
        }`}</button>

        <PlayPauseButton
          handleStartListening={handleStartListening}
          handleStopListening={handleStopListening}
          listening={listening}
          handleTimerRun={handleTimerRun}
          timer={timer}
        />
      </div>
    </div>
  );
}
