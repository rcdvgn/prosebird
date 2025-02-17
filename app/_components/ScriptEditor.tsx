"use client";

import { useRef, useState, useEffect } from "react";
import ScriptArea from "./ScriptArea";
import ScriptAreaInfo from "./ScriptAreaInfo";
import { useRouter } from "next/navigation";

import {
  StarIcon,
  ScriptIcon,
  PlayIcon,
  SearchIcon,
  MoreIcon,
  DragIcon,
} from "../_assets/icons";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";
import { changeFavoriteStatus } from "../_services/client";
import VirtualizedChapterList from "./VirtualizedChaptersList";

export default function ScriptEditor() {
  const { script, setScript, participants } = useScriptEditor();
  const { user } = useAuth();

  const router = useRouter();

  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(false);

  const documentTitleRef = useRef<HTMLInputElement | null>(null);
  const inputContainerRef = useRef<HTMLSpanElement | null>(null);

  const [documentTitle, setDocumentTitle] = useState(script?.title);

  const handleDocumentTitleChange = (e: any) => {
    setDocumentTitle(e.target.value);
  };

  const handleDocumentTitleFocusOut = () => {
    if (documentTitle.length) {
      let copyScriptData = { ...script };
      copyScriptData.title = documentTitle;
      setScript(copyScriptData);
    } else {
      setDocumentTitle(documentTitle);
    }
  };

  const handleDocumentTitleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDocumentTitleFocusOut();
      if (documentTitleRef.current) {
        documentTitleRef.current.blur();
      }
    }
  };

  // useEffect(() => {
  //   participants ? console.log(participants) : "";
  // }, [participants]);

  const handlePresent = async () => {
    const participantsIdsAndRoles = participants.reduce(
      (acc: any, item: any) => {
        const { id, role } = item;
        acc[id] = { role, isConnected: false }; // Add participant data using `id` as the key
        return acc;
      },
      {}
    );

    try {
      const res = await fetch("/api/presentation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: script,
          userId: user.id,
          scriptParticipants: participantsIdsAndRoles,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to create presentation");
      }

      const presentationCode = await res.text();
      router.push(`/p/${presentationCode}`);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleShareFile = () => {
    console.log("Handle file sharing");
  };

  const handleDragStart = (e: any, data: any) => {
    console.log("started");
    console.log(data.node);
  };

  const handleDragMove = (e: any) => {
    // console.log(e.x, e.y);
  };

  const handleDragStop = (e: any, data: any) => {
    console.log("stoped");

    console.log(data.node);
  };

  useEffect(() => {
    if (inputContainerRef.current && documentTitleRef.current) {
      documentTitleRef.current.style.width = `${inputContainerRef.current.offsetWidth}px`;
    }
  }, [documentTitle]);

  useEffect(() => {
    if (script) {
      if (script?.title !== documentTitle) {
        setDocumentTitle(script.title);
      }
    }
  }, [script?.title]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center p-[10px] h-16 shrink-0">
        <div className="grow flex items-center gap-3 min-w-0">
          <div className="icon-container">
            <ScriptIcon className="text-primary" />
          </div>
          <div className="relative grow flex items-center gap-2 min-w-0">
            <span
              ref={inputContainerRef}
              className="absolute left-0 top-0 w-fit m-auto font-semibold text-[13px] invisible min-w-0"
            >
              {documentTitle}
            </span>
            <input
              ref={documentTitleRef}
              type="text"
              value={documentTitle}
              onFocus={() => setIsSpellCheckEnabled(true)}
              onBlur={() => {
                handleDocumentTitleFocusOut();
                setIsSpellCheckEnabled(false);
              }}
              onChange={handleDocumentTitleChange}
              onKeyDown={handleDocumentTitleKeyDown}
              spellCheck={isSpellCheckEnabled}
              className="font-semibold text-[13px] inactive bg-transparent border-none outline-none rounded-sm focus:text-primary/90 ring-1 ring-transparent hover:ring-placeholder focus:ring-brand ring-offset-4 ring-offset-background min-w-0"
            />
            <div className="flex items-center gap-1">
              <span
                onClick={() =>
                  changeFavoriteStatus(script.id, !script.isFavorite)
                }
                className="button-icon !h-[25px] !bg-transparent"
              >
                <StarIcon
                  className={`h-4 ${
                    script?.isFavorite
                      ? "!text-favorite-yellow fill-current"
                      : ""
                  }`}
                />
              </span>
              <span className="button-icon !h-[25px] !bg-transparent">
                <MoreIcon className="rotate-90 w-3.5" />
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 items-center">
          <div className="flex h-7">
            {Array.from({ length: 3 }).map((item: any, index: any) => {
              return (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url("/pfps/profile1.png")`,
                  }}
                  className={`${
                    index > 0 ? "-ml-[3px]" : ""
                  } h-full aspect-square rounded-full box-content ring-2 ring-background bg-cover bg-center flex-shrink-0`}
                ></div>
              );
            })}
          </div>
          <button onClick={handleShareFile} className="btn-2-md">
            Share
          </button>
          <button className="btn-1-md" onClick={handlePresent}>
            <PlayIcon className="text-primary h-3" />
            <span className="">Present</span>
          </button>
        </div>
      </div>
      <div className="slate">
        <div className="flex grow min-h-0 p-2">
          {/* <div className="flex flex-col grow"> */}
          <div className="relative grow flex flex-col items-center min-h-0 overflow-y-auto pt-10">
            <ScriptArea />
            <ScriptAreaInfo />
          </div>
          {/* </div> */}

          <div className="w-[300px] bg-background border-stroke border-[1px] rounded-[10px] pb-2.5 overflow-y-auto flex flex-col">
            <div className="px-5 py-4 border-stroke border-b-[1px]">
              <span className="text-base font-bold text-primary">Chapters</span>
            </div>
            <div className="grow w-full px-2 pt-2">
              <VirtualizedChapterList />
            </div>
          </div>

          {/* <div className="w-[378px]">
          <div className="h-[46px] border-b-[1px] border-stroke flex justify-between items-center px-5">
            <span className="text-sm font-semibold text-primary">
              Chapters
              <span className="font-medium text-text-secondary">
                {" "}
                ({scriptData?.nodes.length})
              </span>
            </span>
            <span className="btn-3">
              <SearchIcon className="" />
            </span>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
}
