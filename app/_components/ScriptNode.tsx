import { useRef, useState, useEffect } from "react";
import useAutosizeTextArea from "../_utils/useAutosizeTextArea";

import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";

import SpeakerPicker from "./SpeakerPicker";

export default function ScriptNode({
  node,
  position,
}: {
  node: any;
  position: number;
}) {
  const { script, setScript, addNode, deleteNode } = useScriptEditor();
  const scriptData = script.data;
  const [isTitleSpellCheckEnabled, setIsTitleSpellCheckEnabled] =
    useState(false);
  const [isParagraphSpellCheckEnabled, setIsParagraphSpellCheckEnabled] =
    useState(false);

  const [chapterTitle, setChapterTitle] = useState(node.title);

  const speakerPictureRef = useRef<any>(null);

  const chapterTitleRef = useRef<HTMLTextAreaElement | null>(null);
  useAutosizeTextArea(chapterTitleRef.current, chapterTitle);

  const [speakerPicker, setSpeakerPicker] = useState<any>(false);

  const handleChapterTitleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setChapterTitle(e.target.value);
  };

  const handleChapterTitleFocusOut = () => {
    if (chapterTitle.length) {
      if (chapterTitle !== scriptData.nodes[position].title) {
        let copyScriptData = { ...scriptData };
        copyScriptData.nodes[position] = {
          ...node,
          title: chapterTitle,
        };
        setScript({ ...script, data: copyScriptData });
      }
    } else {
      if (chapterParagraph.current && !chapterParagraph.current.value) {
        deleteNode(node.id);
      } else {
        setChapterTitle(node.title);
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
    let copyScriptData = { ...scriptData };
    copyScriptData.nodes[position] = { ...node, paragraph: e.target.value };
    setScript({ ...script, data: copyScriptData });
  };

  const handleParagraphKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      addNode(position + 1);
    }
  };

  useEffect(() => {
    if (script) {
      if (scriptData?.nodes[position].title !== chapterTitle) {
        setChapterTitle(scriptData.nodes[position].title);
      }
    }
  }, [script?.data?.nodes[position].title]);

  return (
    <div className="w-full p-[10px]">
      <div className="flex items-center justify-start">
        <div className="mr-5 h-[34px] shrink-0">
          <div className="relative h-full">
            <div
              ref={speakerPictureRef}
              onClick={() => {
                setSpeakerPicker(!speakerPicker);
              }}
              style={{
                backgroundImage: `url("/pfps/profile1.png")`,
              }}
              className="cursor-pointer h-full aspect-square rounded-full bg-cover bg-center flex-shrink-0"
            ></div>

            {speakerPicker && (
              <SpeakerPicker
                position={position}
                speakerPicker={speakerPicker}
                setSpeakerPicker={setSpeakerPicker}
                speakerPictureRef={speakerPictureRef}
              />
            )}
          </div>
        </div>

        <textarea
          ref={chapterTitleRef}
          onChange={handleChapterTitleChange}
          onFocus={() => setIsTitleSpellCheckEnabled(true)}
          onBlur={() => {
            handleChapterTitleFocusOut();
            setIsTitleSpellCheckEnabled(false);
          }}
          onKeyDown={handleChapterTitleKeyDown}
          value={chapterTitle}
          rows={1}
          spellCheck={isTitleSpellCheckEnabled}
          className="block grow w-full bg-transparent overflow-y-scroll border-text-danger outline-none resize-none text-base text-primary font-bold py-[2px] rounded-sm"
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
        className="block mt-2.5 pl-[54px] w-full bg-transparent overflow-y-scroll border-none outline-none resize-none text-sm text-primary font-regular leading-[22px]"
      ></textarea>
    </div>
  );
}
