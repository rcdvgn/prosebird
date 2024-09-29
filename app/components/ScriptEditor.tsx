"use client";

import { useRef, useState, useEffect } from "react";
import useAutosizeTextArea from "../utils/useAutosizeTextArea";

import { StarIcon, ScriptIcon, AddIcon } from "../assets/icons";
import {
  ScriptEditorProvider,
  useScriptEditor,
} from "@/app/contexts/ScriptEditorContext";

function ScriptNode({ node, position }: { node: any; position: number }) {
  const { scriptNodes, setScriptNodes, addNode } = useScriptEditor();
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(false);

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
      let copyScriptNodes = [...scriptNodes];
      copyScriptNodes[position] = { ...node, title: modifiedChapterTitle };
      setScriptNodes(copyScriptNodes);
    } else {
      setModifiedChapterTitle(node.title);
    }
  };

  const handleChapterTitleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      chapterParagraph.current ? chapterParagraph.current.focus() : "";
      handleChapterTitleFocusOut();
    }
  };

  const chapterParagraph = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(chapterParagraph.current, node.paragraph);

  const handleParagraphChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let copyScriptNodes = [...scriptNodes];
    copyScriptNodes[position] = { ...node, paragraph: e.target.value };
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
          onFocus={() => setIsSpellCheckEnabled(true)}
          onBlur={() => {
            handleChapterTitleFocusOut();
            setIsSpellCheckEnabled(false);
          }}
          onKeyDown={handleChapterTitleKeyDown}
          value={modifiedChapterTitle}
          rows={1}
          spellCheck={isSpellCheckEnabled}
          className="block grow w-full bg-transparent overflow-y-scroll border-text-danger outline-none resize-none text-base text-text-primary font-semibold py-[2px] rounded-sm"
        ></textarea>
      </div>
      <textarea
        ref={chapterParagraph}
        onChange={handleParagraphChange}
        value={node.paragraph}
        onKeyDown={handleParagraphKeyDown}
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
    console.log("scriptNodes.length: " + scriptNodes.length);
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
            position === scriptNodes.length ? "invisible" : ""
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

  const nodes = [...scriptNodes];

  return (
    <div className="w-[683px] min-h-full pt-[15px]">
      <ChapterDivider position={0} />
      {nodes.map((node: any, index: any) => {
        return (
          <div key={index}>
            <ScriptNode node={node} position={index} />
            <ChapterDivider position={index + 1} />
          </div>
        );
      })}
    </div>
  );
}

export default function ScriptEditor() {
  return (
    <ScriptEditorProvider>
      <div className="grow flex flex-col">
        <div className="flex justify-between items-center px-4 border-b-[1px] border-stroke h-[55px]">
          <span className="flex items-center gap-3.5">
            <div className="icon-container">
              <ScriptIcon className="stroke-text-primary stroke-[1.5px]" />
            </div>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-base text-text-primary">
                Revolutionizing Quantitative Computing with AI
              </span>
              <StarIcon className="stroke-text-primary stroke-1" />
            </span>
          </span>
          <span className=""></span>
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
    </ScriptEditorProvider>
  );
}
