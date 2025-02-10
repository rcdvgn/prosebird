"use client";

import { forwardRef, useEffect } from "react";
import ProfilePicture from "../ProfilePicture";

const PresentationTooltip = forwardRef<any, any>(
  ({ data, className, style }, ref) => {
    return (
      <div
        ref={ref}
        className={`tooltip-presentation ${className}`}
        style={style}
      >
        <div className="">
          <span className="block mb-2 font-semibold text-[13px] text-secondary">
            Hosts
          </span>
          <div className="flex items-center gap-2">
            {data.presentationHosts &&
              Object.values(data.presentationHosts).map(
                (host: any, index: any) => {
                  return (
                    <div key={index} className="relative">
                      <ProfilePicture
                        profilePictureURL={host?.profilePictureURL}
                        className={`h-8 ${
                          host.isConnected ? "" : "opacity-80"
                        }`}
                        firstName={host?.firstName}
                        lastName={host?.lastName}
                      />
                      <div
                        className={`absolute m-auto right-0 bottom-0 h-2 w-2 ring-4 ring-foreground ${
                          host.isConnected
                            ? "bg-online-green"
                            : "border-[2px] border-placeholder bg-foreground"
                        } rounded-full`}
                      ></div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
        <div className="">
          <span className="block mb-2 font-semibold text-[13px] text-secondary">
            Participants
          </span>
          <div className="flex items-center gap-2">
            {data.presentationParticipants &&
              Object.entries(data.presentationParticipants).map(
                ([participantId, participant]: any, index: any) => {
                  //   if (
                  //     !Object.keys(data.presentationHosts).includes(participantId)
                  //   )
                  return (
                    <div key={participantId} className="relative">
                      <ProfilePicture
                        profilePictureURL={participant?.profilePictureURL}
                        className={`h-8 ${
                          participant.isConnected ? "" : "opacity-80"
                        }`}
                        firstName={participant?.firstName}
                        lastName={participant?.lastName}
                      />

                      <div
                        className={`absolute m-auto right-0 bottom-0 h-2 w-2 ring-4 ring-foreground ${
                          participant.isConnected
                            ? "bg-online-green"
                            : "border-[2px] border-placeholder bg-foreground"
                        } rounded-full`}
                      ></div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
    );
  }
);

export default PresentationTooltip;
