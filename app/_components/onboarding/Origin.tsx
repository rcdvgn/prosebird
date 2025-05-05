"use client";

import { useState } from "react";
import OnboardingContainer from "../containers/OnboardingContainer";
import { CheckIcon } from "@/app/_assets/icons";

const Origin = () => {
  const [selectedOrigin, setSlectedOrigin] = useState<any>(null);

  const origins = ["Google", "Reddit", "Instagram", "TikTok", "X", "Other"];
  const [other, setOther] = useState<any>("");

  return (
    <OnboardingContainer
      title="How did you hear about us?"
      description="Letting us know how you’ll use ProseBird helps us shape a better experience for you."
      step="3"
    >
      <div className="flex flex-col gap-2 w-full">
        {origins.map((item, index) => {
          const isSelected = selectedOrigin === item;
          return (
            <div
              key={index}
              onClick={() => setSlectedOrigin(item)}
              className={`cursor-pointer rounded-[14px] border-[1px] ${
                isSelected
                  ? "bg-brand/10 border-brand/20 text-primary"
                  : "bg-background/30 hover:bg-hover hover:text-primary border-stroke text-inactive"
              }`}
            >
              <div className={`w-full py-4 px-5 flex items-center gap-3`}>
                <div
                  className={`h-4 w-4 rounded-full p-[2px] border-[1px] ${
                    isSelected ? "border-brand" : "border-stroke"
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-full ${
                      isSelected ? "bg-brand" : ""
                    }`}
                  ></div>
                </div>

                <div className="font-semibold text-sm">{item}</div>
              </div>

              {isSelected && item === "Other" && (
                <div className="w-full pb-4 pt-2 px-5">
                  <input
                    value={other}
                    onChange={(e: any) => setOther(e.target.value)}
                    placeholder="Please specify"
                    type="text"
                    className="w-full h-11 border-b-[1px] bg-transparent outline-none border-brand/20 focus:border-brand focus:text-primary text-primary/80 placeholder:text-primary/45 px-4 text-sm font-medium"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </OnboardingContainer>
  );
};

export default Origin;
