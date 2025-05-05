"use client";

import React, { useState } from "react";
import { CloseIcon, UseCasesPersonalIcon } from "../../_assets/icons";
import "overlayscrollbars/overlayscrollbars.css";
import { useModal } from "../../_contexts/ModalContext";
import PreferencesModal from "../settings/PreferencesModal";

export default function Settings() {
  const { closeModal } = useModal();

  const [currentSettings, setCurrentSettings] = useState<any>(0);

  const settings = [
    {
      name: "Preferences",
      icon: <UseCasesPersonalIcon className="h-4" />,
      component: <PreferencesModal />,
    },
    {
      name: "Preferences",
      icon: <UseCasesPersonalIcon className="h-4" />,
      component: <PreferencesModal />,
    },
    {
      name: "Preferences",
      icon: <UseCasesPersonalIcon className="h-4" />,
      component: <PreferencesModal />,
    },
  ];

  const handleChangeSettings = (newSettings: any) => {
    currentSettings !== newSettings ? setCurrentSettings(newSettings) : "";
  };

  return (
    <div className="w-[760px] h-[530px] rounded-xl bg-foreground ring-1 ring-stroke flex flex-col">
      <div className="py-5 px-6 flex justify-between items-center border-b-[1px] border-border">
        <span className="text-primary font-bold text-lg">Settings</span>
        <span
          onClick={closeModal}
          className="group button-icon !h-7 relative !bg-transparent"
        >
          <span className="absolute inset-0 h-full w-full m-auto scale-125 rounded-full hover:bg-hover group-hover:bg-hover"></span>
          <CloseIcon className="z-10 h-3" />
        </span>
      </div>

      <div className="flex grow min-h-0">
        {/* <OverlayScrollbarsComponent defer> */}
        <div className="p-2 overflow-y-auto flex flex-col gap-1">
          {settings.map((item: any, index: any) => {
            return (
              <div
                key={index}
                onClick={() => handleChangeSettings(index)}
                className={
                  "group w-[180px] py-2 px-5 flex items-center justify-start rounded-lg cursor-pointer gap-2 " +
                  (currentSettings === index ? "bg-selected" : "hover:bg-hover")
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
        {/* </OverlayScrollbarsComponent> */}

        <div className="grow overflow-y-auto py-5 px-6">
          <PreferencesModal />
        </div>
      </div>
    </div>
  );
}
