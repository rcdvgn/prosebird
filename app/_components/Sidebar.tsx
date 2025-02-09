"use client";

import { useState, useEffect } from "react";
import {
  AddIcon,
  CloseIcon,
  DashboardIcon,
  EndedIcon,
  HelpIcon,
  InboxIcon,
  LogoIcon,
  MoreIcon,
  PresentationIcon,
  ScriptIcon,
  SearchIcon,
  SettingsIcon,
  ShrinkIcon,
  SideBarExpandIcon,
} from "../_assets/icons";

import { useRouter } from "next/navigation";

import { getPeople, getUserScripts } from "@/app/_services/client";

import { useAuth } from "../_contexts/AuthContext";

import { useRecentScripts } from "@/app/_contexts/RecentScriptsContext";
import { useModal } from "../_contexts/ModalContext";
import Settings from "./modals/Settings";
import Input3 from "./ui/Input3";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import ProfilePicture from "./ProfilePicture";
import { notificationTypes } from "../_lib/notificationTypes";
import { timeAgoFormatter } from "../_utils/timeAgoFormatter";
import { groupInstancesByTime } from "../_utils/groupInstancesByTime";
import capitalizeFirstLetter from "../_utils/capitalizeFirstLetter";
import Scripts from "./sidebar/Scripts";
import Presentations from "./sidebar/Presentations";
import Inbox from "./sidebar/Inbox";

// const Inbox = ({ notifications, people }: any) => {
//   const router = useRouter();

//   if (!notifications || !people) return null;

//   const organizedNotifications = groupInstancesByTime(
//     notifications,
//     "createdAt"
//   );

//   return (
//     <>
//       <div className="w-full h-8 flex items-center justify-start gap-2 mb-5">
//         <div className="bg-battleground rounded-full h-full aspect-square text-inactive grid place-items-center hover:bg-hover hover:text-primary cursor-pointer">
//           <CloseIcon className="h-2.5" />
//         </div>

//         <div className="bg-brand rounded-full h-[30px] flex justify-center items-center px-3.5 cursor-pointer text-primary">
//           <span className="font-bold text-[13px]">Active</span>
//         </div>

//         <div className="bg-battleground rounded-full h-full flex justify-center items-center px-3.5 cursor-pointer text-inactive hover:text-primary hover:bg-hover">
//           <span className="font-bold text-[13px]">Solo</span>
//         </div>
//       </div>

//       <div className="flex flex-col gap-8">
//         {Object.entries(organizedNotifications).map(([slot, notifs]: any) => {
//           return (
//             <div key={slot}>
//               <span className="block font-semibold text-xs text-secondary mb-2">
//                 {capitalizeFirstLetter(slot)}
//               </span>

//               <div className="flex flex-col gap-4">
//                 {notifs.map((notification: any, index: any) => {
//                   return (
//                     <div key={index} className="flex items-center gap-4">
//                       <div className="flex items-center gap-2">
//                         <ProfilePicture
//                           profilePictureURL={
//                             people[notification.data.presentationHost]
//                               ?.profilePictureURL
//                           }
//                           className="h-8"
//                         />

//                         <div className="grow leading-4">
//                           <span className="font-bold text-[13px] text-primary hover:underline cursor-pointer">
//                             {people[notification.data.presentationHost]
//                               .firstName +
//                               " " +
//                               people[notification.data.presentationHost]
//                                 .lastName}
//                           </span>
//                           <span className="font-medium text-xs text-primary">
//                             {" " +
//                               notificationTypes[notification.type].text[0] +
//                               " "}
//                           </span>
//                           <span className="font-medium text-xs text-secondary">
//                             {timeAgoFormatter(notification.createdAt)}
//                           </span>
//                         </div>
//                       </div>

//                       <button
//                         onClick={() =>
//                           router.push(
//                             `/p/${notification.data.presentationCode}`
//                           )
//                         }
//                         className="hover:underline border-none outline-none font-bold text-[13px] text-brand px-2 py-1"
//                       >
//                         Join
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// const Scripts = ({ scripts, people }: any) => {
//   if (!scripts || !people) return null;

//   const { script: currentScript } = useScriptEditor();
//   const router = useRouter();

//   const organizedScripts = groupInstancesByTime(scripts, "createdAt");

//   return (
//     <div className="flex flex-col gap-8">
//       {Object.entries(organizedScripts).map(([slot, scrips]: any) => {
//         return (
//           <div key={slot}>
//             <span className="block font-semibold text-xs text-secondary mb-2">
//               {capitalizeFirstLetter(slot)}
//             </span>

//             <div className="flex flex-col gap-4">
//               {scrips.map((script: any, index: any) => {
//                 return (
//                   <div
//                     key={index}
//                     onClick={() => router.push(`/file/${script.id}`)}
//                     className={`group h-11 w-full rounded-[10px] pl-[18px] pr-1 flex items-center justify-between cursor-pointer ${
//                       currentScript?.id === script.id
//                         ? "bg-battleground text-primary"
//                         : "text-inactive hover:text-primary hover:bg-hover"
//                     }`}
//                   >
//                     <div className="flex justify-start items-center grow min-w-0 gap-3">
//                       <ScriptIcon className="h-4 shrink-0" />
//                       <span className="block h-[18px] font-semibold text-[13px] truncate">
//                         {script?.title}
//                       </span>
//                     </div>

//                     <span
//                       className={`button-icon !bg-transparent ${
//                         currentScript?.id === script.id
//                           ? "text-primary"
//                           : "opacity-0 group-hover:opacity-100"
//                       }`}
//                     >
//                       <MoreIcon className="h-3" />
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// const Presentations = ({ presentations, people }: any) => {
//   if (!presentations || !people) return null;

//   const organizedPresentations = groupInstancesByTime(
//     presentations,
//     "createdAt"
//   );

//   return (
//     <div className="flex flex-col gap-8">
//       {Object.entries(organizedPresentations).map(([slot, presents]: any) => {
//         return (
//           <div key={slot}>
//             <span className="block font-semibold text-xs text-secondary mb-2">
//               {capitalizeFirstLetter(slot)}
//             </span>

//             <div className="flex flex-col gap-4">
//               {presents.map((presentation: any, index: any) => {
//                 return (
//                   <div
//                     key={index}
//                     className="group px-2.5 py-1.5 w-full rounded-[10px] flex items-center justify-start gap-2 cursor-pointer hover:bg-battleground"
//                   >
//                     <div className="flex items-center h-8">
//                       <div
//                         style={{
//                           backgroundImage: `url("/pfps/profile1.png")`,
//                         }}
//                         className="ring-2 ring-background group-hover:ring-battleground h-full aspect-square rounded-full bg-cover bg-center flex-shrink-0"
//                       ></div>

//                       {Object.keys(presentation.participants).filter(
//                         (participantId: any) =>
//                           presentation.participants[participantId].role !==
//                           "author"
//                       ).length > 0 && (
//                         <div className="ring-2 ring-background group-hover:ring-battleground -ml-2 h-full aspect-square grid place-items-center rounded-full bg-selected">
//                           <span className="text-secondary font-bold text-[13px]">
//                             +
//                             {
//                               Object.keys(presentation.participants).filter(
//                                 (participantId: any) =>
//                                   presentation.participants[participantId]
//                                     .role !== "author"
//                               ).length
//                             }
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="grow min-w-0">
//                       <div className="w-full flex items-center gap-2">
//                         <span className="font-bold text-[13px] text-primary truncate">
//                           {presentation.title}
//                         </span>

//                         {presentation.status === "active" ? (
//                           <div className="bg-live-red/15 rounded-full py-1 px-2 flex items-center gap-1 text-live-red">
//                             <div className="bg-live-red rounded-full h-[5px] aspect-square"></div>
//                             <span className="font-bold text-[11px]">
//                               {
//                                 Object.values(presentation.participants).filter(
//                                   (participant: any) => participant.isConnected
//                                 ).length
//                               }
//                             </span>
//                           </div>
//                         ) : (
//                           <div className="bg-placeholder/15 rounded-full py-1 px-2 flex items-center gap-1 text-placeholder">
//                             <EndedIcon className="h-1.5" />
//                             <span className="font-bold text-[11px]">Ended</span>
//                           </div>
//                         )}
//                       </div>
//                       <span className="block font-semibold text-xs text-secondary">
//                         just now
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

export default function Sidebar(fileId: any) {
  const { openModal, currentModal } = useModal();
  const { user, logout } = useAuth();
  const { scripts, presentations, notifications, people } = useRealtimeData();

  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<any>(null);

  const sidebarTabs: any = {
    scripts: {
      icon: <ScriptIcon className="h-5" />,
      name: "Scripts",
    },
    presentations: {
      icon: <PresentationIcon className="w-5" />,
      name: "Presentations",
    },
    inbox: {
      icon: <InboxIcon className="h-5" />,
      name: "Inbox",
    },
  };

  // const [scriptCount, setScriptCount] = useState(1);

  const handleSettings = () => {
    openModal({ content: <Settings />, name: "settings" });
  };

  return (
    <div className="flex shrink-0">
      <div className="flex flex-col items-center justify-start w-[80px]">
        <div className="h-[68px] w-full grid place-items-center">
          <span
            className="cursor-pointer"
            onClick={() => router.push(`/files`)}
          >
            <LogoIcon className="h-5" />
          </span>
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-col items-center justify-start gap-4 w-full px-[18px] py-2.5">
            {Object.entries(sidebarTabs).map(
              ([tabName, tabValues]: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      currentTab === tabName
                        ? setCurrentTab(null)
                        : setCurrentTab(tabName)
                    }
                    className={`h-[44px] aspect-square grid place-items-center transition-all ease-in-out duration-150 rounded-xl cursor-pointer ${
                      currentTab === tabName
                        ? "text-brand bg-brand/15 hover:bg-brand/20"
                        : "text-placeholder hover:text-primary hover:bg-hover"
                    }`}
                  >
                    {tabValues.icon}
                  </div>
                );
              }
            )}
          </div>

          <div className="w-7 h-[1px] rounded-full bg-border"></div>

          <div className="flex flex-col items-center justify-start gap-4 w-full px-[18px] py-2.5">
            <div className="h-[44px] aspect-square grid place-items-center transition-all ease-in-out duration-150 rounded-xl cursor-pointer text-placeholder hover:text-primary hover:bg-hover">
              <HelpIcon className="h-5" />
            </div>

            <div
              onClick={handleSettings}
              className={`h-[44px] aspect-square grid place-items-center transition-all ease-in-out duration-150 rounded-xl cursor-pointer hover:bg-hover ${
                currentModal?.name === "settings"
                  ? "text-primary"
                  : "text-placeholder hover:text-primary"
              }`}
            >
              <SettingsIcon className="h-5" />
            </div>
          </div>
        </div>
      </div>

      {currentTab && (
        <div
          className={`w-[300px] pl-2 pr-4 ${currentTab ? "block" : "hidden"}`}
        >
          <div className="h-[68px] w-full flex justify-between items-center">
            <Input3 />

            <span
              onClick={() => setCurrentTab(null)}
              className="group button-icon !bg-transparent text-placeholder"
            >
              <ShrinkIcon className="h-3 transition-transform duration-200 ease-in-out group-hover:-translate-x-1" />
            </span>
          </div>

          <div className="">
            <div className="pb-4 flex items-center justify-between">
              <span className="text-base font-bold text-primary">
                {sidebarTabs[currentTab]?.name}
              </span>
            </div>

            <div
              className={
                sidebarTabs[currentTab]?.name === "Scripts" ? "block" : "hidden"
              }
            >
              <Scripts scripts={scripts} people={people} />
            </div>

            <div
              className={
                sidebarTabs[currentTab]?.name === "Presentations"
                  ? "block"
                  : "hidden"
              }
            >
              <Presentations presentations={presentations} people={people} />
            </div>

            <div
              className={
                sidebarTabs[currentTab]?.name === "Inbox" ? "block" : "hidden"
              }
            >
              <Inbox notifications={notifications} people={people} />{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
