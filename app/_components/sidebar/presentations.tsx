import React, { useState } from "react";
import { GroupByTime } from "./GroupByTime";
import TooltipWrapper from "../wrappers/TooltipWrapper";
import PresentationTooltip from "../tooltips/PresentationTooltip";
import ProfilePicture from "../ProfilePicture";
import { ClearIcon } from "@/app/_assets/icons";
import GenericFilters, { FilterConfig } from "../filters/GenericFilters";

interface Presentation {
  id: string;
  title: string;
  status: "active" | "ended" | string;
}

interface PresentationsProps {
  presentations: Presentation[];
  people: any;
}

const Presentations: React.FC<PresentationsProps> = ({
  presentations,
  people,
}) => {
  if (!presentations || !people) return null;

  // Only one toggle should be active at a time.
  const [allFilter, setAllFilter] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<boolean>(false);
  const [endedFilter, setEndedFilter] = useState<boolean>(false);

  const filtersConfig: FilterConfig[] = [
    {
      type: "toggle",
      label: "All",
      value: allFilter,
      onToggle: () => setAllFilter((prev) => !prev),
      onClear: () => setAllFilter(false),
      excludes: ["Active", "Ended"],
    },
    {
      type: "toggle",
      label: "Active",
      value: activeFilter,
      onToggle: () => setActiveFilter((prev) => !prev),
      onClear: () => setActiveFilter(false),
      excludes: ["All", "Ended"],
    },
    {
      type: "toggle",
      label: "Ended",
      value: endedFilter,
      onToggle: () => setEndedFilter((prev) => !prev),
      onClear: () => setEndedFilter(false),
      excludes: ["All", "Active"],
    },
  ];

  const filterPresentations = (presentations: Presentation[]) => {
    if (allFilter || (!activeFilter && !endedFilter)) {
      return presentations;
    } else if (activeFilter) {
      return presentations.filter((p) => p.status === "active");
    } else if (endedFilter) {
      return presentations.filter((p) => p.status === "ended");
    }
    return presentations;
  };

  const filteredPresentations = filterPresentations(presentations);

  return (
    <>
      <div className="relative flex w-full mb-5 h-8 overflow-x-clip overflow-y-visible">
        <GenericFilters filters={filtersConfig} />
      </div>

      <GroupByTime
        unorganizedInstances={filteredPresentations}
        criteria="createdAt"
      >
        {(presentation: any) => (
          <TooltipWrapper
            position="right"
            tooltipType={PresentationTooltip}
            delay={0}
            data={{
              presentationHosts: presentation.hosts.reduce(
                (acc: any, host: string) => {
                  acc[host] = {
                    displayName: people[host]?.displayName,
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
                    displayName: people[participantId]?.displayName,
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
                  displayName={people[presentation.hosts[0]]?.displayName}
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
                    <div className="bg-danger-red/15 rounded-full py-1 px-2 flex items-center gap-1 text-danger-red">
                      <div className="bg-danger-red rounded-full h-[5px] aspect-square"></div>
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
                      <ClearIcon className="h-[6px]" />
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
    </>
  );
};

export default Presentations;
