import React, { useEffect, useRef, useState } from "react";
import SegmentedControl from "./ui/SegmentedControl";
import {
  BoldTextIcon,
  ClearIcon,
  CloseIcon,
  CommentedTextIcon,
  DefaultTextIcon,
  ItalicTextIcon,
  MinusFontSizeIcon,
  PlusFontSizeIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
} from "../_assets/icons";
import { motion } from "framer-motion";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";
import { toggleComment } from "../_utils/tiptapCommands";
import { getTextAlignment, isCursorInComment } from "../_utils/tiptapHelpers";
import ScriptEditorSegment from "./ui/ScriptEditorSegment";

const FontSizeControl = ({ editorOptions, setEditorOptions }: any) => {
  const { editor } = useScriptEditor();
  return (
    <div className="flex items-center h-full">
      <span
        className="pl-3.5 text-inactive hover:text-primary h-full cursor-pointer flex items-center"
        onClick={() => {
          const newSize = editorOptions.fontSize - 1;
          setEditorOptions((curr: any) => ({
            ...curr,
            fontSize: newSize,
          }));
        }}
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
        onClick={() => {
          const newSize = editorOptions.fontSize + 1;
          setEditorOptions((curr: any) => ({
            ...curr,
            fontSize: newSize,
          }));
        }}
      >
        <PlusFontSizeIcon className="h-3" />
      </span>
    </div>
  );
};

const HrDivider = () => {
  return <div className="w-[2px] h-[18px] rounded-full bg-selected"></div>;
};

export const TextFormatting = () => {
  const { editor } = useScriptEditor();

  // Function to check if the current selection has a specific mark
  const isMarkActive = (markType: any) => {
    if (!editor) return false;
    return editor.isActive(markType);
  };

  const formattingOptions = [
    {
      leftIcon: <BoldTextIcon className="h-3" />,
      type: "bold",
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleBold().run();
        }
      },
      isActive: isMarkActive("bold"),
    },
    {
      leftIcon: <ItalicTextIcon className="h-3" />,
      type: "italic",
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleItalic().run();
        }
      },
      isActive: isMarkActive("italic"),
    },
    {
      leftIcon: <CommentedTextIcon className="h-3.5" />,
      type: "comment",
      onClick: () => {
        if (editor && isCursorInComment(editor)) {
          // Logic to remove comment
          if (editor) toggleComment(editor);
        } else {
          if (editor) toggleComment(editor);
        }
      },
      isActive: editor ? isCursorInComment(editor) : false,
    },
  ];

  // Update the active state whenever selection or content changes
  useEffect(() => {
    if (!editor) return;

    const updateFormatState = () => {
      // No need to update state here, we'll check active marks in real-time
    };

    const handler = () => {
      setTimeout(updateFormatState, 0);
    };

    editor.on("selectionUpdate", handler);
    editor.on("transaction", handler);

    return () => {
      editor.off("selectionUpdate", handler);
      editor.off("transaction", handler);
    };
  }, [editor]);

  return (
    <div className="flex items-center h-full">
      {formattingOptions.map((option, index) => (
        <FormatButton
          key={index}
          icon={option.leftIcon}
          isActive={option.isActive}
          onClick={option.onClick}
        />
      ))}
    </div>
  );
};

// FormatButton component for individual formatting buttons
const FormatButton = ({ icon, isActive, onClick }: any) => {
  return (
    <div
      onClick={onClick}
      className={`h-full px-3 rounded-lg flex justify-center items-center cursor-pointer ${
        isActive
          ? "bg-brand text-primary"
          : "text-secondary hover:text-primary hover:bg-hover"
      }`}
    >
      {icon}
    </div>
  );
};

const TextAlignment = ({ editorOptions, setEditorOptions }: any) => {
  const { editor } = useScriptEditor();

  // Helper function to apply alignment to all paragraphs
  const applyAlignmentToAllParagraphs = (alignment: string) => {
    if (!editor) return;

    // Store current selection
    const { from, to } = editor.state.selection;

    // Find all paragraph nodes and apply alignment
    const tr = editor.state.tr;
    editor.state.doc.descendants((node: any, pos: any) => {
      if (node.type.name === "paragraph") {
        tr.setNodeMarkup(pos, null, {
          ...node.attrs,
          textAlign: alignment,
        });
      }
      return true;
    });

    // Apply transaction and restore selection
    editor.view.dispatch(tr);
    editor.commands.setTextSelection({ from, to });
  };

  const textAlignmentSegments = [
    {
      leftIcon: <TextAlignLeftIcon className="w-4" />,
      onClick: () => {
        setEditorOptions((curr: any) => ({
          ...curr,
          textAlignment: "left",
        }));
        applyAlignmentToAllParagraphs("left");
      },
    },
    {
      leftIcon: <TextAlignCenterIcon className="w-4" />,
      onClick: () => {
        setEditorOptions((curr: any) => ({
          ...curr,
          textAlignment: "center",
        }));
        applyAlignmentToAllParagraphs("center");
      },
    },
    {
      leftIcon: <TextAlignLeftIcon className="w-4 scale-x-[-1]" />,
      onClick: () => {
        setEditorOptions((curr: any) => ({
          ...curr,
          textAlignment: "right",
        }));
        applyAlignmentToAllParagraphs("right");
      },
    },
    {
      leftIcon: <TextAlignJustifyIcon className="w-4" />,
      onClick: () => {
        setEditorOptions((curr: any) => ({
          ...curr,
          textAlignment: "justify",
        }));
        applyAlignmentToAllParagraphs("justify");
      },
    },
  ];

  return (
    <ScriptEditorSegment
      segments={textAlignmentSegments}
      selectedSegment={
        editorOptions.textAlignment === "left"
          ? 0
          : editorOptions.textAlignment === "center"
          ? 1
          : editorOptions.textAlignment === "right"
          ? 2
          : 3
      }
      segmentWidth={44}
    />
  );
};

const ScriptControls = ({
  editorOptions,
  setEditorOptions,
  isVisible,
  setisVisible,
}: any) => {
  const { editor } = useScriptEditor();

  useEffect(() => {
    if (!editor) return;

    // Function to update the UI based on cursor position
    const updateUI = () => {
      const isInComment = isCursorInComment(editor);

      // This will now return the common alignment of all paragraphs
      const currentAlignment = getTextAlignment(editor);

      // Update the state to ensure UI stays in sync
      setEditorOptions((curr: any) => ({
        ...curr,
        textType: isInComment ? "comment" : "default",
        textAlignment: currentAlignment,
      }));
    };

    // Run immediately on mount and editor changes
    updateUI();

    // Create a handler that runs on both selection changes and transactions
    const handler = () => {
      // Small delay to ensure DOM is updated
      setTimeout(updateUI, 0);
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
      transition={{ duration: 0.15, delay: isVisible ? 0.15 : 0 }}
      className="pointer-events-auto p-[3px] rounded-[10px] bg-foreground border-stroke border-[1px]"
    >
      <div className="h-8 flex items-center gap-1">
        <TextFormatting />

        <HrDivider />

        <FontSizeControl
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
        />

        <HrDivider />

        <TextAlignment
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
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
