"use client";

import React, { useEffect, useState } from "react";
import {
  CloseIcon,
  LinkIcon,
  LoadingIcon,
  TriangleExpandIcon,
} from "../../_assets/icons";
import "overlayscrollbars/overlayscrollbars.css";
import { useModal } from "../../_contexts/ModalContext";
import ProfilePicture from "../ProfilePicture";
import _ from "lodash";
import DropdownWrapper from "../wrappers/DropdownWrapper";
import SimpleSelectedDropdown from "../dropdowns/SimpleSelectedDropdown";
import { updateScriptParticipants } from "@/app/_services/client";

const Participant = ({
  isAuthor,
  participant,
  metadata,
  rolesOptions,
  handleRevokeAccess,
  removedParticipants,
}: any) => {
  const [isDropdownExpanded, setIsDropdownExpanded] = useState<any>(false);

  const containsInRevokedParticipants = _.some(
    removedParticipants,
    (item: any) =>
      _.isEqual(item, {
        participantId: participant?.id,
        isGuest: participant?.role === "guest",
      })
  );

  return (
    <>
      <div className="flex gap-4 items-center">
        <ProfilePicture
          profilePictureURL={participant?.profilePictureURL}
          className={`h-8`}
          firstName={
            participant?.role !== "guest"
              ? participant?.firstName
              : participant?.alias
          }
          lastName={
            participant?.role !== "guest" ? participant?.lastName : null
          }
        />

        <div className="flex flex-col gap-1">
          <div className="font-semibold text-sm -mb-1">
            <span className="text-primary inline">
              {participant?.role !== "guest"
                ? participant?.firstName + " " + participant?.lastName
                : participant?.alias}
            </span>
            {participant?.role !== "guest" &&
              metadata?.userId === participant?.id && (
                <span className="text-secondary inline"> (you)</span>
              )}
          </div>
          <span className="block font-medium text-[13px] text-secondary">
            {participant?.email}
          </span>
        </div>
      </div>

      <DropdownWrapper
        isVisible={isDropdownExpanded}
        setIsVisible={setIsDropdownExpanded}
        isActive={!isAuthor}
        dropdownType={SimpleSelectedDropdown}
        selected={[participant?.role === "editor" ? 0 : 1]}
        align="right"
        optionGroups={[
          [...rolesOptions(participant)],
          [
            {
              text: "Remove access",
              onClick: () => {
                containsInRevokedParticipants
                  ? ""
                  : handleRevokeAccess(
                      participant?.id || participant?.alias,
                      participant?.role === "guest"
                    );
              },
            },
          ],
        ]}
      >
        <div
          className={`group h-9 px-3.5 flex items-center justify-center gap-1.5 rounded-lg ${
            isAuthor
              ? "text-placeholder cursor-default"
              : "hover:bg-hover text-inactive hover:text-primary cursor-pointer"
          }`}
        >
          <span className="font-semibold text-sm">
            {!containsInRevokedParticipants
              ? String(participant?.role).charAt(0).toUpperCase() +
                String(participant?.role).slice(1)
              : "Remove access"}
          </span>
          <TriangleExpandIcon
            className={`w-1.5 group-hover:opacity-100 opacity-0 transition-opacity duration-100 ease-out ${
              isDropdownExpanded ? "rotate-180" : "rotate-0"
            } ${isAuthor ? "invisible" : "visible"}`}
          />
        </div>
      </DropdownWrapper>
    </>
  );
};

export default function ManageParticipants({ metadata }: any) {
  const { closeModal } = useModal();

  const [loading, setLoading] = useState<any>(false);
  const [newParticipants, setNewParticipants] = useState<any>(
    metadata?.participants
  );
  const [removedParticipants, setRemovedParticipants] = useState<any>([]);
  const [pendingChanges, setPendingChanges] = useState<any>(false);

  const handleParticipantRoleChange = (participantId: any, newRole: any) => {
    const neww = [...metadata?.participants].map((participant: any) => {
      if (participant?.id === participantId) {
        return { ...participant, role: newRole };
      }

      return participant;
    });

    setNewParticipants(neww);
  };

  const handleRevokeAccess = (participantId: any, isGuest: any) => {
    setRemovedParticipants((curr: any) => [
      ...curr,
      { participantId, isGuest },
    ]);
  };

  const saveParticipants = async () => {
    if (pendingChanges && metadata?.scriptId) {
      setLoading(false);

      const groupParticipantsByRoles = () => {
        let editors: any = [];
        let viewers: any = [];
        let guests: any = [];

        newParticipants.forEach((p: any) => {
          const containsInRevokedParticipants = _.some(
            removedParticipants,
            (item: any) =>
              _.isEqual(item, {
                participantId: p?.id,
                isGuest: p?.role === "guest",
              })
          );

          if (containsInRevokedParticipants) return;

          if (p.role === "editor") {
            editors.push(p.email);
          } else if (p.role === "viewer") {
            viewers.push(p.email);
          } else if (p.role === "guest") {
            guests.push(p.alias);
          }
        });

        return { editors, viewers, guests };
      };

      const participantsGroupedByRoles = groupParticipantsByRoles();

      await updateScriptParticipants(
        metadata.scriptId,
        participantsGroupedByRoles
      );
    }
    closeModal();
  };

  useEffect(() => {
    if (!metadata?.participants) return;

    if (!_.isEqual(newParticipants, metadata.participants)) {
      !pendingChanges ? setPendingChanges(true) : "";
    } else {
      pendingChanges ? setPendingChanges(false) : "";
    }
  }, [newParticipants]);

  const rolesOptions = (participant: any) => {
    return [
      {
        text: "Editor",
        onClick: () => handleParticipantRoleChange(participant?.id, "editor"),
      },
      {
        text: "Viewer",
        onClick: () => handleParticipantRoleChange(participant?.id, "viewer"),
      },
    ];
  };

  return (
    <div className="w-[545px] rounded-xl bg-foreground ring-1 ring-stroke flex flex-col">
      <div className="pt-4 pb-2 px-6 flex justify-between items-center">
        <span className="text-primary font-bold text-base">
          Invite people to "{metadata?.scriptTitle}"
        </span>

        <span
          onClick={closeModal}
          className="group button-icon !h-7 relative !bg-transparent"
        >
          <span className="absolute inset-0 h-full w-full m-auto scale-125 rounded-full hover:bg-hover group-hover:bg-hover"></span>
          <CloseIcon className="z-10 h-3" />
        </span>
      </div>

      <div className="px-6 pt-3 pb-4 flex flex-col justify-start gap-6">
        <input
          placeholder="Add participants by email address"
          type="text"
          className="input-default"
        />

        <div className="flex flex-col gap-4">
          <span className="text-primary font-bold text-sm">
            Participants and roles
          </span>

          <div className="flex flex-col gap-3 h-[190px] overflow-y-auto">
            <div className="px-2 h-12 rounded-lg flex justify-between items-center">
              <Participant
                removedParticipants={removedParticipants}
                isAuthor={true}
                participant={metadata?.participants.find(
                  (p: any) => p.role === "author"
                )}
                metadata={metadata}
                rolesOptions={rolesOptions}
                handleRevokeAccess={handleRevokeAccess}
              />
            </div>
            {newParticipants.map((participant: any, index: any) => {
              return (
                participant?.role !== "guest" &&
                participant?.role !== "author" && (
                  <div
                    key={index}
                    className="px-2 h-12 rounded-lg flex justify-between items-center"
                  >
                    <Participant
                      removedParticipants={removedParticipants}
                      isAuthor={false}
                      participant={participant}
                      metadata={metadata}
                      rolesOptions={rolesOptions}
                      handleRevokeAccess={handleRevokeAccess}
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() =>
              navigator.clipboard.writeText(window.location.toString())
            }
            className="btn-3-lg"
          >
            <LinkIcon className="h-3" />
            <span className="">Copy link</span>
          </button>

          <div className="flex gap-5 items-center">
            {pendingChanges && (
              <span className="font-medium italic text-[13px] text-secondary">
                Pending changes
              </span>
            )}
            <button onClick={saveParticipants} className="btn-1-lg">
              {loading ? (
                <LoadingIcon className="h-3 animate-spin" />
              ) : (
                <span className="">{!pendingChanges ? "Done" : "Save"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
