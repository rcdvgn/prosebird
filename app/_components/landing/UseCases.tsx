import React from "react";
import { SubHeader } from "./Header";
import {
  AcademicIcon,
  ChevronIcon,
  ContentIcon,
  GraphIcon,
} from "@/app/_assets/landingIcons";

export default function UseCases() {
  const items = [
    {
      icon: AcademicIcon,
      title: "Academic Presentations",
      desc: "Save time from pointless memorization, break your subject into chapters and present it with your friends.",
    },
    {
      icon: GraphIcon,
      title: "Sales & Client Meetings",
      desc: "Access key insights and pace your delivery on the fly with a comprehensive suite of presentation tools.",
    },
    {
      icon: ContentIcon,
      title: "Content Creation",
      desc: "Write, rehearse, and present your audio and visual content with instant previews and in-script comments.",
    },
  ];

  return (
    <div className="bg-middleground w-full flex justify-center items-start py-28 min-[730px]:px-12">
      <div className="w-full max-w-[1080px] text-center px-4">
        <SubHeader title="For moments of all sizes, we've got you covered" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-4 sm:gap-6">
          {items.map((item: any, index: any) => {
            return (
              <div
                key={index}
                className={`group relative ${
                  index === 2 && items.length === 3
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                }`}
              >
                <div className="transition-opacity duration-300 ease-in-out group-hover:opacity-100 opacity-0 relative h-40 overflow-hidden from-50% bg-gradient-to-tl from-[#092481]/25 to-brand/25 rounded-2xl border-[1px] border-brand/10">
                  <item.icon
                    gradient={true}
                    className="w-full absolute left-1/2 inset-y-0 m-auto scale-x-[-1] opacity-5 pointer-events-none"
                  />

                  <div className="flex flex-col gap-3 justify-center items-center h-full w-full p-6">
                    <span className="font-bold text-primary text-[18px]">
                      {item.title}
                    </span>

                    <p className="font-semibold text-secondary text-[15px]">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="cursor-default transition-opacity duration-300 ease-in-out absolute border-[1px] border-stroke bg-background w-full h-full left-0 top-0 overflow-hidden rounded-2xl group-hover:opacity-0 opacity-100">
                  <div className="w-full h-full bg-gradient-to-br from-middleground/0 from-50% to-middleground/0 flex flex-col justify-between items-center p-6">
                    <item.icon className="text-placeholder h-[30px]" />

                    <div className="flex flex-col gap-3 items-center justify-center">
                      <span className="font-bold text-primary text-xl">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="font-semibold text-brand text-sm">
                          Learn more
                        </span>

                        <ChevronIcon className="h-2 text-brand translate-y-[1.5px]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
