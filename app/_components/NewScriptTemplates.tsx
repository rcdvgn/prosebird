import React from "react";
import { AddIcon, EmptyScriptIcon, ImportIcon, AiIcon } from "../_assets/icons";
export default function NewscriptTemplates() {
  return (
    <div className="">
      <div className="">
        <span className="files-section-title">New script</span>
      </div>
      <div className="flex gap-8 mt-7">
        <div className="group border-[1px] border-border h-[155px] w-[350px] rounded-[10px] hover:bg-foreground p-4 cursor-pointer flex flex-col gap-3 transition-all ease-in-out duration-300">
          <div className="flex justify-between items-start">
            <div className="icon-container group-hover:bg-text-primary">
              <EmptyScriptIcon className="text-primary group-hover:text-background h-4" />
            </div>
            <AddIcon className="fill-text-secondary w-3 m-1 h-fit group-hover:fill-text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-primary text-base">Blank</span>

            <span className="leading-5 font-medium text-text-secondary text-sm">
              Start from zero with a blank script
            </span>
          </div>
        </div>

        <div className="group border-[1px] border-border h-[155px] w-[350px] rounded-[10px] hover:bg-foreground p-4 cursor-pointer flex flex-col gap-3 transition-all ease-in-out duration-300">
          <div className="flex justify-between items-start">
            <div className="icon-container group-hover:bg-text-primary">
              <ImportIcon className="text-primary group-hover:text-background w-[14px]" />
            </div>
            <AddIcon className="fill-text-secondary w-3 m-1 h-fit group-hover:fill-text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-primary text-base">
              Upload document
            </span>

            <span className="leading-5 font-medium text-text-secondary text-sm">
              Continue from where you left off by uploading a text based
              document
            </span>
          </div>
        </div>

        <div className="group border-[1px] border-border h-[155px] w-[350px] rounded-[10px] hover:bg-foreground p-4 cursor-pointer flex flex-col gap-3 transition-all ease-in-out duration-300">
          <div className="flex justify-between items-start">
            <div className="icon-container group-hover:bg-text-primary">
              <AiIcon className="text-primary group-hover:text-background w-4 h-fit" />
            </div>
            <AddIcon className="fill-text-secondary w-3 m-1 h-fit group-hover:fill-text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-primary text-base">
              AI-generated
            </span>

            <span className="leading-5 font-medium text-text-secondary text-sm">
              Skip the work and let our AI powered assistent generate a script
              to your liking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
