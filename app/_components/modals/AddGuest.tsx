"use client";

import React, { useState } from "react";
import { AboutIcon, CloseIcon, LoadingIcon } from "../../_assets/icons";
import "overlayscrollbars/overlayscrollbars.css";
import { useModal } from "../../_contexts/ModalContext";
import TooltipWrapper from "../wrappers/TooltipWrapper";
import AboutTooltip from "../tooltips/AboutTooltip";
import { addScriptGuest, changeNodeSpeaker } from "@/app/_services/client";

export default function AddGuest({ metadata }: any) {
  const { closeModal } = useModal();

  const [newGuestAlias, setNewGuestAlias] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);

  const handleSaveNewGuest = async () => {
    setLoading(true);
    const trimmedNewGuest = newGuestAlias.trim();

    await addScriptGuest(metadata.script, trimmedNewGuest);
    await changeNodeSpeaker(
      metadata?.script?.id,
      metadata?.chapterPosition,
      newGuestAlias,
      true
    );

    setLoading(false);

    closeModal();
  };

  return (
    <div className="w-[370px] rounded-xl bg-foreground ring-1 ring-stroke flex flex-col">
      <div className="pt-4 pb-2 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-primary font-bold text-base">
            Add a guest speaker
          </span>

          <TooltipWrapper
            tooltipType={AboutTooltip}
            data={{
              text: "Guest speakers are generic participants whose chapters can be reassigned to others at any time",
            }}
          >
            <AboutIcon className="text-inactive h-3 hover:text-primary" />
          </TooltipWrapper>
        </div>

        <span
          onClick={closeModal}
          className="group button-icon !h-7 relative !bg-transparent"
        >
          <span className="absolute inset-0 h-full w-full m-auto scale-125 rounded-full hover:bg-hover group-hover:bg-hover"></span>
          <CloseIcon className="z-10 h-3" />
        </span>
      </div>

      <div className="px-6 pt-3 pb-4 flex flex-col justify-start gap-6">
        <div className="flex flex-col items-start gap-4">
          <input
            onChange={(e) => setNewGuestAlias(e.target.value)}
            value={newGuestAlias}
            placeholder="Speaker's name"
            type="text"
            className="px-3.5 h-11 rounded-[10px] border-[1px] border-border outline-none bg-transparent w-full text-sm text-primary text-medium placeholder:text-placeholder ring-2 ring-transparent focus:ring-brand"
          />
          <span className="cursor-pointer hover:underline text-medium text-[13px] text-inactive hover:text-primary">
            Invite participant instead
          </span>
        </div>

        <div className="flex justify-between">
          <button onClick={closeModal} className="btn-3-lg">
            Cancel
          </button>
          <button onClick={handleSaveNewGuest} className="btn-1-lg">
            {loading ? (
              <LoadingIcon className="h-3 animate-spin" />
            ) : (
              <span className="">Done</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
