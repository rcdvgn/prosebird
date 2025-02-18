import { useRef, useState, useEffect } from "react";
import useAutosizeTextArea from "../_utils/useAutosizeTextArea";

import { useScriptEditor } from "@/app/_contexts/ScriptEditorContext";

import SpeakerPicker from "./SpeakerPicker";
import { useAuth } from "../_contexts/AuthContext";

export default function ScriptNode({
  editorOptions,
  setEditorOptions,
  node,
  position,
}: any) {
  const { script, setScript, addNode, deleteNode } = useScriptEditor();
  const { user } = useAuth();

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
      if (chapterTitle !== script.nodes[position].title) {
        let copyScriptData = { ...script };
        copyScriptData.nodes[position] = {
          ...node,
          title: chapterTitle,
        };
        setScript(copyScriptData);
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
    let copyScriptData = { ...script };
    copyScriptData.nodes[position] = { ...node, paragraph: e.target.value };
    setScript(copyScriptData);
  };

  const handleParagraphKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      addNode(position + 1, user, script?.data?.nodes.length);
    }
  };

  useEffect(() => {
    if (script) {
      if (script?.nodes[position].title !== chapterTitle) {
        setChapterTitle(script.nodes[position].title);
      }
    }
  }, [script?.nodes[position].title]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-start">
        <div className="mr-5 h-9 shrink-0">
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
          className="block grow w-full bg-transparent overflow-y-scroll border-text-danger outline-none resize-none text-xl text-primary font-bold py-[2px] rounded-sm"
        ></textarea>
      </div>
      <textarea
        id={`chapterParagraph-${position}`}
        ref={chapterParagraph}
        onChange={handleParagraphChange}
        value={node.paragraph}
        onKeyDown={handleParagraphKeyDown}
        onFocus={() => setIsParagraphSpellCheckEnabled(true)}
        onBlur={() => setIsParagraphSpellCheckEnabled(false)}
        spellCheck={isParagraphSpellCheckEnabled}
        rows={1}
        placeholder="Say something great..."
        style={{
          fontSize: editorOptions.fontSize,
          textAlign: editorOptions.textAligment,
        }}
        className="block mt-[18px] pl-[54px] w-full bg-transparent overflow-y-scroll border-none outline-none resize-none text-primary font-regular leading-[22px] placeholder:text-placeholder"
      ></textarea>
    </div>
  );
}
