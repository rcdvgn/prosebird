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
      positionInParticipants = participants.findIndex(
        (p: any) => p.alias === chapterSpeaker?.id
      );
    }

    // Now, if the index was found, get the object.
    if (positionInParticipants > -1) {
      speakerData = participants[positionInParticipants];
    }

    return { speakerData, positionInParticipants };
  };

  const { speakerData, positionInParticipants } = findChapterSpeakerData();

  // useEffect(() => {
  //   console.log(participants);
  // }, [participants]);

  return (
    <NodeViewWrapper className="chapter-header flex gap-4 mb-4 relative">
      <DropdownWrapper
        metadata={{ chapterPosition: position, script: script }}
        dropdownType={AssignChapterDropdown}
        position="bottom"
        selected={[positionInParticipants]}
        options={participants.map((participant: any) => {
          return {
            profilePicture: (
              <ProfilePicture
                profilePictureURL={participant?.profilePictureURL}
                className={`h-[26px]`}
                firstName={
                  participant?.role !== "guest"
                    ? participant?.firstName
                    : participant?.alias
                }
                lastName={
                  participant?.role !== "guest" ? participant?.lastName : null
                }
              />
            ),
            text:
              participant?.role !== "guest"
                ? participant.firstName + " " + participant.lastName
                : participant.alias,
            onClick: () =>
              handleChangeSpeaker(
                participant.role !== "guest"
                  ? participant?.id
                  : (participant.alias, true)
              ),
          };
        })}
      >
        <ProfilePicture
          profilePictureURL={speakerData?.profilePictureURL}
          className={`transition-all duration-300 ease-in-out h-[34px] cursor-pointer`}
          firstName={
            speakerData?.role !== "guest"
              ? speakerData?.firstName
              : speakerData?.alias
          }
          lastName={
            speakerData?.role !== "guest" ? speakerData?.lastName : null
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
