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
      onClick: () =>
        setEditorOptions((currEditorOptions: any) => ({
          ...currEditorOptions,
          textType: "comment",
        })),
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
            editorOptions.textAligment === "left"
              ? 0
              : editorOptions.textAligment === "center"
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
