import { PauseIcon, PlayIcon } from "@/app/_assets/icons";
import { usePresentation } from "../_contexts/PresentationContext";

export default function PlayPauseButton({
  handleTimerRun,
  timer,
}: {
  handleTimerRun: any;
  timer: any;
}) {
  const { controller, speaker, scrollMode } = usePresentation();

  return (
    <div
      className="h-12 aspect-square rounded-full bg-brand grid place-items-center cursor-pointer mx-7"
      onClick={
        speaker.id === controller.current && scrollMode === "continuous"
          ? handleTimerRun
          : ""
      }
    >
      {timer.isStarted() ? (
        timer.isRunning() ? (
          <PauseIcon className="w-[12px] fill-text-primary" />
        ) : (
          <PlayIcon className="w-[12px] fill-text-primary" />
        )
      ) : (
        <PlayIcon className="w-[12px] fill-text-primary" />
      )}
    </div>
  );
}
