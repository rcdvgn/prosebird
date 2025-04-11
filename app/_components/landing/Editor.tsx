"use client";

import { useEffect, useState } from "react";
import {
  FluidIcon,
  FullscreenIcon,
  IntuitiveIcon,
  StructuredIcon,
} from "@/app/_assets/landingIcons";
import { Header } from "./Header";
// import Image from "next/image";

export default function Editor() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const items = [
    {
      imgSrc:
        "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUaxZ3G8Q4dUP3ZhOuzY5mRekTr8XqMBoDc6nt",
      icon: <IntuitiveIcon className="w-5 text-brand" />,
      title: "Intuitive",
      desc: "Its user-friendly interface and smart shortcuts allow you to turn your ideas into words faster than ever before.",
    },
    {
      imgSrc:
        "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUaxZ3G8Q4dUP3ZhOuzY5mRekTr8XqMBoDc6nt",
      icon: <StructuredIcon className="w-5 text-brand" />,
      title: "Structured",
      desc: "Chapters are to ProseBird what slides are to PowerPoint: Create, edit and arrange them to match the flow and visuals of your presentation.",
    },
    {
      imgSrc:
        "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUaxZ3G8Q4dUP3ZhOuzY5mRekTr8XqMBoDc6nt",
      icon: <FluidIcon className="w-5 text-brand" />,
      title: "Fluid",
      desc: "Reformat text, preview your script and drag & drop stuff around. An editor that molds to your workflow, not the reverse.",
    },
  ];

  const handleThumbClick = (index: any) => {
    setSelectedIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    // Clear any existing interval first (this is important when selectedIndex changes)
    const autoplayInterval = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 6000); // Change slide every 4 seconds

    return () => clearInterval(autoplayInterval);
  }, [selectedIndex, items.length]);

  return (
    <div className="bg-middleground w-full min-h-screen flex justify-center items-start py-28">
      <div className="w-[1080px]">
        <Header
          section="script editor"
          title1="No more to copy/paste"
          title2="between tools"
          subtitle="ProseBird's built-in rich text editor accelarates your preparation by combining writing and rehearsing, all in one place."
        />

        <div className="flex items-stretch justify-between">
          {/* thumbnail items */}
          <div className="flex flex-col justify-between items-start">
            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleThumbClick(index)}
                  className={`p-3 rounded-xl border-[1px] w-[446px] cursor-pointer transition-all duration-300 ${
                    index === selectedIndex
                      ? "border-brand bg-brand/10"
                      : "border-transparent hover:bg-hover"
                  }`}
                >
                  <div className="flex gap-3 mb-2.5">
                    {item.icon}
                    <span className="text-base text-primary font-bold">
                      {item.title}
                    </span>
                  </div>
                  <div className="">
                    <p className="font-semibold text-secondary text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image carousel with proper sizing */}
          <div className="group/parent relative shrink-0 overflow-hidden border-stroke border-[1px] rounded-xl ">
            {/* This visible image maintains the container size */}
            <img
              src={items[selectedIndex].imgSrc}
              className="invisible h-[344px]"
              alt="Size reference"
            />

            {/* Absolute positioned images for fading effect */}
            <div className="absolute inset-0 group-hover/parent:scale-105 transition-all duration-150 ease-in-out">
              {items.map((item, index) => (
                <img
                  key={index}
                  src={item.imgSrc}
                  className={`h-[344px] absolute top-0 left-0 transition-opacity duration-500 ease-linear ${
                    index === selectedIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                  alt={item.title}
                  // width={3367}
                  // height={2000}
                />
              ))}
            </div>

            <span className="group z-20 absolute w-full h-full grid place-items-center left-0 top-0 m-auto hover:bg-black/35 transition-colors duration-150 ease-in-out cursor-pointer">
              <span className="text-secondary hover:text-primary p-4">
                <FullscreenIcon className="group-hover:opacity-100 opacity-0 h-6 transition-all duration-150 ease-in-out group-hover:scale-125" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
