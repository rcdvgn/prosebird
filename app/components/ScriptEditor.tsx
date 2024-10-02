"use client";

import { useRef, useState, useEffect } from "react";
import ScriptArea from "./ScriptArea";
import ScriptAreaInfo from "./ScriptAreaInfo";

import { StarIcon, ScriptIcon, PlayIcon } from "../assets/icons";
import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function ScriptEditor() {
  const { script, setScript } = useScriptEditor();
  const scriptData = script.data;

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

  return (
    <div className="grow flex flex-col min-w-0">
      <div className="flex justify-between items-center px-4 border-b-[1px] border-stroke h-[55px] shrink-0">
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
              className="font-semibold text-base text-text-primary bg-transparent border-none outline-none rounded-sm focus:text-text-primary/90 hover:ring-1 focus:ring-1 ring-text-secondary ring-offset-4 ring-offset-background-primary"
            />

            <StarIcon className="stroke-text-primary stroke-1 mr-4" />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex h-[26px]">
            <div
              style={{
                backgroundImage: `url("/pfps/profile1.png")`,
              }}
              className="-ml-[1px] h-[full] aspect-square rounded-full box-content ring-4 ring-background-primary bg-cover bg-center flex-shrink-0"
            ></div>
            <div
              style={{
                backgroundImage: `url("/pfps/profile1.png")`,
              }}
              className="-ml-[1px] h-[full] aspect-square rounded-full box-content ring-4 ring-background-primary bg-cover bg-center flex-shrink-0"
            ></div>
          </div>
          <button className="btn-2-md">Share</button>
          <button className="btn-1-md flex gap-1">
            <PlayIcon className="fill-text-primary" />
            <span className="">Launch</span>
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
        <div className="w-[378px]">
          <div className="h-[46px] border-b-[1px] border-stroke"></div>
        </div>
      </div>
    </div>
  );
}
