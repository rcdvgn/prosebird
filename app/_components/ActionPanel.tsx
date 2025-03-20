"use client";

import ProgressBar from "@/app/_components/ProgressBar";
import PlayPauseButton from "./PlayPauseButton";

import { usePresentation } from "../_contexts/PresentationContext";
import { useMicrophone } from "../_contexts/MicrophoneContext";
import {
  EditTextIcon,
  ForwardIcon,
  FullScreenIcon,
  PauseIcon,
  PlaybackSpeedIcon,
  PlayIcon,
  ScrollModeIcon,
  SyncDevicesIcon,
  TimerIcon,
} from "../_assets/icons";
import ProfilePicture from "./ProfilePicture";

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
  const { scrollMode, speaker } = usePresentation();
  const { microphoneState } = useMicrophone();

  return (
    <div className="flex justify-between items-center h-[76px] w-full px-6 shrink-0">
      {/* <div className="h-full w-full flex items-center justify-center">
        <span className="text-primary">{microphoneState}</span>

        <span className="text-primary">{`Scroll mode: ${scrollMode}`}</span>

        <button
          onClick={toggleScrollMode}
          className="text-primary"
        >{`Switch to ${
          scrollMode === "continuous" ? "Dynamic" : "Continuous"
        }`}</button>

        <
      </div> */}

      <div className="flex items-center gap-4">
        <PlayPauseButton handleTimerRun={handleTimerRun} timer={timer} />

        <div className="flex gap-3.5 items-center grow min-w-0">
          <ProfilePicture
            profilePictureURL={speaker?.profilePictureURL}
            firstName={speaker?.firstName || speaker?.alias}
            lastName={speaker?.lastName || null}
            className="h-8 ring-[1px] ring-[#D23262]"
          />

          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-bold text-primary text-sm hover:underline cursor-pointer truncate">
              The Importance of Nutrition
            </span>
            <span className="font-semibold text-secondary text-xs hover:underline cursor-pointer">
              {(speaker?.firstName || speaker?.alias) +
                " " +
                (speaker?.lastName || null)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="presentation-control-options">
            <EditTextIcon className="h-5" filled={false} />
          </span>

          <span className="presentation-control-options">
            <ScrollModeIcon className="w-5" filled={false} />
            <span className="font-bold text-[13px] mb-[-2px]">Voice sync</span>
          </span>

          <span className="presentation-control-options">
            <PlaybackSpeedIcon className="h-5" filled={false} />
            <span className="font-bold text-[13px] mb-[-2px]">1.5x</span>
          </span>

          <span className="presentation-control-options">
            <TimerIcon className="h-5" filled={false} />
          </span>
        </div>

        <div className="h-6 w-[2px] rounded-full bg-stroke"></div>

        <div className="flex items-center gap-1.5">
          <span className="presentation-control-options">
            <SyncDevicesIcon className="h-4" />
          </span>

          <span className="presentation-control-options">
            <FullScreenIcon className="h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
