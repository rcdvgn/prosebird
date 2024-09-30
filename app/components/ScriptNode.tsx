import { useRef, useState } from "react";
import useAutosizeTextArea from "../utils/useAutosizeTextArea";

import { useScriptEditor } from "@/app/contexts/ScriptEditorContext";

export default function ScriptNode({
  node,
  position,
}: {
  node: any;
  position: number;
}) {
  const { scriptData, setScriptData, addNode, deleteNode } = useScriptEditor();
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
      let copyScriptNodes = { ...scriptData };
      copyScriptNodes.nodes[position] = {
        ...node,
        title: modifiedChapterTitle,
      };
      setScriptData(copyScriptNodes);
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
    let copyScriptNodes = { ...scriptData };
    copyScriptNodes.nodes[position] = { ...node, paragraph: e.target.value };
    setScriptData(copyScriptNodes);
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
