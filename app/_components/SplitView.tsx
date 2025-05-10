import React from "react";

export default function SplitView({ options, children }: any) {
  return (
    <div
      className={`p-2.5 flex gap-2.5 bg-background ${
        options?.containerStyling ? options.containerStyling : ""
      } ${options?.side === "left" ? "flex-row-reverse" : "flex-row"}`}
    >
      <div className="h-full grow rounded-[10px] pl-2.5 bg-middleground border-[1px] border-stroke w-[450px]"></div>

      <div
        className={`flex items-center justify-center w-${
          options?.contentWidth ? options.contentWidth : "[700px]"
        }
        `}
      >
        {children}
      </div>
    </div>
  );
}
