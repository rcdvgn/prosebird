import { ForwardIcon, PauseIcon, PlayIcon } from "@/app/_assets/icons";
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

  const handlePlayPause = () => {
    if (scrollMode === "continuous") {
      handleTimerRun();
    } else {
      microphoneState === MicrophoneState.Open
        ? stopMicrophone()
        : startMicrophone();
    }
  };

  const showControls = speaker?.id === controller?.current;

  return (
    // showControls && (
    <div className="flex items-center">
      <span className="presentation-control-options">
        <ForwardIcon className="h-[15px]" />
      </span>

      <div className="presentation-control-options" onClick={handlePlayPause}>
        {timer.isStarted() && timer.isRunning() ? (
          <PauseIcon className="h-[18px]" />
        ) : (
          <PlayIcon className="h-[18px]" />
        )}
      </div>

      <span className="presentation-control-options">
        <ForwardIcon className="h-[15px] scale-x-[-1]" />
      </span>
    </div>
    // )
  );
}
