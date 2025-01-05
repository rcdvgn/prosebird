"use client";

import { useRef, useState, useEffect } from "react";
import ScriptArea from "./ScriptArea";
import ScriptAreaInfo from "./ScriptAreaInfo";
import { useRouter } from "next/navigation";

import { StarIcon, ScriptIcon, PlayIcon, SearchIcon } from "../_assets/icons";
import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function ScriptEditor() {
  const { script, setScript, participants } = useScriptEditor();
  const scriptData = script.data;
  const { user } = useAuth();

  const router = useRouter();

  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(false);

  const documentTitleRef = useRef<HTMLInputElement | null>(null);
  const inputContainerRef = useRef<HTMLSpanElement | null>(null);

  const [documentTitle, setDocumentTitle] = useState(scriptData.title);

  const handleDocumentTitleChange = (e: any) => {
    setDocumentTitle(e.target.value);
  };

  const handleDocumentTitleFocusOut = () => {
    if (documentTitle.length) {
      let copyScriptData = { ...scriptData };
      copyScriptData.title = documentTitle;
      setScript({ ...script, data: copyScriptData });
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

  useEffect(() => {
    if (inputContainerRef.current && documentTitleRef.current) {
      documentTitleRef.current.style.width = `${inputContainerRef.current.offsetWidth}px`;
    }
  }, [documentTitle]);

  useEffect(() => {
    if (script) {
      if (scriptData?.title !== documentTitle) {
        setDocumentTitle(scriptData.title);
      }
    }
  }, [scriptData?.title]);

  // useEffect(() => {
  //   return () => {
  //     setScript(null);
  //   };
  // }, []);

  return (
    <div className="grow flex flex-col min-w-0">
      <div className="flex justify-between items-center px-4 border-b-[1px] border-stroke h-[60px] shrink-0">
        <div className="grow flex items-center gap-3.5 min-w-0">
          <div className="icon-container">
            <ScriptIcon className="stroke-text-primary stroke-[1.5px]" />
          </div>
          <div className="relative grow flex items-center gap-2 min-w-0">
            <span
              ref={inputContainerRef}
              className="absolute left-0 top-0 w-fit m-auto font-semibold text-base invisible"
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
              className="font-bold text-base text-primary bg-transparent border-none outline-none rounded-sm focus:text-primary/90 hover:ring-1 focus:ring-1 ring-text-secondary ring-offset-4 ring-offset-background"
            />

            <StarIcon className="stroke-text-primary stroke-1 mr-4 w-3 cursor-pointer" />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex h-[26px]">
            <div
              style={{
                backgroundImage: `url("/pfps/profile1.png")`,
              }}
              className="-ml-[1px] h-[full] aspect-square rounded-full box-content ring-4 ring-background bg-cover bg-center flex-shrink-0"
            ></div>
            <div
              style={{
                backgroundImage: `url("/pfps/profile1.png")`,
              }}
              className="-ml-[1px] h-[full] aspect-square rounded-full box-content ring-4 ring-background bg-cover bg-center flex-shrink-0"
            ></div>
          </div>
          <button onClick={handleShareFile} className="btn-2-md">
            Share
          </button>
          <button className="btn-1-md flex gap-2" onClick={handlePresent}>
            <PlayIcon className="fill-text-primary" />
            <span className="">Present</span>
          </button>
        </div>
      </div>
      <div className="flex grow min-h-0">
        <div className="flex flex-col grow border-r-[1px] border-stroke">
          <div className="h-[46px] border-b-[1px] border-stroke shrink-0"></div>
          <div className="relative grow flex flex-col items-center min-h-0 overflow-y-auto">
            <ScriptArea />
            <ScriptAreaInfo />
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
  );
}
