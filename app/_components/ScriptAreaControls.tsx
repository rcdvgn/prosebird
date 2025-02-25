import React, { useEffect, useRef, useState } from "react";
import SegmentedControl from "./ui/SegmentedControl";
import {
  ClearIcon,
  CloseIcon,
  CommentedTextIcon,
  DefaultTextIcon,
  MinusFontSizeIcon,
  PlusFontSizeIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
} from "../_assets/icons";
import { motion } from "framer-motion";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";
import { toggleComment } from "../_utils/tiptapCommands";

const FontSizeControl = ({ editorOptions, setEditorOptions }: any) => {
  return (
    <div className="flex items-center h-full">
      <span
        className="pl-3.5 text-inactive hover:text-primary h-full cursor-pointer flex items-center"
        onClick={() =>
          setEditorOptions((currEditorOptions: any) => ({
            ...currEditorOptions,
            fontSize: currEditorOptions.fontSize - 1,
          }))
        }
      >
        <MinusFontSizeIcon className="w-3" />
      </span>
      <div className="w-11 text-center cursor-pointer select-none">
        <span className="font-bold text-sm text-inactive hover:text-primary">
          {editorOptions.fontSize}
        </span>
      </div>
      <span
        className="pr-3.5 text-inactive hover:text-primary h-full cursor-pointer flex items-center"
        onClick={() =>
          setEditorOptions((currEditorOptions: any) => ({
            ...currEditorOptions,
            fontSize: currEditorOptions.fontSize + 1,
          }))
        }
      >
        <PlusFontSizeIcon className="h-3" />
      </span>
    </div>
  );
};

const HrDivider = () => {
  return <div className="w-[2px] h-[18px] rounded-full bg-selected"></div>;
};

const ScriptControls = ({
  editorOptions,
  setEditorOptions,
  isVisible,
  setisVisible,
}: any) => {
  const { editor } = useScriptEditor();

  // More robust function to check if cursor is within a comment
  const isCursorInComment = (editor: any) => {
    if (!editor) return false;

    const { state } = editor;
    const { from } = state.selection;

    // Get the marks at cursor position
    const $pos = state.doc.resolve(from);

    // First check if there are marks directly at the cursor position
    let marks = $pos.marks();
    console.log(marks);

    // If no marks at exact position and we're at the end of a text node,
    // we should check the position right before the cursor too
    if (marks.length === 0 && $pos.parentOffset > 0) {
      // Try to get marks from the position right before cursor
      const before = from - 1;
      const $before = state.doc.resolve(before);
      if ($before.parent === $pos.parent) {
        marks = state.doc.rangeHasMark(
          before,
          before + 1,
          editor.schema.marks.comment
        )
          ? [editor.schema.marks.comment.create()]
          : [];
      }
    }

    return marks.some((mark: any) => mark.type.name === "comment");
  };

  // Update the existing useEffect
  useEffect(() => {
    if (!editor) return;

    // Function to update the UI based on cursor position
    const updateTextTypeUI = () => {
      const isInComment = isCursorInComment(editor);

      // Update the state regardless to ensure UI stays in sync
      setEditorOptions((curr: any) => ({
        ...curr,
        textType: isInComment ? "comment" : "default",
      }));
    };

    // Run immediately on mount and editor changes
    updateTextTypeUI();

    // Create a handler that runs on both selection changes and transactions
    const handler = () => {
      // Small delay to ensure DOM is updated
      setTimeout(updateTextTypeUI, 0);
    };

    // Add event listeners
    editor.on("selectionUpdate", handler);
    editor.on("transaction", handler);

    return () => {
      // Clean up event listeners
      editor.off("selectionUpdate", handler);
      editor.off("transaction", handler);
    };
  }, [editor]);

  const textTypeSegments = [
    {
      leftIcon: <DefaultTextIcon className="h-3" />,
      onClick: () =>
        setEditorOptions((currEditorOptions: any) => ({
          ...currEditorOptions,
          textType: "default",
        })),
    },
    {
      leftIcon: <CommentedTextIcon className="h-3.5" />,
      onClick: () => {
        // Check if cursor is already in a comment
        if (editor && isCursorInComment(editor)) {
          console.log("already commenting");
          return;
        }

        // Otherwise, proceed with comment toggle
        setEditorOptions((curr: any) => ({ ...curr, textType: "comment" }));
        if (editor) toggleComment(editor);
      },
    },
  ];

  const textAlignmentSegments = [
    {
      leftIcon: <TextAlignLeftIcon className="w-4" />,
      onClick: () =>
        setEditorOptions((currEditorOptions: any) => ({
          ...currEditorOptions,
          textAligment: "left",
        })),
    },
    {
      leftIcon: <TextAlignCenterIcon className="w-4" />,
      onClick: () =>
        setEditorOptions((currEditorOptions: any) => ({
          ...currEditorOptions,
          textAligment: "center",
        })),
    },
    {
      leftIcon: <TextAlignJustifyIcon className="w-4" />,
      onClick: () =>
        setEditorOptions((currEditorOptions: any) => ({
          ...currEditorOptions,
          textAligment: "justify",
        })),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
      transition={{ duration: 0.15, delay: isVisible ? 0.15 : 0 }}
      className="pointer-events-auto p-[3px] rounded-[10px] bg-foreground border-stroke border-[1px]"
    >
      <div className="h-8 flex items-center gap-1">
        <SegmentedControl
          segments={textTypeSegments}
          selectedSegment={editorOptions.textType === "default" ? 0 : 1}
          segmentWidth={44}
        />

        <HrDivider />

        <FontSizeControl
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
        />

        <HrDivider />

        <SegmentedControl
          segments={textAlignmentSegments}
          selectedSegment={
            editorOptions.textAlignment === "left"
              ? 0
              : editorOptions.textAlignment === "center"
              ? 1
              : 2
          }
          segmentWidth={44}
        />

        <HrDivider />

        <div
          onClick={() => setisVisible(false)}
          className="w-11 h-full text-inactive hover:text-primary grid place-items-center cursor-pointer rounded-lg"
        >
          <CloseIcon className="h-3" />
        </div>
      </div>
    </motion.div>
  );
};

export default function ScriptAreaControls({
  editorOptions,
  setEditorOptions,
  isVisible,
  setisVisible,
}: any) {
  return (
    <div className={`z-50 sticky top-0 left-0 w-full pointer-events-none`}>
      <div
        className={`flex items-end justify-center w-full px-10 transition-all duration-300 ease-in-out overflow-hidden pointer-events-none ${
          isVisible ? "h-16" : "h-0"
        }`}
      >
        <ScriptControls
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
          isVisible={isVisible}
          setisVisible={setisVisible}
        />
      </div>
    </div>
  );
}
