"use client";

import {
  UseCasesAcademicIcon,
  UseCasesPersonalIcon,
  UseCasesProfessionalIcon,
} from "@/app/_assets/icons";
import { useState } from "react";
import OnboardingContainer from "../containers/OnboardingContainer";

const UseCases = () => {
  const [selectedUseCase, setSelectedUseCase] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<any>(null);

  const useCases = [
    {
      title: "Academic Use",
      desc: "For school, university, or teaching.",
      icon: (filled: boolean) => (
        <UseCasesAcademicIcon className="h-4" filled={filled} />
      ),
    },
    {
      title: "Professional Use",
      desc: "For work, business, or career material.",
      icon: (filled: boolean) => (
        <UseCasesProfessionalIcon className="h-4" filled={filled} />
      ),
    },
    {
      title: "Personal Use",
      desc: "For creative or personal projects.",
      icon: (filled: boolean) => (
        <UseCasesPersonalIcon className="w-4" filled={filled} />
      ),
    },
  ];

  return (
    <OnboardingContainer
      title="How do you plan to use ProseBird?"
      description="We recommend using your first and last name, but it’s really up to you."
      step="2"
    >
      <div className="w-full flex flex-col gap-3">
        {useCases.map((item, index) => {
          const isActive = selectedUseCase === index || hoveredIndex === index;

          return (
            <div
              key={index}
              onClick={() => setSelectedUseCase(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group w-full py-5 px-6 rounded-[20px] flex items-center gap-6 border-[1px] cursor-pointer ${
                selectedUseCase === index
                  ? "bg-brand/10 border-brand/20"
                  : "bg-background border-transparent hover:bg-foreground"
              }`}
            >
              <div
                className={`h-12 aspect-square rounded-[14px] grid place-items-center ${
                  selectedUseCase === index
                    ? "bg-brand text-primary"
                    : "bg-foreground text-secondary group-hover:bg-battleground group-hover:text-primary"
                }`}
              >
                {item.icon(isActive)}
              </div>

              <div className="flex flex-col gap-1">
                <span
                  className={`block font-bold text-base ${
                    selectedUseCase === index
                      ? "text-primary"
                      : "text-inactive group-hover:text-primary"
                  }`}
                >
                  {item.title}
                </span>
                <span className="block font-semibold text-sm text-secondary">
                  {item.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </OnboardingContainer>
  );
};

export default UseCases;
