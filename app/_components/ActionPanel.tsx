"use client";

import ProgressBar from "@/app/_components/ProgressBar";
import PlayPauseButton from "./PlayPauseButton";

import { usePresentation } from "../_contexts/PresentationContext";

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
  const { speaker, scrollMode } = usePresentation();

  return (
    <div className="flex flex-col bg-foreground-primary h-16 rounded-[10px] border-[1px] border-border">
      <ProgressBar handleTimeChange={handleTimeChange} />
      <div className="h-full w-full flex">
        <span>{`Scroll mode: ${scrollMode}`}</span>

        <button onClick={toggleScrollMode} className="">{`Switch to ${
          scrollMode === "continuous" ? "Dynamic" : "Continuous"
        }`}</button>

        <PlayPauseButton handleTimerRun={handleTimerRun} timer={timer} />

        <p>{speaker.id}</p>
      </div>
    </div>
  );
}
