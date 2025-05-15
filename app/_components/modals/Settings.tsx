"use client";

import React, { useState } from "react";
import { CloseIcon, UseCasesPersonalIcon } from "../../_assets/icons";
import "overlayscrollbars/overlayscrollbars.css";
import { useModal } from "../../_contexts/ModalContext";
import PreferencesModal from "../settings/Preferences";
import Preferences from "../settings/Preferences";

export default function Settings() {
  const { closeModal } = useModal();

  const [currentSettings, setCurrentSettings] = useState<any>(0);

  const settings = [
    {
      name: "Preferences",
      icon: <UseCasesPersonalIcon className="h-3.5" />,
      component: <Preferences />,
    },
    {
      name: "Preferences",
      icon: <UseCasesPersonalIcon className="h-3.5" />,
      component: <Preferences />,
    },
    {
      name: "Preferences",
      icon: <UseCasesPersonalIcon className="h-3.5" />,
      component: <Preferences />,
    },
  ];

  const handleChangeSettings = (newSettings: any) => {
    currentSettings !== newSettings ? setCurrentSettings(newSettings) : "";
  };

  return (
    // <div className="py-5 flex justify-between items-center border-b-[1px] border-border px-8">
    //       <span className="text-primary font-bold text-lg">
    //         {settings[currentSettings].name}
    //       </span>
    //       <span
    //         onClick={closeModal}
    //         className="group button-icon !h-7 relative !bg-transparent"
    //       >
    //         <span className="absolute inset-0 h-full w-full m-auto scale-125 rounded-full hover:bg-hover group-hover:bg-hover"></span>
    //         <CloseIcon className="z-10 h-3" />
    //       </span>
    //     </div>

    <div className="w-[1000px] h-[630px] rounded-xl bg-foreground ring-1 ring-stroke flex overflow-hidden">
      <div className="p-2 overflow-y-auto flex flex-col gap-[2px] bg-battleground">
        {settings.map((item: any, index: any) => {
          return (
            <div
              key={index}
              onClick={() => handleChangeSettings(index)}
              className={
                "group w-60 py-2 px-5 flex items-center justify-start rounded-[10px] cursor-pointer gap-2 " +
                (currentSettings === index ? "bg-hover" : "hover:bg-hover")
              }
            >
              <span
                className={
                  currentSettings === index
                    ? "text-primary"
                    : "text-inactive group-hover:text-primary"
                }
              >
                {item.icon}
              </span>
              <span
                className={
                  "font-semibold text-sm " +
                  (currentSettings === index
                    ? "text-primary"
                    : "text-inactive group-hover:text-primary")
                }
              >
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* <div className="flex flex-col grow min-h-0"> */}
      <div className="grow overflow-y-auto px-8 py-4">
        {settings[currentSettings].component}
      </div>
    </div>
    // </div>
  );
}
