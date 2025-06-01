import {
  ForwardIcon,
  MicrophoneIcon,
  MicrophoneMutedIcon,
  PauseIcon,
  PlayIcon,
} from "@/app/_assets/icons";
import { usePresentation } from "../_contexts/PresentationContext";
import { MicrophoneState, useMicrophone } from "../_contexts/MicrophoneContext";

export default function PlayPauseButton({
  handleTimerRun,
  timer,
}: {
  handleTimerRun: any;
  timer: any;
}) {
  const { controller, speaker, scrollMode } = usePresentation();
  const { startMicrophone, stopMicrophone, microphoneState } = useMicrophone();

  const handleDynamic = () => {
    microphoneState === MicrophoneState.Open
      ? stopMicrophone()
      : startMicrophone();
  };

  return (
    // showControls && (
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
          {microphoneState === MicrophoneState.Open ? (
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
    // )
  );
}
