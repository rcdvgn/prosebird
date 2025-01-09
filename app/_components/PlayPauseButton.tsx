import { PauseIcon, PlayIcon } from "@/app/_assets/icons";
import { usePresentation } from "../_contexts/PresentationContext";

export default function PlayPauseButton({
  handleStartListening,
  handleStopListening,
  listening,
  handleTimerRun,
  timer,
}: {
  handleStartListening: any;
  handleStopListening: any;
  listening: any;
  handleTimerRun: any;
  timer: any;
}) {
  const { controller, speaker, scrollMode } = usePresentation();

  const handlePlayPause = () => {
    if (scrollMode === "continuous") {
      handleTimerRun();
    } else {
      listening ? handleStopListening() : handleStartListening();
    }
  };

  const showControls = speaker?.id === controller?.current;

  return (
    showControls && (
      <div
        className="h-10 aspect-square rounded-full bg-brand grid place-items-center cursor-pointer mx-7"
        onClick={handlePlayPause}
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
