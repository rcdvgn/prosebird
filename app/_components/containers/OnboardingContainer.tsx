import { HorizontalArrowIcon } from "@/app/_assets/icons";
import React from "react";

export default function OnboardingContainer({
  children,
  title,
  description,
  currentStep,
  setCurrentStep,
  handleContinue,
  isFinal,
  skippable = false,
}: any) {
  return (
    <div className="relative overflow-y-scroll w-[580px] h-full flex flex-col gap-12 items-center px-12 pt-8">
      <div className="w-full">
        <span className="block uppercase text-sm font-extrabold text-brand">
          Step {currentStep + 1} of 5
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

      <div className="w-full flex justify-center items-center">{children}</div>

      <div className="py-4 bg-background sticky w-full bottom-0 shrink-0 mt-auto flex items-center justify-between">
        <button
          disabled={currentStep <= 0}
          onClick={() =>
            currentStep > 0 && setCurrentStep((curr: number) => curr - 1)
          }
          className={`btn-3-lg group ${
            currentStep <= 0 ? "pointer-events-none invisible" : "visible"
          }`}
        >
          <HorizontalArrowIcon
            className={`w-3 scale-x-[-1] transition-all ${
              currentStep <= 0 ? "" : "group-hover:translate-x-[-2px]"
            }`}
          />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-4">
          {!isFinal && skippable && (
            <button
              onClick={() => {
                setCurrentStep((curr: number) => curr + 1);
              }}
              className="btn-3-lg"
            >
              Skip
            </button>
          )}
          {isFinal ? (
            <button className="btn-1-lg" onClick={handleContinue}>
              Get started
            </button>
          ) : (
            <button className="btn-1-lg" onClick={handleContinue}>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
