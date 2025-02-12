import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloseIcon } from "@/app/_assets/icons";
import { GroupByTime } from "./GroupByTime";
import ProfilePicture from "../ProfilePicture";
import { timeAgoFormatter } from "@/app/_utils/timeAgoFormatter";
import { notificationTypes } from "@/app/_lib/notificationTypes";

const Inbox = ({ notifications, people }: any) => {
  if (!notifications || !people) return null;

  const router = useRouter();

  return (
    <GroupByTime unorganizedInstances={notifications} criteria="createdAt">
      {(notification: any) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ProfilePicture
              profilePictureURL={
                people[notification.data.presentationHosts[0]]
                  ?.profilePictureURL
              }
              className="h-8"
              firstName={
                people[notification.data.presentationHosts[0]]?.firstName
              }
              lastName={
                people[notification.data.presentationHosts[0]]?.lastName
              }
            />
            <div className="grow leading-4">
              <span className="font-bold text-[13px] text-primary hover:underline cursor-pointer">
                {people[notification.data.presentationHosts[0]]?.firstName +
                  " " +
                  people[notification.data.presentationHosts[0]]?.lastName}
              </span>
              <span className="font-medium text-xs text-primary">
                {" " + notificationTypes[notification.type].text[0] + " "}
              </span>
              <span className="font-medium text-xs text-secondary">
                {timeAgoFormatter(notification.createdAt)}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              router.push(`/p/${notification.data.presentationCode}`)
            }
            className="hover:underline border-none outline-none font-bold text-[13px] text-brand px-2 py-1"
          >
            Join
          </button>
        </div>
      )}
    </GroupByTime>
  );
};

export default Inbox;
