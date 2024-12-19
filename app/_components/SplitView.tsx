import React from "react";

export default function SplitView({ options, children }: any) {
  return (
    <div
      className={`h-full w-full p-2.5 flex ${
        options?.side === "left" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="h-full grow rounded-[10px] pl-2.5 bg-middleground border-[1px] border-border"></div>

      <div
        className={`flex items-center justify-center ${
          options?.containerWidth ? options.containerWidth : "w-[600px]"
        }
        `}
      >
        {children}
      </div>
    </div>
  );
}
