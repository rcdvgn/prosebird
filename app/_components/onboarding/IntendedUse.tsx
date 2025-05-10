"use client";

import { CheckIcon } from "@/app/_assets/icons";

const IntendedUse = ({ formData, setFormData, error }: any) => {
  const selectedItems = formData.intendedUse;

  const toggleItem = (item: string) => {
    const updated = selectedItems.includes(item)
      ? selectedItems.filter((i: any) => i !== item)
      : [...selectedItems, item];

    setFormData((prev: any) => ({
      ...prev,
      intendedUse: updated,
    }));
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
    <div className="">
      <div className="flex flex-col gap-12 w-full">
        {activityGroups.map((groupItem, groupIndex) => (
          <div key={groupIndex}>
            <div className="mb-4">
              <span className="text-primary font-bold text-xl">
                {groupItem.title}
              </span>
            </div>

            <div className="flex gap-3 flex-wrap">
              {groupItem.activities.map((item, index) => {
                const isSelected = selectedItems.includes(item);

                return (
                  <span
                    key={index}
                    onClick={() => toggleItem(item)}
                    className={`rounded-[14px] h-11 px-3.5 text-nowrap flex items-center select-none gap-3 cursor-pointer border-[1px]
                      ${
                        isSelected
                          ? "bg-brand/15 border-brand/20 text-brand"
                          : "border-transparent bg-foreground hover:bg-hover text-inactive hover:text-primary"
                      }
                    `}
                  >
                    <div
                      className={`h-5 w-5 rounded-md border-[1px] grid place-items-center ${
                        isSelected
                          ? "border-transparent bg-brand"
                          : "bg-background border-stroke"
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
      {error?.intendedUse && (
        <span className="text-xs text-red-500 font-medium my-4 px-1 block">
          {error.intendedUse}
        </span>
      )}
    </div>
  );
};

export default IntendedUse;
