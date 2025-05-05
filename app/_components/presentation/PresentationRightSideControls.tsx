import {
  AboutIcon,
  ChaptersIcon,
  LeaveIcon,
  ParticipantsIcon,
  SearchIcon,
} from "@/app/_assets/icons";
import React from "react";

export default function PresentationRightSideControls({
  sideViewTab,
  setSideViewTab,
}: any) {
  return (
    <div className="h-full">
      <div className="flex items-center gap-1.5 h-20 mx-3 px-3">
        <span className="presentation-view-options">
          <AboutIcon className="h-[18px]" filled={false} />
        </span>

        <span className="presentation-view-options">
          <ParticipantsIcon className="h-[18px]" filled={false} />
        </span>

        <span className="presentation-view-options">
          <ChaptersIcon className="h-[18px]" filled={false} />
        </span>

        <span
          onClick={() => setSideViewTab("search")}
          className="presentation-view-options"
        >
          <SearchIcon className="h-[18px]" filled={false} />
        </span>

        <span className="presentation-view-options hover:!bg-danger-red/15">
          <LeaveIcon className="text-danger-red h-[18px]" />
        </span>
      </div>
    </div>
  );
}
