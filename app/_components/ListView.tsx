"use client";

import React, { useState, useRef } from "react";
import { CheckIcon, MoreIcon, StarIcon } from "../_assets/icons";
import { lastModifiedFormatter } from "../_utils/lastModifiedFormater";
import OutsideClickHandler from "./utils/OutsideClickHandler";
import { changeFavoriteStatus } from "../_services/client";

export default function ListView({ recentlyModified, displayType }: any) {
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

  const allSelected = recentlyModified
    ? selectedDocuments.length === recentlyModified.length
    : false;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedDocuments([]);
    } else {
      if (recentlyModified) {
        setSelectedDocuments(recentlyModified.map((item: any) => item.id));
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
        <div className="">
          {recentlyModified &&
            recentlyModified.map((item: any, index: any) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDocuments([item.id])}
                  onDoubleClick={() => handleOpenDocument(item.id)}
                  className={`group/main h-[54px] px-4 flex gap-4 items-center justify-start select-none rounded-[14px] ${
                    selectedDocuments.includes(item.id)
                      ? "bg-selected"
                      : "hover:bg-hover"
                  }`}
                >
                  <div
                    onClick={(e) => handleSelectDocument(item.id, e)}
                    className={`script-select ${
                      selectedDocuments.includes(item.id)
                        ? ""
                        : "!bg-transparent"
                    }`}
                  >
                    {selectedDocuments.includes(item.id) && (
                      <CheckIcon className="w-2.5 text-primary mb-[-1px] mr-[-1px]" />
                    )}
                  </div>

                  <div className="w-[33%] flex">
                    <span
                      onClick={() => handleOpenDocument(item.id)}
                      className="block text-primary font-semibold text-sm truncate hover:underline cursor-pointer"
                    >
                      {item.title}
                    </span>
                  </div>

                  <div className="grow flex items-center justify-between">
                    <div className="flex justify-start items-center gap-2.5 w-[110px]">
                      <div
                        style={{
                          backgroundImage: `url("/pfps/profile1.png")`,
                        }}
                        className="h-[30px] aspect-square rounded-full bg-cover bg-center flex-shrink-0"
                      ></div>
                      <span className="text-inactive font-semibold text-sm mb-[-3px] truncate group-hover/main:text-primary cursor-pointer hover:underline">
                        You
                      </span>
                    </div>

                    <div className="w-[110px] overflow-visible">
                      <span className="text-inactive font-semibold text-[13px]">
                        {lastModifiedFormatter(item.lastModified)}
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
                              selectedDocuments.includes(item.id)
                                ? "ring-selected"
                                : "group-hover/main:ring-foreground ring-middleground"
                            }`}
                          ></div>
                        );
                      })}

                      <div
                        className={`h-[30px] aspect-square rounded-full bg-battleground ring-2 -mr-1 grid place-items-center ${
                          selectedDocuments.includes(item.id)
                            ? "ring-selected"
                            : "group-hover/main:ring-foreground ring-middleground"
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
                            item.id,
                            item?.isFavorite ? false : true
                          )
                        }
                        className={`${
                          item?.isFavorite
                            ? ""
                            : "group-hover/main:visible invisible"
                        } button-icon`}
                      >
                        <StarIcon
                          className={`h-4 ${
                            item?.isFavorite
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
