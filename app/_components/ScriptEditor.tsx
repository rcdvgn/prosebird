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
import SegmentedControl from "./ui/SegmentedControl";
import ScriptAreaControls from "./ScriptAreaControls";

export default function ScriptEditor() {
  const { script, setScript, participants } = useScriptEditor();
  const { user } = useAuth();

  const router = useRouter();

  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(false);

  const [scriptAreaControlsVisible, setScriptAreaControlsVisible] =
    useState<any>(false);

  const documentTitleRef = useRef<HTMLInputElement | null>(null);
  const inputContainerRef = useRef<HTMLSpanElement | null>(null);

  const [documentTitle, setDocumentTitle] = useState(script?.title);

  const [selectedSegment, setSelectedSegment] = useState<any>(0);

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

  const segments = [
    { id: 0, text: "Chapters", onClick: () => setSelectedSegment(0) },
    { id: 1, text: "Preview", onClick: () => setSelectedSegment(1) },
  ];

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
        <div className="flex gap-3 items-center">
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
          <button className="btn-2-md !px-0 !aspect-square">
            <PlayIcon className="h-3" />
          </button>
          <button onClick={handleShareFile} className="btn-2-md">
            Invite
          </button>
          <button className="btn-1-md" onClick={handlePresent}>
            <span className="">Present</span>
          </button>
        </div>
      </div>
      <div className="grow flex gap-2 overflow-y-auto min-w-0 mr-2 mb-2">
        {/* <div className="flex grow min-h-0 p-2"> */}
        {/* <div className="flex flex-col grow"> */}
        <div className="slate relative grow items-center min-h-0 overflow-y-auto">
          {scriptAreaControlsVisible && (
            <ScriptAreaControls setisVisible={setScriptAreaControlsVisible} />
          )}
          <ScriptArea />
          <ScriptAreaInfo />
        </div>
        {/* </div> */}

        <div className="slate w-[324px] px-2.5 overflow-y-auto">
          <div className="h-16 px-1 border-stroke border-b-[1px] flex justify-center items-center">
            <div className="rounded-[10px] bg-foreground border-stroke border-[1px] h-[38px] p-[2px]">
              <SegmentedControl
                segments={segments}
                selectedSegment={selectedSegment}
              />
            </div>
          </div>
          <div className="grow w-full py-2.5">
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
        {/* </div> */}
      </div>
    </div>
  );
}
