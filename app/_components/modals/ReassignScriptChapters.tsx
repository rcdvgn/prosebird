"use client";

import { ChevronIcon, NewSpeakerArrowIcon } from "@/app/_assets/icons";
import React, { useEffect, useState } from "react";
import DropdownWrapper from "../wrappers/DropdownWrapper";
import _ from "lodash";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";

export default function ReassignScriptChapters({
  unassignedChaptersBySpeaker,
  removedParticipants,
  setPromptReassignScriptChapters,
  saveParticipants,
  participants,
  nodes,
}: any) {
  const [newChapterGroupSpeakers, setNewChapterGroupSpeakers] = useState<any>(
    {}
  );

  const [newSpeakerInputWithFocus, setNewSpeakerInputWithFocus] =
    useState<any>(null);

  const checkIfPartcipantWasRemoved = (p: any) => {
    return _.some(removedParticipants, (removedParticipant: any) =>
      _.isEqual(removedParticipant, {
        participantId: p.id,
        isGuest: p.role === "guest",
      })
    );
  };

  const partcipantsWithoutRemoved = () => {
    return participants.filter((p: any) => !checkIfPartcipantWasRemoved(p));
  };

  const resolveNewChapterGroupSpeakers = () => {
    const modifiedNewChapterGroupSpeakers: any = {};
    let unresolvedChapterGroupIds: any = [];

    Object.entries(newChapterGroupSpeakers).forEach(
      ([chapterGroupIndex, speaker]: any) => {
        // If no id or guest status, try to resolve
        if (!speaker?.id || !speaker?.isGuest) {
          const remainingPartcipants = partcipantsWithoutRemoved();

          const nameMatches = remainingPartcipants
            .map((p: any) => {
              const isGuest = p?.role === "guest";
              const nameOrAlias = isGuest
                ? p?.alias
                : p?.firstName + " " + p?.lastName;

              if (nameOrAlias === speaker?.nameOrAlias?.trim()) {
                return { id: p?.id, nameOrAlias, isGuest };
              }

              return;
            })
            .filter(Boolean);

          if (nameMatches.length === 1) {
            // Use the matched participant
            modifiedNewChapterGroupSpeakers[chapterGroupIndex] = nameMatches[0];
          } else if (!speaker?.id) {
            // If no match found and no id, mark as unresolved
            unresolvedChapterGroupIds.push(chapterGroupIndex);
            modifiedNewChapterGroupSpeakers[chapterGroupIndex] = {
              ...speaker,
              nameOrAlias: speaker.nameOrAlias.trim(),
            };
          } else {
            // If speaker already has an id, keep it as is
            modifiedNewChapterGroupSpeakers[chapterGroupIndex] = speaker;
          }
        } else {
          // If speaker already has id and guest status, keep it as is
          modifiedNewChapterGroupSpeakers[chapterGroupIndex] = speaker;
        }
      }
    );

    return { modifiedNewChapterGroupSpeakers, unresolvedChapterGroupIds };
  };

  const mapNodesWithNewSpeaker = (matchedNewChapterGroupSpeakers: any) => {
    let oldToNewSpeakersMap: any = {};

    Object.keys(unassignedChaptersBySpeaker).forEach(
      (chapterGroupSpeaker: any) => {
        const newSpeaker = {
          id: matchedNewChapterGroupSpeakers[chapterGroupSpeaker].id,
          isGuest: matchedNewChapterGroupSpeakers[chapterGroupSpeaker].isGuest,
        };

        oldToNewSpeakersMap[chapterGroupSpeaker] = newSpeaker;
      }
    );

    return oldToNewSpeakersMap;
  };

  const updateNodesWithNewSpeakers = (oldToNewSpeakersMap: any) => {
    const oldSpeakersIdentifiers = Object.keys(oldToNewSpeakersMap);
    return nodes.map((chapter: any) => {
      const currentChapterSpeakerIdentifier = `${chapter.speaker.id}_${chapter.speaker.isGuest}`;

      if (oldSpeakersIdentifiers.includes(currentChapterSpeakerIdentifier)) {
        return {
          ...chapter,
          speaker: oldToNewSpeakersMap[currentChapterSpeakerIdentifier],
        };
      }

      return chapter;
    });
  };

  const resolveNodes = () => {
    const {
      modifiedNewChapterGroupSpeakers: matchedNewChapterGroupSpeakers,
      unresolvedChapterGroupIds,
    } = resolveNewChapterGroupSpeakers();
    // console.log(matchedNewChapterGroupSpeakers);

    if (!unresolvedChapterGroupIds.length) {
      const oldToNewSpeakersMap = mapNodesWithNewSpeaker(
        matchedNewChapterGroupSpeakers
      );

      const updatedNodes = updateNodesWithNewSpeakers(oldToNewSpeakersMap);

      saveParticipants(updatedNodes);
    } else {
      console.error("Not all chapters were correcly reassigned");
    }
  };

  return (
    <div className="w-[520px] max-h-[560px] rounded-xl bg-foreground ring-1 ring-stroke flex flex-col">
      <div className="py-2 px-6">
        <span className="block text-primary font-bold text-base py-2.5">
          Resolve unassigned chapters
        </span>

        <span className="block text-secondary font-medium text-sm">
          Decide the new speakers of the unassigned chapters.
        </span>
      </div>

      <div className="px-6 pt-3 pb-4 flex flex-col justify-start gap-6">
        {unassignedChaptersBySpeaker &&
          Object.entries(unassignedChaptersBySpeaker).map(
            ([chapterGroupSpeaker, chapterGroup]: any) => {
              const chapterGroupOldSpeakerData = participants.find(
                (p: any) =>
                  (p.role === "guest") === chapterGroup[0].oldSpeaker.isGuest &&
                  (p?.id || p?.alias) === chapterGroup[0].oldSpeaker.id
              );

              return (
                <div key={chapterGroupSpeaker} className="flex flex-col">
                  <div className="">
                    <div className="mb-4 w-full flex flex-wrap gap-2">
                      {chapterGroup.map((chapter: any, index: any) => {
                        return (
                          <span
                            key={index}
                            className="bg-hover-solid rounded-[7px] cursor-default py-1.5 px-2 font-semibold text-xs text-secondary"
                          >
                            {chapter.title}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <div className="w-[calc(50%-22px)] h-11 rounded-[10px] bg-attention-red/10 flex items-center justify-start px-3.5 cursor-not-allowed">
                        <span className="font-semibold text-sm text-attention-red">
                          {chapterGroupOldSpeakerData?.firstName +
                            " " +
                            chapterGroupOldSpeakerData?.lastName ||
                            chapterGroupOldSpeakerData?.alias}
                        </span>
                      </div>

                      <NewSpeakerArrowIcon className="h-3 text-placeholder" />

                      <DropdownWrapper
                        className="w-[calc(50%-22px)]"
                        isVisible={
                          newSpeakerInputWithFocus === chapterGroupSpeaker
                        }
                        setIsVisible={() => null}
                        optionGroups={[
                          partcipantsWithoutRemoved().map((p: any) => {
                            const nameOrAlias =
                              p?.role !== "guest"
                                ? p?.firstName + " " + p?.lastName
                                : p?.alias;
                            return {
                              text: nameOrAlias,
                              onClick: () =>
                                setNewChapterGroupSpeakers((curr: any) => ({
                                  ...curr,
                                  [chapterGroupSpeaker]: {
                                    id: p.id || p.alias,
                                    isGuest: p?.role === "guest",
                                    nameOrAlias,
                                  },
                                })),
                            };
                          }),
                        ]}
                      >
                        <input
                          type="text"
                          value={
                            newChapterGroupSpeakers[chapterGroupSpeaker]
                              ?.nameOrAlias || ""
                          }
                          onFocus={() =>
                            setNewSpeakerInputWithFocus(chapterGroupSpeaker)
                          }
                          onBlur={() => setNewSpeakerInputWithFocus(null)}
                          placeholder="Select a speaker"
                          className="input-default w-full"
                          onChange={(e) =>
                            setNewChapterGroupSpeakers((curr: any) => ({
                              ...curr,
                              [chapterGroupSpeaker]: {
                                nameOrAlias: e.target.value,
                              },
                            }))
                          }
                        />
                      </DropdownWrapper>
                    </div>
                  </div>
                </div>
              );
            }
          )}

        <div className="flex justify-between">
          <button
            onClick={() => setPromptReassignScriptChapters(null)}
            className="btn-3-lg"
          >
            <span className="">Back</span>
          </button>

          <div onClick={resolveNodes} className="flex gap-5 items-center">
            <button className="btn-1-lg">Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}
