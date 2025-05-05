import { HorizontalArrowIcon } from "@/app/_assets/icons";
import React from "react";

export default function OnboardingContainer({
  children,
  title,
  description,
  step,
}: any) {
  return (
    <div className="relative overflow-y-scroll w-[732px] h-full flex flex-col gap-16 items-center px-12 pt-12">
      <div className="w-full">
        <span className="block uppercase text-sm font-extrabold text-brand">
          Step {step} of 5
        </span>
        <div className="">
          <span className="block my-3 font-extrabold text-2xl text-primary">
            {title}
          </span>
          <span className="block text-secondary font-medium">
            {description}
          </span>
        </div>
      </div>

      <div className="w-[574px] flex justify-center items-center">
        {children}
      </div>

      <div className="py-4 bg-middleground sticky w-full bottom-0 shrink-0 mt-auto flex items-center justify-between">
        <button className="btn-3-lg">
          <HorizontalArrowIcon className="w-3 scale-x-[-1]" />
          <span className="">Back</span>
        </button>

        <div className="flex items-center gap-4">
          <button className="btn-3-lg">Skip</button>
          <button className="btn-1-lg">Continue</button>
        </div>
      </div>
    </div>
  );
}
