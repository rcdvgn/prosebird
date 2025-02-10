"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowIcon,
  CheckIcon,
  ClockIcon,
  MoreIcon,
  StarIcon,
} from "../_assets/icons";
import { lastModifiedFormatter } from "../_utils/lastModifiedFormater";
import OutsideClickHandler from "./wrappers/OutsideClickHandler";
import {
  changeFavoriteStatus,
  getNodes,
  getUserPreferences,
} from "../_services/client";
import { useRealtimeData } from "../_contexts/RealtimeDataContext";
import ProfilePicture from "./ProfilePicture";
import formatTimestamp from "../_utils/formatTimestamp";
import { useAuth } from "../_contexts/AuthContext";

const ScriptAtributeTitle = ({ children, sorting, setSorting, value }: any) => {
  return (
    <div className="relative flex items-center gap-1.5">
      {children}
      {sorting.sortedBy === value.sortedBy && (
        <span
          className={`rounded-full h-3.5 w-3.5 grid place-items-center bg-brand transition-rotate duration-150 ease-in-out ${
            value.order === "asc" ? "" : "rotate-180"
          }`}
        >
          <ArrowIcon className="h-2 text-primary" />
        </span>
      )}
      <div
        onClick={() => {
          setSorting(value);
        }}
        className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 m-auto bg-hover rounded-lg h-[calc(100%+16px)] w-[calc(100%+16px)] opacity-0 group-hover:opacity-100 transition-opacity duration-75 ease-in-out"
      ></div>
    </div>
  );
};

export default function ListView({
  displayType,
  scriptsWithTimestamps,
  sorting,
  setSorting,
}: any) {
  const { people } = useRealtimeData();
  const { user } = useAuth();

  const [selectedDocuments, setSelectedDocuments] = useState<any>([]);
  const selectAllButton = useRef(null);

  const pics = [
    { src: "/pfps/profile1.png" },
    { src: "/pfps/profile1.png" },
    { src: "/pfps/profile1.png" },
  ];

  const handleSelectDocument = (docId: any, e: any) => {
    e.stopPropagation();

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

  const allSelected = scriptsWithTimestamps
    ? selectedDocuments.length === scriptsWithTimestamps.length
    : false;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDocuments([]);
    } else {
      if (scriptsWithTimestamps) {
        setSelectedDocuments(
          scriptsWithTimestamps.map((script: any) => script.id)
        );
      }
    }
  };

  useEffect(() => {
    if (!scriptsWithTimestamps) return;
    console.log(scriptsWithTimestamps);
  }, [scriptsWithTimestamps]);

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
          className={`script-select ${
            allSelected ? "!border-none" : "!bg-transparent"
          }`}
        >
          {allSelected && (
            <CheckIcon className="w-2.5 text-primary mb-[-1px] mr-[-1px]" />
          )}
        </div>

        <div className="w-[33%] flex items-center group cursor-pointer">
          <ScriptAtributeTitle
            sorting={sorting}
            setSorting={setSorting}
            value={{
              sortedBy: "title",
              order:
                sorting.sortedBy === "title" // Changed from sorting.sortBy
                  ? sorting.order === "asc"
                    ? "desc"
                    : "asc"
                  : "desc",
            }}
          >
            <span className="block group-hover:text-primary text-secondary font-semibold text-[13px] truncate">
              Title
            </span>
          </ScriptAtributeTitle>
        </div>

        <div className="grow flex items-center justify-between">
          <div className="w-[110px] flex items-center group">
            <span className="text-secondary font-semibold text-[13px]">
              Created by
            </span>
          </div>

          <div className="w-[110px] flex items-center group cursor-pointer">
            <ScriptAtributeTitle
              sorting={sorting}
              setSorting={setSorting}
              value={{
                sortedBy: "lastModified",
                order:
                  sorting.sortedBy === "lastModified" // Changed from sorting.sortBy
                    ? sorting.order === "asc"
                      ? "desc"
                      : "asc"
                    : "desc",
              }}
            >
              <span className="group-hover:text-primary text-secondary font-semibold text-[13px]">
                Last modified
              </span>
            </ScriptAtributeTitle>
          </div>

          <div className="w-[110px] pr-1 flex items-center group">
            <span className="text-secondary font-semibold text-[13px]">
              Participants
            </span>
          </div>

          <div className="flex items-center justify-between w-[110px]">
            <div className="button-icon !invisible">
              <StarIcon className="h-4" />
            </div>
            <ClockIcon className="text-secondary h-[13px]" />
            <div className="button-icon !invisible">
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
          {scriptsWithTimestamps &&
            scriptsWithTimestamps.map((script: any) => {
              return (
                <div
                  key={script.id}
                  onClick={() => setSelectedDocuments([script.id])}
                  onDoubleClick={() => handleOpenDocument(script.id)}
                  className={`group/main h-[54px] px-4 flex gap-4 items-center justify-start select-none rounded-[10px] ${
                    selectedDocuments.includes(script.id)
                      ? "bg-selected"
                      : "hover:bg-battleground"
                  }`}
                >
                  <div
                    onClick={(e) => handleSelectDocument(script.id, e)}
                    className={`script-select ${
                      selectedDocuments.includes(script.id)
                        ? "!border-none"
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
                      <span className="text-inactive font-semibold text-[13px] mb-[-3px] truncate group-hover/main:text-primary cursor-pointer hover:underline">
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

                    <div className="flex items-center justify-between w-[110px]">
                      <div
                        onClick={() =>
                          changeFavoriteStatus(
                            script.id,
                            script?.isFavorite ? false : true
                          )
                        }
                        className=" group-hover/main:visible invisible button-icon !bg-transparent"
                      >
                        <StarIcon
                          className={`h-3.5 ${
                            script?.isFavorite
                              ? "!text-favorite-yellow fill-current"
                              : ""
                          }`}
                        />
                      </div>

                      <div className="text-inactive font-semibold text-[13px]">
                        {formatTimestamp(script.duration)}
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
