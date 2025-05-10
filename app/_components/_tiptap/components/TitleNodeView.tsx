"use client";

import React, { useEffect } from "react";
import { NodeViewProps, NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import DropdownWrapper from "../../wrappers/DropdownWrapper";
import AssignChapterDropdown from "../../dropdowns/AssignChapterDropdown";
import { changeNodeSpeaker } from "@/app/_services/client";
import ProfilePicture from "../../ProfilePicture";
import { useModal } from "@/app/_contexts/ModalContext";
import AddGuest from "../../modals/AddGuest";

const TitleNodeView: React.FC<NodeViewProps> = (props: any) => {
  const { node } = props;
  const { script, participants } = useScriptEditor();

  const chapterSpeaker = node.attrs?.chapterSpeaker || null;
  const position = node.attrs?.position || 0;

  const placeholder = `Chapter ${position + 1}`;

  const contentText = node.textContent;
  const isEffectivelyEmpty = contentText === "" || contentText === "\u200B";

  const handleChangeSpeaker = async (
    newSpeakerId: any,
    isGuest: any = false
  ) => {
    if (chapterSpeaker.id !== newSpeakerId) {
      await changeNodeSpeaker(script?.id, position, newSpeakerId, isGuest);
    }
  };

  const findChapterSpeakerData = () => {
    let speakerData;
    let positionInParticipants;

    if (!chapterSpeaker.isGuest) {
      positionInParticipants = participants.findIndex(
        (p: any) => p.id === chapterSpeaker?.id
      );
    } else {
      // For guests, you're comparing alias with what's stored in chapterSpeaker.id
      positionInParticipants = participants.findIndex(
        (p: any) => p.role === "guest" && p.alias === chapterSpeaker?.id
      );
    }

    // Now, if the index was found, get the object.
    if (positionInParticipants > -1) {
      speakerData = participants[positionInParticipants];
    }

    return { speakerData, positionInParticipants };
  };

  const { speakerData, positionInParticipants } = findChapterSpeakerData();

  return (
    <NodeViewWrapper className="chapter-header flex gap-4 mb-4 relative">
      <DropdownWrapper
        metadata={{ chapterPosition: position, script: script }}
        dropdownType={AssignChapterDropdown}
        position="bottom"
        selected={[positionInParticipants]}
        optionGroups={[
          participants.map((participant: any) => {
            return {
              profilePicture: (
                <ProfilePicture
                  profilePictureURL={participant?.profilePictureURL}
                  className={`h-[26px]`}
                  displayName={
                    participant?.role !== "guest"
                      ? participant?.displayName
                      : participant?.alias
                  }
                />
              ),
              text:
                participant?.role !== "guest"
                  ? participant.displayName
                  : participant.alias,
              onClick: () =>
                handleChangeSpeaker(
                  participant.role !== "guest"
                    ? participant?.id
                    : participant.alias,
                  participant.role === "guest"
                ),
            };
          }),
        ]}
      >
        <ProfilePicture
          profilePictureURL={speakerData?.profilePictureURL}
          className={`transition-all duration-300 ease-in-out h-[34px] cursor-pointer`}
          displayName={
            speakerData?.role !== "guest"
              ? speakerData?.displayName
              : speakerData?.alias
          }
        />
      </DropdownWrapper>

      <div className="w-full relative">
        {isEffectivelyEmpty && (
          <span className="tiptap-title absolute pointer-events-none !text-placeholder top-0 left-0">
            {placeholder}
          </span>
        )}
        <h1 className="tiptap-title min-h-[24px]">
          <NodeViewContent />
        </h1>
      </div>
    </NodeViewWrapper>
  );
};

export default TitleNodeView;
