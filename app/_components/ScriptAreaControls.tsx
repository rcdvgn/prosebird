import React, { useState } from "react";
import SegmentedControl from "./ui/SegmentedControl";
import {
  ClearIcon,
  CloseIcon,
  CommentedTextIcon,
  DefaultTextIcon,
  MinusFontSizeIcon,
  PlusFontSizeIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
} from "../_assets/icons";

const FontSizeControl = () => {
  const [fontSize, setFontSize] = useState<any>(14);

  return (
    <div className="flex items-center h-full">
      <span
        className="pl-3.5 text-inactive hover:text-primary h-full cursor-pointer flex items-center"
        onClick={() => setFontSize((currFontSize: any) => currFontSize - 1)}
      >
        <MinusFontSizeIcon className="w-3" />
      </span>
      <div className="w-11 text-center cursor-pointer select-none">
        <span className="font-bold text-sm text-inactive hover:text-primary">
          {fontSize}
        </span>
      </div>
      <span
        className="pr-3.5 text-inactive hover:text-primary h-full cursor-pointer flex items-center"
        onClick={() => setFontSize((currFontSize: any) => currFontSize + 1)}
      >
        <PlusFontSizeIcon className="h-3" />
      </span>
    </div>
  );
};

const HrDivider = () => {
  return <div className="w-[2px] h-[18px] rounded-full bg-selected"></div>;
};

const ScriptControls = ({ setisVisible }: any) => {
  const [selectedTextModeSegment, setSelectedTextModeSegment] =
    useState<any>(0);
  const textModeSegments = [
    {
      id: 0,
      leftIcon: <DefaultTextIcon className="h-3" />,
      onClick: () => setSelectedTextModeSegment(0),
    },
    {
      id: 1,
      leftIcon: <CommentedTextIcon className="h-3.5" />,
      onClick: () => setSelectedTextModeSegment(1),
    },
  ];

  const [selectedTextAlignmentSegment, setSelectedTextAlignmentSegment] =
    useState<any>(0);
  const textAlignmentSegments = [
    {
      id: 0,
      leftIcon: <TextAlignLeftIcon className="w-4" />,
      onClick: () => setSelectedTextAlignmentSegment(0),
    },
    {
      id: 1,
      leftIcon: <TextAlignCenterIcon className="w-4" />,
      onClick: () => setSelectedTextAlignmentSegment(1),
    },
  ];

  return (
    <div className="p-[3px] rounded-[10px] bg-foreground border-stroke border-[1px]">
      <div className="h-8 flex items-center gap-1">
        <SegmentedControl
          segments={textModeSegments}
          selectedSegment={selectedTextModeSegment}
          segmentWidth={44}
        />

        <HrDivider />

        <FontSizeControl />

        <HrDivider />

        <SegmentedControl
          segments={textAlignmentSegments}
          selectedSegment={selectedTextAlignmentSegment}
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
    </div>
  );
};

export default function ScriptAreaControls({ setisVisible }: any) {
  return (
    <div className="sticky flex items-center justify-center top-0 left-0 w-full pt-6 px-10">
      <ScriptControls setisVisible={setisVisible} />
    </div>
  );
}
