import React from "react";

export default function SplitView({ options, children }: any) {
  return (
    <div
      className={`h-full w-full p-2.5 flex gap-2.5 bg-middleground ${
        options?.side === "left" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="h-full grow rounded-[10px] pl-2.5 bg-background border-[1px] border-stroke"></div>

      <div
        className={`flex items-center justify-center w-${
          options?.containerWidth ? options.containerWidth : "[700px]"
        }
        `}
      >
        {children}
      </div>
    </div>
  );
}
