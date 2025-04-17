"use client";

import { PlusIcon } from "@/app/_assets/landingIcons";
import { SubHeader } from "./Header";
import { useState } from "react";
import InViewAnimation from "./InViewAnimation";

const Faq = ({ faqRef }: any) => {
  const [selectedQ, setSelectedQ] = useState<any>(null);

  const questions = [
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations.",
    },
    {
      q: "When will it be available?",
      a: "ProseBird is expected to launch in May 15, 2025 for users that signed up for the early access.",
    },
    {
      q: "Is it going to be free to use?",
      a: "Although it will offer a basic free tier, ProseBird is primarily a paid app.",
    },
    {
      q: "How does the voice control work?",
      a: "When voice scrolling is activated, ProseBird automatically matches your speech to the script, advancing your presentation and syncing your progress across all connected devices in real time.",
    },
    {
      q: "Can I use it for in-person presentations?",
      a: "Yes! ProseBird can do everything a traditional teleprompter does, with the added benefits of voice-controlled scrolling and multi-device sync, without the need for bulky, expensive hardware.",
    },

    {
      q: "What languages will it support?",
      a: "During Early Access, voice-controlled presentations will be available in English only. Support for additional languages will roll out in future updates, prioritizing those most requested by users.",
    },
  ];

  return (
    <div
      ref={faqRef}
      className="bg-middleground w-full min-h-screen flex justify-center items-start py-40 rounded-b-[30px] sm:px-12"
    >
      <InViewAnimation className="w-[1080px] text-center px-4 flex flex-col items-center">
        <SubHeader title="Frequently asked questions" />

        <div className="max-w-[760px] select-none w-full items-center flex flex-col gap-4">
          {questions.map((item: any, index: any) => (
            <div
              key={index}
              onClick={() =>
                selectedQ === index ? setSelectedQ(null) : setSelectedQ(index)
              }
              className="group w-full rounded-2xl bg-background hover:bg-foreground cursor-pointer px-6"
            >
              <div className="flex justify-between items-center w-full h-16">
                <span className="text-primary text-base font-bold text-left">
                  {item.q}
                </span>
                <span className="p-2">
                  <PlusIcon
                    className={`text-inactive group-hover:text-primary h-4 transition-all duration-200 ease-in-out ${
                      selectedQ === index ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  selectedQ === index
                    ? "max-h-[1000px] opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-secondary text-base font-medium text-left pb-6">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </InViewAnimation>
    </div>
  );
};

export default Faq;
