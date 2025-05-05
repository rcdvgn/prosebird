"use client";

import { useState } from "react";
import OnboardingContainer from "../containers/OnboardingContainer";
import {
  AddIcon,
  CloseIcon,
  TeamIcon,
  UserIcon,
  XDeleteIcon,
} from "@/app/_assets/icons";

const Team = () => {
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const options = [
    {
      text: "Alone, just me",
      Icon: UserIcon,
    },
    {
      text: "With my team",
      Icon: TeamIcon,
    },
  ];

  return (
    <OnboardingContainer
      title="Who will you be working with?"
      description="Letting us know how you’ll use ProseBird helps us shape a better experience for you."
      step="4"
    >
      <div className="flex flex-col gap-12 w-full">
        <div className="flex justify-center items-center gap-6">
          {options.map((item, index) => {
            const isSelected = index === selectedOption;
            const Icon = item.Icon;

            return (
              <div
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`group h-52 w-52 rounded-2xl select-none cursor-pointer flex flex-col justify-between items-center p-4 ${
                  isSelected
                    ? "bg-brand/10 ring-1 ring-brand/30 text-brand"
                    : "border-transparent bg-background hover:bg-hover text-placeholder"
                }`}
              >
                <span
                  className={`text-sm font-bold my-4 invisible ${
                    isSelected
                      ? "!text-brand"
                      : "!text-inactive group-hover:!text-primary"
                  }`}
                >
                  {item.text}
                </span>

                <Icon
                  filled={true}
                  className={`h-12 -translate-y-1/4 transition-all duration-150 ease-in-out ${
                    isSelected ? "scale-110" : "group-hover:scale-110"
                  }`}
                />

                <span
                  className={`text-sm font-bold my-4 ${
                    isSelected
                      ? "!text-brand"
                      : "!text-inactive group-hover:!text-primary"
                  }`}
                >
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <TeamEmails />
      </div>
    </OnboardingContainer>
  );
};

const TeamEmails = () => {
  const [teamEmails, setTeamEmails] = useState<any>(["", "", ""]);

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <label className="text-primary text-sm font-semibold px-3.5">
        Team emails
      </label>

      <div className="flex flex-col gap-3 items-center w-full">
        {teamEmails.map((email: any, index: any) => {
          return (
            <div key={index} className="flex items-center gap-2.5 w-full">
              <input
                value={email}
                onChange={(e) =>
                  setTeamEmails((prev: any) =>
                    prev.map((val: any, i: number) =>
                      i === index ? e.target.value : val
                    )
                  )
                }
                type="text"
                className="input-default grow"
                placeholder="E.g. name@institution.com"
              />

              <span
                className="button-icon shrink-0"
                onClick={() =>
                  setTeamEmails((prev: any) =>
                    prev.filter((_: any, i: any) => i !== index)
                  )
                }
              >
                <XDeleteIcon className="h-3" />
              </span>
            </div>
          );
        })}
      </div>

      <span
        onClick={() => setTeamEmails((curr: any) => [...curr, ""])}
        className="flex items-center gap-1.5 cursor-pointer"
      >
        <AddIcon className="h-3 text-brand" />
        <span className="text-brand font-semibold text-[13px]">
          Add another
        </span>
      </span>
    </div>
  );
};

export default Team;
