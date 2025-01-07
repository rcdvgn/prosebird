import { PauseIcon, PlayIcon } from "@/app/_assets/icons";
import { usePresentation } from "../_contexts/PresentationContext";
import { useEffect } from "react";

export default function PlayPauseButton({
  handleTimerRun,
  timer,
}: {
  handleTimerRun: any;
  timer: any;
}) {
  const { controller, speaker, scrollMode } = usePresentation();

  const showControls =
    speaker?.id === controller?.current && scrollMode === "continuous";

  return (
    showControls && (
      <div
        className="h-10 aspect-square rounded-full bg-brand grid place-items-center cursor-pointer mx-7"
        onClick={handleTimerRun}
      >
        {timer.isStarted() && timer.isRunning() ? (
          <PauseIcon className="w-[12px] text-primary" />
        ) : (
          <PlayIcon className="w-[12px] text-primary translate-x-[2px]" />
        )}
      </div>
    )
  );
}
