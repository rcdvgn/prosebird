"use client";

import { AboutIcon, CircledCheckIcon, TrashCanIcon } from "@/app/_assets/icons";
import React, { useRef, useState } from "react";
import OutsideClickHandler from "../utils/OutsideClickHandler";

const Hr = () => {
  return <div className="w-full"></div>;
};

export default function Preferences() {
  const playbackSpeedSelectedOptionContainer = useRef<any>(null);

  const [playbackSpeed, setPlaybackSpeed] = useState<any>(1);
  const [isPlaybackSpeedExpanded, setIsPlaybackSpeedExpanded] =
    useState<any>(false);

  const playbackSpeedOptions = [
    { name: "0.25x", value: 0.25 },
    { name: "0.5x", value: 0.5 },
    { name: "0.75x", value: 0.75 },
    { name: "1x", value: 1 },
    { name: "1.25x", value: 1.25 },
    { name: "1.5x", value: 1.5 },
    { name: "1.75x", value: 1.75 },
    { name: "2x", value: 2 },
  ];

  const handleClosePlaybackSpeed = () => {
    isPlaybackSpeedExpanded ? setIsPlaybackSpeedExpanded(false) : "";
  };

  const handleSelectPlaybackSpeed = (selectedOption: any) => {
    selectedOption !== playbackSpeed ? setPlaybackSpeed(selectedOption) : "";
  };

  return (
    <div className="flex flex-col gap-6 items-start [&>div]:flex [&>div]:items-center [&>div]:justify-between">
      <div className="w-full">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-sm text-primary">
            Playback speed
          </span>
          <AboutIcon className="text-secondary h-3" />
        </div>

        <div className="relative">
          <div
            ref={playbackSpeedSelectedOptionContainer}
            onClick={() => setIsPlaybackSpeedExpanded(!isPlaybackSpeedExpanded)}
            className="group py-2 px-4 hover:bg-hover rounded-[10px] cursor-pointer select-none"
          >
            <span className="font-bold text-sm text-inactive group-hover:text-primary">
              {playbackSpeed}
            </span>
          </div>

          <OutsideClickHandler
            onOutsideClick={handleClosePlaybackSpeed}
            exceptionRefs={[playbackSpeedSelectedOptionContainer]}
          >
            <div
              className={`${
                isPlaybackSpeedExpanded ? "opacity-100" : "opacity-0"
              } absolute right-0 top-[calc(100%+8px)] min-w-[180px] bg-background border-[1px] border-border rounded-[10px] p-2 transition-opacity ease-in-out duration-100`}
            >
              {playbackSpeedOptions.map((item: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleSelectPlaybackSpeed(item.value)}
                    className={`group px-3 py-2.5 rounded-md flex items-center justify-between gap-2 cursor-pointer ${
                      playbackSpeed === item.value
                        ? "bg-selected"
                        : "hover:bg-hover"
                    }`}
                  >
                    <span className="flex items-center justify-start">
                      {/* <TrashCanIcon
                      className={`h-3 ${
                        playbackSpeed === item.value
                          ? "text-primary"
                          : "text-inactive group-hover:text-primary"
                      }`}
                    /> */}
                      <span
                        className={`font-bold text-[13px] ${
                          playbackSpeed === item.value
                            ? "text-primary"
                            : "text-inactive group-hover:text-primary"
                        }`}
                      >
                        {item.name}
                      </span>
                    </span>

                    {playbackSpeed === item.value && (
                      <CircledCheckIcon className="h-3.5 text-primary fill-brand" />
                    )}
                  </div>
                );
              })}
            </div>
          </OutsideClickHandler>
        </div>
      </div>
    </div>
  );
}
