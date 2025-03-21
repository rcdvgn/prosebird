import React from "react";
import ProfilePicture from "../ProfilePicture";
import { usePresentation } from "@/app/_contexts/PresentationContext";
import { BellIcon, SettingsIcon } from "@/app/_assets/icons";

export default function PresentationLeftSideControls() {
  const { speaker } = usePresentation();

  return (
    <div className="h-full">
      <div className="flex items-center gap-1.5 h-20 mx-3 px-3">
        <span className="h-9 w-9 rounded-full grid place-items-center hover-bg-hover cursor-pointer">
          <span className="relative">
            <ProfilePicture
              profilePictureURL={speaker?.profilePictureURL}
              firstName={speaker?.firstName || speaker?.alias}
              lastName={speaker?.lastName || null}
              className="h-8"
            />

            <div className="absolute bottom-[2px] right-[2px] rounded-full bg-online-green h-1.5 w-1.5 ring-[3px] ring-middleground"></div>
          </span>
        </span>
        <span className="presentation-view-options">
          <BellIcon className="h-[18px]" filled={false} />
        </span>
        <span className="presentation-view-options">
          <SettingsIcon className="h-[18px]" filled={false} />
        </span>
      </div>
    </div>
  );
}
