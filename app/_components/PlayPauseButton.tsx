import {
  ForwardIcon,
  MicrophoneIcon,
  MicrophoneMutedIcon,
  PauseIcon,
  PlayIcon,
} from "@/app/_assets/icons";
import { usePresentation } from "../_contexts/PresentationContext";
import { useOpenAIRealtime } from "../_contexts/OpenAIRealtimeContext";

export default function PlayPauseButton({
  handleTimerRun,
  timer,
}: {
  handleTimerRun: any;
  timer: any;
}) {
  const { controller, speaker, scrollMode, isMuted, setIsMuted } =
    usePresentation();

  const handleDynamic = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center">
      <span className="presentation-control-options">
        <ForwardIcon className="h-[15px]" />
      </span>

      {scrollMode === "continuous" ? (
        <div className="presentation-control-options" onClick={handleTimerRun}>
          {timer.isStarted() && timer.isRunning() ? (
            <PauseIcon className="h-[18px]" />
          ) : (
            <PlayIcon className="h-[18px]" />
          )}
        </div>
      ) : (
        <div className="presentation-control-options" onClick={handleDynamic}>
          {!isMuted ? (
            <MicrophoneIcon className="h-[18px]" />
          ) : (
            <MicrophoneMutedIcon className="h-[18px]" />
          )}
        </div>
      )}

      <span className="presentation-control-options">
        <ForwardIcon className="h-[15px] scale-x-[-1]" />
      </span>
    </div>
  );
}
