"use client";

import { PlusIcon } from "@/app/_assets/icons";
import Header from "./Header";
import { useState } from "react";

const Faq = () => {
  const [selectedQ, setSelectedQ] = useState<any>(null);

  const questions = [
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. It enables users to write, edit, and present scripts with real-time collaboration, voice control, and multi-device syncing. Whether for academic presentations, sales pitches, or professional lectures, ProseBird aims to simplify preparation and elevate the delivery of presentations under high-stakes conditions.",
    },
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. It enables users to write, edit, and present scripts with real-time collaboration, voice control, and multi-device syncing. Whether for academic presentations, sales pitches, or professional lectures, ProseBird aims to simplify preparation and elevate the delivery of presentations under high-stakes conditions.",
    },
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. It enables users to write, edit, and present scripts with real-time collaboration, voice control, and multi-device syncing. Whether for academic presentations, sales pitches, or professional lectures, ProseBird aims to simplify preparation and elevate the delivery of presentations under high-stakes conditions.",
    },
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. It enables users to write, edit, and present scripts with real-time collaboration, voice control, and multi-device syncing. Whether for academic presentations, sales pitches, or professional lectures, ProseBird aims to simplify preparation and elevate the delivery of presentations under high-stakes conditions.",
    },
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. It enables users to write, edit, and present scripts with real-time collaboration, voice control, and multi-device syncing. Whether for academic presentations, sales pitches, or professional lectures, ProseBird aims to simplify preparation and elevate the delivery of presentations under high-stakes conditions.",
    },
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. It enables users to write, edit, and present scripts with real-time collaboration, voice control, and multi-device syncing. Whether for academic presentations, sales pitches, or professional lectures, ProseBird aims to simplify preparation and elevate the delivery of presentations under high-stakes conditions.",
    },
    {
      q: "What is ProseBird?",
      a: "ProseBird is an interactive teleprompter designed for solo and collaborative online presentations. It enables users to write, edit, and present scripts with real-time collaboration, voice control, and multi-device syncing. Whether for academic presentations, sales pitches, or professional lectures, ProseBird aims to simplify preparation and elevate the delivery of presentations under high-stakes conditions.",
    },
  ];

  return (
    <div className="py-40 text-center">
      <Header
        section=""
        title1=""
        title2="Frequently asked questions"
        subtitle=""
      />

      <div className="select-none w-full items-center flex flex-col gap-4">
        {questions.map((item: any, index: any) => (
          <div
            key={index}
            onClick={() =>
              selectedQ === index ? setSelectedQ(null) : setSelectedQ(index)
            }
            className="group w-[760px] rounded-2xl bg-background hover:bg-foreground cursor-pointer px-6"
          >
            <div className="flex justify-between items-center w-full h-16">
              <span className="text-primary text-base font-bold">{item.q}</span>
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
    </div>
  );
};

export default Faq;
