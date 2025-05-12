import React, { useEffect, useRef, useState } from "react";
import SegmentedControl from "./ui/SegmentedControl";
import {
  BoldTextIcon,
  ChevronVerticalIcon,
  ClearIcon,
  CloseIcon,
  CommentedTextIcon,
  DefaultTextIcon,
  EditTextIcon,
  EditViewMode,
  ItalicTextIcon,
  MinusFontSizeIcon,
  PlusFontSizeIcon,
  PreviewViewMode,
  RedoIcon,
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TriangleExpandIcon,
  UndoIcon,
} from "../_assets/icons";
import { motion } from "framer-motion";
import { useScriptEditor } from "../_contexts/ScriptEditorContext";
import { toggleComment } from "../_utils/tiptapCommands";
import { getTextAlignment, isCursorInComment } from "../_utils/tiptapHelpers";
import ScriptEditorSegment from "./ui/ScriptEditorSegment";
import DropdownWrapper from "./wrappers/DropdownWrapper";

const FontSizeControl = ({ editorOptions, setEditorOptions }: any) => {
  const { editor } = useScriptEditor();
  return (
    <div className="flex items-center h-full">
      <span
        className="text-inactive rounded-[10px] hover:bg-hover hover:text-primary h-full aspect-square cursor-pointer flex items-center justify-center"
        onClick={() => {
          const newSize = editorOptions.fontSize - 1;
          setEditorOptions((curr: any) => ({
            ...curr,
            fontSize: newSize,
          }));
        }}
      >
        <MinusFontSizeIcon className="w-[14px]" />
      </span>
      <div className="h-full aspect-square grid place-items-center cursor-pointer select-none rounded-[10px] hover:bg-hover hover:text-primary">
        <span className="font-bold text-sm text-inactive">
          {editorOptions.fontSize}
        </span>
      </div>
      <span
        className="text-inactive rounded-[10px] hover:bg-hover hover:text-primary h-full aspect-square cursor-pointer flex items-center justify-center"
        onClick={() => {
          const newSize = editorOptions.fontSize + 1;
          setEditorOptions((curr: any) => ({
            ...curr,
            fontSize: newSize,
          }));
        }}
      >
        <PlusFontSizeIcon className="h-[14px]" />
      </span>
    </div>
  );
};

const HrDivider = () => {
  return <div className="w-[2px] h-5 rounded-full bg-border"></div>;
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
      leftIcon: <BoldTextIcon className="h-[14px]" />,
      type: "bold",
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleBold().run();
        }
      },
      isActive: isMarkActive("bold"),
    },
    {
      leftIcon: <ItalicTextIcon className="h-[14px]" />,
      type: "italic",
      onClick: () => {
        if (editor) {
          editor.chain().focus().toggleItalic().run();
        }
      },
      isActive: isMarkActive("italic"),
    },
    {
      leftIcon: <CommentedTextIcon className="h-[14px]" />,
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
      className={`h-full aspect-square px-1 rounded-lg flex justify-center items-center cursor-pointer ${
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

  const applyAlignmentToAllParagraphs = (alignment: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;

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
      segmentWidth={38}
    />
  );
};

const ViewMode = ({ editorOptions, setEditorOptions }: any) => {
  const [optionsExapanded, setOptionsExapanded] = useState<any>(false);

  return (
    <DropdownWrapper
      align="left"
      isVisible={optionsExapanded}
      setIsVisible={setOptionsExapanded}
      optionGroups={[
        [
          {
            text: editorOptions.viewMode === "editor" ? "Preview" : "Editor",
            beforeIcon:
              editorOptions.viewMode === "editor" ? (
                <PreviewViewMode className="w-4" />
              ) : (
                <EditViewMode className="w-[14px]" />
              ),
            onClick: () =>
              setEditorOptions((curr: any) => ({
                ...curr,
                viewMode: curr.viewMode === "editor" ? "preview" : "editor",
              })),
          },
        ],
      ]}
    >
      <div className="group h-full flex items-center justify-start gap-[2px] text-inactive hover:text-primary cursor-pointer">
        <span className="grid place-items-center h-[30px] aspect-square text-secondary group-hover:text-primary">
          {editorOptions.viewMode === "preview" ? (
            <PreviewViewMode className="w-4" />
          ) : (
            <EditViewMode className="w-[14px]" />
          )}
        </span>
        <span className="font-bold text-sm">
          {String(editorOptions.viewMode).charAt(0).toUpperCase() +
            String(editorOptions.viewMode).slice(1)}
        </span>

        <span className="px-2">
          <TriangleExpandIcon
            className={`w-[7px] text-inactive group-hover:text-primary transition-all select-none ${
              optionsExapanded ? "rotate-180" : "rotate-0 translate-y-[1px]"
            }`}
          />
        </span>
      </div>
    </DropdownWrapper>
  );
};

const UndoRedo = () => {
  const { editor } = useScriptEditor();

  const canUndo = editor ? editor.can().undo() : false;
  const canRedo = editor ? editor.can().redo() : false;

  return (
    <div className="flex items-center h-full">
      <button
        onClick={() => {
          editor ? editor.chain().focus().undo().run() : "";
        }}
        disabled={!canUndo}
        className={`h-full aspect-square rounded-[10px] text-secondary hover:bg-hover hover:text-primary grid place-items-center disabled:text-placeholder disabled:cursor-not-allowed disabled:!bg-transparent`}
      >
        <UndoIcon className="w-3.5" />
      </button>

      <button
        onClick={() => {
          editor ? editor.chain().focus().redo().run() : "";
        }}
        disabled={!canRedo}
        className={`h-full aspect-square rounded-[10px] text-secondary hover:bg-hover hover:text-primary grid place-items-center disabled:text-placeholder disabled:cursor-not-allowed disabled:!bg-transparent`}
      >
        <RedoIcon className="w-3.5" />
      </button>
    </div>
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
      className="pointer-events-auto"
    >
      <div className="h-12 flex items-center gap-1 ring-stroke ring-1 rounded-[13px] bg-foreground p-[5px]">
        <UndoRedo />

        <HrDivider />

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

        <ViewMode
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
        />

        <HrDivider />

        <div
          onClick={() => setisVisible(false)}
          className="h-full aspect-square text-inactive hover:text-primary grid place-items-center cursor-pointer hover:bg-hover rounded-[10px]"
        >
          <ChevronVerticalIcon className="w-3 translate-y-[-1px]" />
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
        className={`flex items-end justify-center w-full px-10 transition-all duration-300 ease-in-out pointer-events-none ${
          isVisible ? "h-[72px]" : "h-0"
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
