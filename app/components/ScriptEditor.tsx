"use client";

import { useRef, useState, useEffect } from "react";
import useAutosizeTextArea from "../utils/useAutosizeTextArea";

import AutowidthInput from "react-autowidth-input";

import { StarIcon, ScriptIcon, AddIcon, PlayIcon } from "../assets/icons";
import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

function ScriptNode({ node, position }: { node: any; position: number }) {
  const { scriptNodes, setScriptNodes, addNode, deleteNode } =
    useScriptEditor();
  const [isTitleSpellCheckEnabled, setIsTitleSpellCheckEnabled] =
    useState(false);
  const [isParagraphSpellCheckEnabled, setIsParagraphSpellCheckEnabled] =
    useState(false);

  const [modifiedChapterTitle, setModifiedChapterTitle] = useState(node.title);

  const chapterTitle = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(chapterTitle.current, modifiedChapterTitle);

  const handleChapterTitleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setModifiedChapterTitle(e.target.value);
  };

  const handleChapterTitleFocusOut = () => {
    if (modifiedChapterTitle.length) {
      let copyScriptNodes = { ...scriptNodes };
      copyScriptNodes.nodes[position] = {
        ...node,
        title: modifiedChapterTitle,
      };
      setScriptNodes(copyScriptNodes);
    } else {
      if (chapterParagraph.current && !chapterParagraph.current.value) {
        deleteNode(node.id);
      } else {
        setModifiedChapterTitle(node.title);
      }
    }
  };

  const handleChapterTitleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      chapterParagraph.current?.focus();
      handleChapterTitleFocusOut();
    }
  };

  const chapterParagraph = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(chapterParagraph.current, node.paragraph);

  const handleParagraphChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let copyScriptNodes = { ...scriptNodes };
    copyScriptNodes.nodes[position] = { ...node, paragraph: e.target.value };
    setScriptNodes(copyScriptNodes);
  };

  const handleParagraphKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      addNode(position + 1);
    }
  };

  return (
    <div className="w-full p-[10px]">
      <div className="flex items-start justify-start">
        <div className="w-[45px] h-[28px] shrink-0">
          <div
            style={{
              backgroundImage: `url("/pfps/profile1.png")`,
            }}
            className="h-full aspect-square rounded-full bg-cover bg-center flex-shrink-0"
          ></div>
        </div>

        <textarea
          ref={chapterTitle}
          onChange={handleChapterTitleChange}
          onFocus={() => setIsTitleSpellCheckEnabled(true)}
          onBlur={() => {
            handleChapterTitleFocusOut();
            setIsTitleSpellCheckEnabled(false);
          }}
          onKeyDown={handleChapterTitleKeyDown}
          value={modifiedChapterTitle}
          rows={1}
          spellCheck={isTitleSpellCheckEnabled}
          className="block grow w-full bg-transparent overflow-y-scroll border-text-danger outline-none resize-none text-base text-text-primary font-semibold py-[2px] rounded-sm"
        ></textarea>
      </div>
      <textarea
        ref={chapterParagraph}
        onChange={handleParagraphChange}
        value={node.paragraph}
        onKeyDown={handleParagraphKeyDown}
        onFocus={() => setIsParagraphSpellCheckEnabled(true)}
        onBlur={() => setIsParagraphSpellCheckEnabled(false)}
        spellCheck={isParagraphSpellCheckEnabled}
        rows={1}
        className="block mt-[13px] pl-[45px] w-full bg-transparent overflow-y-scroll border-none outline-none resize-none text-sm text-text-primary font-light leading-[22px]"
      ></textarea>
    </div>
  );
}

function ChapterDivider({ position }: { position: number }) {
  const { scriptNodes, addNode } = useScriptEditor();

  const handleHover = () => {
    console.log("Position: " + position);
    console.log("scriptNodes.length: " + scriptNodes.nodes.length);
  };

  return (
    <div
      onMouseEnter={handleHover}
      className="group w-full h-[30px] flex items-center justify-center"
    >
      <div className="relative w-full flex flex-col gap-1.5 invisible group-hover:visible">
        <div
          className={`${
            position > 0 ? "" : "invisible"
          } h-2 rounded-sm border-stroke border-x-[1px] border-b-[1px]`}
        ></div>
        <div
          className={`${
            position === scriptNodes.nodes.length ? "invisible" : ""
          } h-2 rounded-sm border-stroke border-x-[1px] border-t-[1px]`}
        ></div>
        <button
          onClick={() => addNode(position)}
          className="absolute top-0 bottom-0 right-0 left-0 m-auto h-fit w-fit btn-2-sm"
        >
          <AddIcon className="fill-text-primary w-2" />
          <span className="">Chapter</span>
        </button>
      </div>
    </div>
  );
}

function ScriptArea() {
  const { scriptNodes } = useScriptEditor();

  return (
    <div className="w-[683px] min-h-full pt-[15px]">
      <ChapterDivider position={0} />
      {[...scriptNodes.nodes]
        .sort(
          (a, b) => scriptNodes.nodes.indexOf(a) - scriptNodes.nodes.indexOf(b)
        )
        .map((node: any, index: any) => {
          return (
            <div key={node.id}>
              <ScriptNode node={node} position={index} />
              <ChapterDivider position={index + 1} />
            </div>
          );
        })}
    </div>
  );
}

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
