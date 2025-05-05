"use client";

import { useState } from "react";
import OnboardingContainer from "../containers/OnboardingContainer";
import { CheckIcon } from "@/app/_assets/icons";

const Activities = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItem = (item: string) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const activityGroups = [
    {
      title: "🧑‍🏫 Learning & Teaching",
      activities: ["Class presentations", "Teaching"],
    },
    {
      title: "💼 Professional & Work",
      activities: [
        "Client meetings",
        "Internal memos",
        "Proposals",
        "Workshops",
        "Training",
      ],
    },
    {
      title: "📢 Public Speaking & Live Delivery",
      activities: [
        "Public speaking",
        "Conference talks",
        "Pitches",
        "Webinars",
        "Livestreams",
      ],
    },
    {
      title: "🎙️ Media & Content Creation",
      activities: [
        "Podcasting",
        "Video creation",
        "Voiceovers",
        "Social media",
      ],
    },
    {
      title: "✍️ Creative & Expressive",
      activities: [
        "Storytelling",
        "Monologues",
        "Speech practice",
        "Just exploring",
      ],
    },
  ];

  return (
    <OnboardingContainer
      title="What do you want help with?"
      description="Letting us know how you’ll use ProseBird helps us shape a better experience for you."
      step="3"
    >
      <div className="flex flex-col gap-12">
        {activityGroups.map((groupItem, groupIndex) => (
          <div key={groupIndex}>
            <div className="mb-4">
              <span className="text-primary font-bold text-xl">
                {groupItem.title}
              </span>
            </div>

            <div className="flex gap-3 flex-wrap">
              {groupItem.activities.map((item, index) => {
                const isSelected = selectedItems.includes(item); // 👈 use for styling

                return (
                  <span
                    key={index}
                    onClick={() => toggleItem(item)}
                    className={`rounded-[14px] h-11 px-3.5 text-nowrap flex items-center select-none gap-3 cursor-pointer border-[1px]
                      ${
                        isSelected
                          ? "bg-brand/10 border-brand/20 text-brand"
                          : "border-transparent bg-background hover:bg-hover text-inactive hover:text-primary"
                      }
                    `}
                  >
                    <div
                      className={`h-5 w-5 rounded-md border-[1px] grid place-items-center ${
                        isSelected
                          ? "border-transparent bg-brand"
                          : "bg-middleground border-foreground"
                      }`}
                    >
                      {isSelected && (
                        <CheckIcon className="text-primary h-2 translate-x-[1px]" />
                      )}
                    </div>
                    <span className="font-semibold text-sm">{item}</span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </OnboardingContainer>
  );
};

export default Activities;
