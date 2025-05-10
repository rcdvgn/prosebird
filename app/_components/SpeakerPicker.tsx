"use client";
import React, { useState, useEffect, useRef } from "react";
import { addScriptGuest, changeNodeSpeaker } from "../_services/client";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import OutsideClickHandler from "./wrappers/OutsideClickHandler";

export default function SpeakerPicker({
  position,
  speakerPicker,
  setSpeakerPicker,
  speakerPictureRef,
}: {
  position: any;
  speakerPicker: any;
  setSpeakerPicker: any;
  speakerPictureRef: any;
}) {
  const { script, nodes, participants } = useScriptEditor();

  const addNewUserInput = useRef<any>(null);

  const [newGuest, setNewGuest] = useState<any>("");
  const [isNewGuestInputVisible, setIsNewGuestInputVisible] =
    useState<any>(false);

  const handleChangeSpeaker = async (speakerId: any) => {
    await changeNodeSpeaker(script?.id, position, speakerId);
    setSpeakerPicker(false);
  };

  const showNewGuestInput = () => {
    if (!isNewGuestInputVisible) {
      setIsNewGuestInputVisible(true);
      newGuest.length === 0 ? "" : setNewGuest("");
      addNewUserInput.current.focus();
    }
  };

  const handleNewGuestChange = (e: any) => {
    setNewGuest(e.target.value);
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      if (newGuest.length && !script.guests.includes(newGuest)) {
        const trimmedNewGuest = newGuest.trim();

        await handleChangeSpeaker(trimmedNewGuest);
        await addScriptGuest(script, trimmedNewGuest);

        setIsNewGuestInputVisible(false);
      }
    }
  };

  const handleOutsideClick = () => {
    speakerPicker ? setSpeakerPicker(false) : "";
  };

  return (
    <OutsideClickHandler
      onOutsideClick={handleOutsideClick}
      exceptionRefs={[speakerPictureRef]}
    >
      <div className="w-64 translate-x-[17rem] absolute left-0 top-0 m-auto p-2 rounded-[10px] bg-foreground border-[1px] border-border">
        <div className="flex justify-between px-2 font-semibold text-sm mb-1">
          <span className="text-text-secondary">Participants</span>
          <span
            onClick={showNewGuestInput}
            className={`cursor-pointer text-primary hover:underline rounded-[8px] h-full px-2 ${
              isNewGuestInputVisible ? "opacity-50" : "opacity-100"
            }`}
          >
            Add
          </span>
        </div>
        <div className="flex flex-col">
          <input
            ref={addNewUserInput}
            onChange={handleNewGuestChange}
            onKeyDown={handleKeyDown}
            value={newGuest}
            type="text"
            className={`bg-transparent focus:bg-background text-primary font-semibold text-base px-4 py-2 rounded-[8px] outline-none ring-none border-border border-[1px] ${
              isNewGuestInputVisible ? "block" : "hidden"
            }`}
            placeholder="New participant"
          />

          {participants &&
            participants.map((participant: any, index: any) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    participant.id !== nodes[position].speaker
                      ? handleChangeSpeaker(participant.id)
                      : "";
                  }}
                  className="cursor-pointer text-primary font-semibold text-base px-4 py-2 hover:bg-brand rounded-[8px] truncate"
                >
                  {participant.role === "guest"
                    ? participant.id
                    : `${participant.displayName}`}
                  {participant.id === nodes[position].speaker ? " •" : ""}
                </div>
              );
            })}
        </div>
      </div>
    </OutsideClickHandler>
  );
}
