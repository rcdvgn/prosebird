"use client";

import ProgressBar from "@/app/_components/ProgressBar";
import PlayPauseButton from "./PlayPauseButton";

import { usePresentation } from "../_contexts/PresentationContext";
import { useMicrophone } from "../_contexts/MicrophoneContext";

export default function ActionPanel({
  handleTimeChange,
  toggleScrollMode,
  handleTimerRun,
  timer,
}: {
  handleTimeChange: any;
  toggleScrollMode: any;
  handleTimerRun: any;
  timer: any;
}) {
  const { scrollMode } = usePresentation();
  const { microphoneState } = useMicrophone();

  return (
    <div className="flex flex-col bg-middleground h-16 rounded-[10px] border-[1px] border-border relative">
      <ProgressBar handleTimeChange={handleTimeChange} />
      <div className="h-full w-full flex items-center justify-center">
        <span className="text-primary">{microphoneState}</span>

        <span className="text-primary">{`Scroll mode: ${scrollMode}`}</span>

        <button
          onClick={toggleScrollMode}
          className="text-primary"
        >{`Switch to ${
          scrollMode === "continuous" ? "Dynamic" : "Continuous"
        }`}</button>

        <PlayPauseButton handleTimerRun={handleTimerRun} timer={timer} />
      </div>
    </div>
  );
}
