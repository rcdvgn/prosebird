"use client";

import { AboutIcon, CircledCheckIcon, TrashCanIcon } from "@/app/_assets/icons";
import React, { useRef, useState } from "react";
import OutsideClickHandler from "../wrappers/OutsideClickHandler";
import AboutTooltip from "../tooltips/AboutTooltip";
import TooltipWrapper from "../wrappers/TooltipWrapper";

const Hr = () => {
  return <div className="w-full h-[1px] rounded-full bg-border"></div>;
};

export default function Preferences() {
  const speedMultiplierSelectedOptionContainer = useRef<any>(null);

  const [speedMultiplier, setSpeedMultiplier] = useState<any>(1);
  const [isSpeedMultiplierExpanded, setIsSpeedMultiplierExpanded] =
    useState<any>(false);

  const sections = [{ name: "General" }];

  const speedMultiplierOptions = [
    { name: "0.25x", value: 0.25 },
    { name: "0.5x", value: 0.5 },
    { name: "0.75x", value: 0.75 },
    { name: "1x", value: 1 },
    { name: "1.25x", value: 1.25 },
    { name: "1.5x", value: 1.5 },
    { name: "1.75x", value: 1.75 },
    { name: "2x", value: 2 },
  ];

  const handleCloseSpeedMultiplier = () => {
    isSpeedMultiplierExpanded ? setIsSpeedMultiplierExpanded(false) : "";
  };

  const handleSelectSpeedMultiplier = (selectedOption: any) => {
    selectedOption !== speedMultiplier
      ? setSpeedMultiplier(selectedOption)
      : "";
  };

  const configGroups = [
    {
      name: "General",
      configs: [
        {
          name: "Appearance",
          description: "Sets the visual theme of ProseBird on your device.",
          controller: {
            type: "dropdown",
          },
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-start gap-4">
      {configGroups.map((group: any, index: any) => {
        return <SettingsOptions group={group} groupIndex={index} />;
      })}
    </div>
  );
}

const SettingsOptions = ({ group, groupIndex }: any) => {
  // const controlTypes = []

  return (
    <div key={groupIndex} className="w-full">
      <div className="py-2.5 flex justify-start items-center w-full border-b-[1px] border-border">
        <span className="text-primary font-extrabold text-base">
          {group.name}
        </span>
      </div>

      {/* options container */}
      <div className="flex flex-col gap-[18px] py-4">
        {group.configs.map((config: any, index: any) => {
          return (
            <div
              key={index}
              className="w-full flex items-center justify-between gap-8"
            >
              <div className="flex flex-col gap-1.5 grow">
                <span className="font-semibold text-sm text-primary">
                  {config.name}
                </span>

                <span className="text-tertiary font-semibold text-[13px]">
                  {config.description}
                </span>
              </div>

              <div className="relative w-40 flex justify-end items-center">
                {/* control */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

{
  /* <div
            ref={speedMultiplierSelectedOptionContainer}
            onClick={() =>
              setIsSpeedMultiplierExpanded(!isSpeedMultiplierExpanded)
            }
            className="group h-8 px-4 hover:bg-hover rounded-lg cursor-pointer select-none grid place-items-center"
          >
            <span className="font-bold text-sm text-inactive group-hover:text-primary">
              {speedMultiplier + "x"}
            </span>
          </div>

          <OutsideClickHandler
            onOutsideClick={handleCloseSpeedMultiplier}
            exceptionRefs={[speedMultiplierSelectedOptionContainer]}
          >
            <div
              className={`${
                isSpeedMultiplierExpanded ? "opacity-100" : "opacity-0"
              } absolute right-0 top-[calc(100%+8px)] min-w-[180px] bg-background border-[1px] border-border rounded-[10px] p-2 transition-opacity ease-in-out duration-100`}
            >
              {speedMultiplierOptions.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleSelectSpeedMultiplier(item.value)}
                    className={`group px-3 py-2.5 rounded-lg flex items-center justify-between gap-2 cursor-pointer ${
                      speedMultiplier === item.value
                        ? "bg-selected"
                        : "hover:bg-hover"
                    }`}
                  >
                    <span className="flex items-center justify-start">
                      <span
                        className={`font-bold text-[13px] ${
                          speedMultiplier === item.value
                            ? "text-primary"
                            : "text-inactive group-hover:text-primary"
                        }`}
                      >
                        {item.name}
                      </span>
                    </span>

                    {speedMultiplier === item.value && (
                      <CircledCheckIcon className="h-3.5 text-primary fill-brand" />
                    )}
                  </div>
                );
              })}
            </div>
          </OutsideClickHandler> */
}
