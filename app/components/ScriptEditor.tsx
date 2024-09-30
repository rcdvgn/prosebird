"use client";

import { useRef, useState, useEffect } from "react";
import ScriptArea from "./ScriptArea";

import { StarIcon, ScriptIcon, PlayIcon } from "../assets/icons";
import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function ScriptEditor() {
  const { scriptNodes } = useScriptEditor();

  const documentTitleRef = useRef<HTMLInputElement | null>(null);
  const inputContainerRef = useRef<HTMLSpanElement | null>(null);

  const [documentTitle, setDocumentTitle] = useState(scriptNodes.title);
  const [editableDocumentTitle, setEditableDocumentTitle] = useState(
    scriptNodes.title
  );

  const handleDocumentTitleChange = (newTitle: any) => {
    setEditableDocumentTitle(newTitle);
  };

  const handleDocumentTitleBlur = () => {
    if (documentTitleRef.current && documentTitleRef.current.value.length > 0) {
      setDocumentTitle(editableDocumentTitle);
    } else {
      setEditableDocumentTitle(documentTitle);
    }
  };

  useEffect(() => {
    if (inputContainerRef.current && documentTitleRef.current) {
      documentTitleRef.current.style.width = `${inputContainerRef.current.offsetWidth}px`;
    }
  }, [editableDocumentTitle]);

  return (
    <div className="grow flex flex-col min-w-0">
      <div className="flex justify-between items-center px-4 border-b-[1px] border-stroke h-[55px]">
        <div className="grow flex items-center gap-3.5 min-w-0">
          <div className="icon-container">
            <ScriptIcon className="stroke-text-primary stroke-[1.5px]" />
          </div>
          <div className="relative grow flex items-center gap-2 min-w-0">
            <span
              ref={inputContainerRef}
              className="absolute left-0 top-0 w-fit m-auto font-semibold text-base invisible"
            >
              {editableDocumentTitle}
            </span>
            <input
              ref={documentTitleRef}
              type="text"
              value={editableDocumentTitle}
              onBlur={handleDocumentTitleBlur}
              onChange={(e) => handleDocumentTitleChange(e.target.value)}
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
          <div className="grow flex justify-center min-h-0 overflow-y-auto">
            <ScriptArea />
          </div>
        </div>
        <div className="w-[378px]">
          <div className="h-[46px] border-b-[1px] border-stroke"></div>
        </div>
      </div>
    </div>
  );
}
