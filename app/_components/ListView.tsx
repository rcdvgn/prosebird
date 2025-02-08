"use client";

import React, { useState, useRef } from "react";
import { CheckIcon, MoreIcon, StarIcon } from "../_assets/icons";
import { lastModifiedFormatter } from "../_utils/lastModifiedFormater";
import OutsideClickHandler from "./utils/OutsideClickHandler";
import { changeFavoriteStatus } from "../_services/client";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import ProfilePicture from "./ProfilePicture";
import { useAuth } from "../_contexts/AuthContext";

export default function ListView({ displayType }: any) {
  const { scripts, people } = useRealtimeData();
  const { user } = useAuth();

  const [selectedDocuments, setSelectedDocuments] = useState<any>([]);
  const selectAllButton = useRef(null);

  const pics = [
    { src: "/pfps/profile1.png" },
    { src: "/pfps/profile1.png" },
    { src: "/pfps/profile1.png" },
  ];

  const handleSelectDocument = (docId: any, e: any) => {
    e.stopPropagation(); // Prevent triggering parent handlers

    if (selectedDocuments.includes(docId)) {
      let updatedSelectedDocuments = [...selectedDocuments];

      const index = updatedSelectedDocuments.indexOf(docId);
      updatedSelectedDocuments.splice(index, 1);

      setSelectedDocuments(updatedSelectedDocuments);
    } else {
      setSelectedDocuments([...selectedDocuments, docId]);
    }
  };

  const handleOpenDocument = (docId: any) => {
    console.log("About to open document " + docId);
  };

  const allSelected = scripts
    ? selectedDocuments.length === scripts.length
    : false;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDocuments([]);
    } else {
      if (scripts) {
        setSelectedDocuments(scripts.map((script: any) => script.id));
      }
    }
  };

  return (
    <div
      className={`flex-col w-full ${
        displayType === "list" ? "flex" : "hidden"
      }`}
    >
      <div className="h-[44px] px-4 flex gap-4 items-center justify-start select-none border-b-[1px] border-border mb-2.5">
        <div
          ref={selectAllButton}
          onClick={handleSelectAll}
          className={`script-select ${allSelected ? "" : "!bg-transparent"}`}
        >
          {allSelected && (
            <CheckIcon className="w-2.5 text-primary mb-[-1px] mr-[-1px]" />
          )}
        </div>

        <div className="w-[33%] flex items-center">
          <span className="block text-secondary font-semibold text-[13px] truncate">
            Name
          </span>
        </div>

        <div className="grow flex items-center justify-between">
          <div className="w-[110px] flex items-center">
            <span className="text-secondary font-semibold text-[13px]">
              Created by
            </span>
          </div>

          <div className="w-[110px] flex items-center">
            <span className="text-secondary font-semibold text-[13px]">
              Last modified
            </span>
          </div>

          <div className="w-[110px] pr-1 flex items-center">
            <span className="text-secondary font-semibold text-[13px]">
              Participants
            </span>
          </div>

          <div className="flex items-center justify-between w-[70px] invisible">
            <div className="button-icon">
              <StarIcon className="h-4" />
            </div>

            <div className="button-icon">
              <MoreIcon className="h-3" />
            </div>
          </div>
        </div>
      </div>

      <OutsideClickHandler
        onOutsideClick={() => {
          setSelectedDocuments([]);
        }}
        exceptionRefs={[selectAllButton]}
      >
        <div className="flex flex-col gap-1">
          {scripts &&
            scripts.map((script: any) => {
              return (
                <div
                  key={script.id}
                  onClick={() => setSelectedDocuments([script.id])}
                  onDoubleClick={() => handleOpenDocument(script.id)}
                  className={`group/main h-[54px] px-4 flex gap-4 items-center justify-start select-none rounded-[14px] ${
                    selectedDocuments.includes(script.id)
                      ? "bg-selected"
                      : "hover:bg-battleground"
                  }`}
                >
                  <div
                    onClick={(e) => handleSelectDocument(script.id, e)}
                    className={`script-select ${
                      selectedDocuments.includes(script.id)
                        ? ""
                        : "!bg-transparent"
                    }`}
                  >
                    {selectedDocuments.includes(script.id) && (
                      <CheckIcon className="w-2.5 text-primary mb-[-1px] mr-[-1px]" />
                    )}
                  </div>

                  <div className="w-[33%] flex">
                    <span
                      onClick={() => handleOpenDocument(script.id)}
                      className="block text-primary font-semibold text-sm truncate hover:underline cursor-pointer"
                    >
                      {script.title}
                    </span>
                  </div>

                  <div className="grow flex items-center justify-between">
                    <div className="flex justify-start items-center gap-2.5 w-[110px]">
                      <ProfilePicture
                        profilePictureURL={
                          people[script.createdBy]?.profilePictureURL
                        }
                        className="h-[30px]"
                        firstName={user?.firstName}
                        lastName={user?.lastName}
                      />
                      <span className="text-inactive font-semibold text-sm mb-[-3px] truncate group-hover/main:text-primary cursor-pointer hover:underline">
                        You
                      </span>
                    </div>

                    <div className="w-[110px] overflow-visible">
                      <span className="text-inactive font-semibold text-[13px]">
                        {lastModifiedFormatter(script.lastModified)}
                      </span>
                    </div>

                    <div className="flex justify-start w-[110px] pr-1">
                      {pics.map((pic: any, picIndex: any) => {
                        return (
                          <div
                            key={picIndex}
                            style={{
                              backgroundImage: `url("/pfps/profile1.png")`,
                            }}
                            className={`h-[30px] aspect-square rounded-full bg-cover bg-center flex-shrink-0 ring-2 -mr-1 ${
                              selectedDocuments.includes(script.id)
                                ? "ring-selected"
                                : "group-hover/main:ring-battleground ring-middleground"
                            }`}
                          ></div>
                        );
                      })}

                      <div
                        className={`h-[30px] aspect-square rounded-full bg-battleground ring-2 -mr-1 grid place-items-center ${
                          selectedDocuments.includes(script.id)
                            ? "ring-selected"
                            : "group-hover/main:ring-battleground ring-middleground"
                        }`}
                      >
                        <span className="text-secondary font-bold text-[13px]">
                          +4
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-[70px]">
                      <div
                        onClick={() =>
                          changeFavoriteStatus(
                            script.id,
                            script?.isFavorite ? false : true
                          )
                        }
                        className={`${
                          script?.isFavorite
                            ? ""
                            : "group-hover/main:visible invisible"
                        } button-icon !bg-transparent`}
                      >
                        <StarIcon
                          className={`h-4 ${
                            script?.isFavorite
                              ? "!text-favorite-yellow fill-current"
                              : ""
                          }`}
                        />
                      </div>

                      <div className="button-icon">
                        <MoreIcon className="h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </OutsideClickHandler>
    </div>
  );
}
