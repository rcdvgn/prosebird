"use client";

import { AboutIcon, CircledCheckIcon, TrashCanIcon } from "@/app/_assets/icons";
import React, { useRef, useState } from "react";
import OutsideClickHandler from "../utils/OutsideClickHandler";
import TooltipWrapper, { AboutTooltip } from "../utils/TooltipWrapper";

const Hr = () => {
  return <div className="w-full h-[1px] rounded-full bg-border"></div>;
};

export default function Preferences() {
  const speedMultiplierSelectedOptionContainer = useRef<any>(null);

  const [speedMultiplier, setSpeedMultiplier] = useState<any>(1);
  const [isSpeedMultiplierExpanded, setIsSpeedMultiplierExpanded] =
    useState<any>(false);

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

  return (
    <div className="flex flex-col gap-6 items-start [&>div]:flex [&>div]:items-center [&>div]:justify-between">
      <div className="w-full">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-sm text-primary">
            Playback speed
          </span>
          <TooltipWrapper
            tooltipType={AboutTooltip}
            data={{
              text: "Setting up your preferred languages helps for more accurate live transcriptions",
            }}
          >
            <AboutIcon className="text-inactive h-3 hover:text-primary" />
          </TooltipWrapper>
        </div>

        <div className="relative">
          <div
            ref={speedMultiplierSelectedOptionContainer}
            onClick={() =>
              setIsSpeedMultiplierExpanded(!isSpeedMultiplierExpanded)
            }
            className="group py-2 px-4 hover:bg-hover rounded-[10px] cursor-pointer select-none"
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
                      {/* <TrashCanIcon
                      className={`h-3 ${
                        speedMultiplier === item.value
                          ? "text-primary"
                          : "text-inactive group-hover:text-primary"
                      }`}
                    /> */}
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
          </OutsideClickHandler>
        </div>
      </div>

      <Hr />
    </div>
  );
}
