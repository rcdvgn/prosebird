import React from "react";
import { GroupByTime } from "./GroupByTime";

const Presentations = ({ presentations, people }: any) => {
  if (!presentations || !people) return null;

  return (
    <GroupByTime unorganizedInstances={presentations} criteria="createdAt">
      {(presentation: any) => (
        <div className="group px-2.5 py-1.5 w-full rounded-[10px] flex items-center justify-start gap-2 cursor-pointer hover:bg-battleground">
          <div className="flex items-center h-8">
            <div
              style={{ backgroundImage: `url("/pfps/profile1.png")` }}
              className="ring-2 ring-background group-hover:ring-battleground h-full aspect-square rounded-full bg-cover bg-center flex-shrink-0"
            ></div>
            {Object.keys(presentation.participants).filter(
              (participantId: any) =>
                presentation.participants[participantId].role !== "author"
            ).length > 0 && (
              <div className="ring-2 ring-background group-hover:ring-battleground -ml-2 h-full aspect-square grid place-items-center rounded-full bg-selected">
                <span className="text-secondary font-bold text-[13px]">
                  +
                  {
                    Object.keys(presentation.participants).filter(
                      (participantId: any) =>
                        presentation.participants[participantId].role !==
                        "author"
                    ).length
                  }
                </span>
              </div>
            )}
          </div>
          <div className="grow min-w-0">
            <div className="w-full flex items-center gap-2">
              <span className="font-bold text-[13px] text-primary truncate">
                {presentation.title}
              </span>
              {presentation.status === "active" ? (
                <div className="bg-live-red/15 rounded-full py-1 px-2 flex items-center gap-1 text-live-red">
                  <div className="bg-live-red rounded-full h-[5px] aspect-square"></div>
                  <span className="font-bold text-[11px]">
                    {
                      Object.values(presentation.participants).filter(
                        (participant: any) => participant.isConnected
                      ).length
                    }
                  </span>
                </div>
              ) : (
                <div className="bg-placeholder/15 rounded-full py-1 px-2 flex items-center gap-1 text-placeholder">
                  <span className="font-bold text-[11px]">Ended</span>
                </div>
              )}
            </div>
            <span className="block font-semibold text-xs text-secondary">
              just now
            </span>
          </div>
        </div>
      )}
    </GroupByTime>
  );
};

export default Presentations;
