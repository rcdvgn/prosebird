import { PauseIcon, PlayIcon } from "@/app/_assets/icons";
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
