"use client";

import ProgressBar from "@/app/_components/ProgressBar";
import PlayPauseButton from "./PlayPauseButton";

import { usePresentation } from "../_contexts/PresentationContext";

export default function ActionPanel({
  elapsedTime,
  totalDuration,
  isSeeking,
  setIsSeeking,
  handleTimeChange,
  scrollMode,
  toggleScrollMode,
  handleTimerRun,
  timer,
}: {
  elapsedTime: any;
  totalDuration: any;
  isSeeking: any;
  setIsSeeking: any;
  handleTimeChange: any;
  scrollMode: any;
  toggleScrollMode: any;
  handleTimerRun: any;
  timer: any;
}) {
  const { speaker } = usePresentation();

  return (
    <div className="flex flex-col bg-foreground-primary h-16 rounded-[10px] border-[1px] border-border">
      <ProgressBar
        elapsedTime={elapsedTime}
        totalDuration={totalDuration}
        handleTimeChange={handleTimeChange}
        isSeeking={isSeeking}
        setIsSeeking={setIsSeeking}
      />
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
