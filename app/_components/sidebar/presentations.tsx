import React, { useEffect } from "react";
import { GroupByTime } from "./GroupByTime";
import TooltipWrapper from "../wrappers/TooltipWrapper";
import PresentationTooltip from "../tooltips/PresentationTooltip";
import ProfilePicture from "../ProfilePicture";
import { EndedIcon } from "@/app/_assets/icons";

const Presentations = ({ presentations, people }: any) => {
  if (!presentations || !people) return null;

  return (
    <GroupByTime unorganizedInstances={presentations} criteria="createdAt">
      {(presentation: any) => (
        <TooltipWrapper
          position="right"
          tooltipType={PresentationTooltip}
          delay="0"
          data={{
            presentationHosts: presentation.hosts.reduce(
              (acc: any, host: string) => {
                acc[host] = {
                  firstName: people[host]?.firstName,
                  lastName: people[host]?.lastName,
                  profilePictureURL: people[host]?.profilePictureURL,
                };
                return acc;
              },
              {}
            ),

            presentationParticipants: Object.entries(
              presentation?.participants || {}
            ).reduce(
              (acc: any, [participantId, participant]: [string, any]) => {
                acc[participantId] = {
                  firstName: people[participantId]?.firstName,
                  lastName: people[participantId]?.lastName,
                  profilePictureURL: people[participantId]?.profilePictureURL,
                  isConnected: participant.isConnected,
                };
                return acc;
              },
              {}
            ),
          }}
        >
          <div className="group px-2.5 py-1.5 w-full rounded-[10px] flex items-center justify-start gap-2 cursor-pointer hover:bg-battleground">
            <div className="flex items-center h-8">
              <ProfilePicture
                profilePictureURL={
                  people[presentation.hosts[0]]?.profilePictureURL
                }
                className="h-8"
                firstName={people[presentation.hosts[0]]?.firstName}
                lastName={people[presentation.hosts[0]]?.lastName}
              />
              {/* <div
                style={{ backgroundImage: `url("/pfps/profile1.png")` }}
                className="ring-2 ring-background group-hover:ring-battleground h-full aspect-square rounded-full bg-cover bg-center flex-shrink-0"
              ></div> */}
              {Object.keys(presentation.participants).filter(
                (participantId: any) =>
                  presentation.participants[participantId].role !== "author"
              ).length > 0 && (
                <div className="ring-4 ring-background group-hover:ring-battleground -ml-1 h-full aspect-square grid place-items-center rounded-full bg-selected">
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
                    <EndedIcon className="h-[6px]" />
                    <span className="font-bold text-[11px]">Ended</span>
                  </div>
                )}
              </div>
              <span className="block font-semibold text-xs text-secondary">
                just now
              </span>
            </div>
          </div>
        </TooltipWrapper>
      )}
    </GroupByTime>
  );
};

export default Presentations;
