"use client";

import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  FluidIcon,
  FullscreenIcon,
  IntuitiveIcon,
  StructuredIcon,
} from "@/app/_assets/landingIcons";
import { Header } from "./Header";
import InViewAnimation from "./InViewAnimation";

export default function Editor({ editorRef }: any) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreenView, setIsFullscreenView] = useState(false);
  const [fullscreenStartIndex, setFullscreenStartIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  const items = [
    {
      imgSrc:
        "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUWJvUWn1yF9ZTMU4EzNlHGP8XLsaD50fB1uQC",
      icon: <IntuitiveIcon className="w-5 text-brand" />,
      title: "Intuitive",
      desc: "Its user-friendly interface and smart shortcuts allow you to turn your ideas into words faster than ever before.",
    },
    {
      imgSrc:
        "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUVEIXjuJKIFZg3h5o7VMUGAxPuSlckX8Y6JWr",
      icon: <StructuredIcon className="w-5 text-brand" />,
      title: "Structured",
      desc: "Chapters are to ProseBird what slides are to PowerPoint: Create, edit and arrange them to match the flow and visuals of your presentation.",
    },
    {
      imgSrc:
        "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUnUbKYjLUd1TMAVxLKbqtYj2aBk7Z4yEuQzJ6",
      icon: <FluidIcon className="w-5 text-brand" />,
      title: "Fluid",
      desc: "Reformat text, preview your script and drag & drop stuff around. An editor that molds to your workflow, not the reverse.",
    },
  ];

  const handleThumbClick = (index: any) => {
    setSelectedIndex(index);
  };

  const toggleFullScreenView = (index?: number) => {
    if (windowWidth >= 1024) {
      // Store the current index when opening fullscreen
      if (!isFullscreenView && index !== undefined) {
        setFullscreenStartIndex(index);
      } else if (!isFullscreenView) {
        setFullscreenStartIndex(selectedIndex);
      }
      setIsFullscreenView(!isFullscreenView);
    }
  };

  // Listen for window resize to track viewport width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Initialize on client-side
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 6000);

    return () => clearInterval(autoplayInterval);
  }, [selectedIndex, items.length]);

  // Prevent body scrolling when fullscreen is active
  useEffect(() => {
    if (isFullscreenView) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullscreenView]);

  return (
    <div
      ref={editorRef}
      className="bg-middleground w-full min-h-screen flex justify-center items-start py-40 sm:px-12"
    >
      <InViewAnimation className="w-full max-w-[1080px] max-md:px-4">
        <Header
          section="script editor"
          title1="Rehearse less,"
          title2="create more"
          subtitle="ProseBird's built-in rich text editor accelarates your preparation by combining everything you need in one place."
        />

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-6 xl:gap-10">
          <div className="flex flex-col items-start w-full lg:w-[446px] gap-4 lg:gap-0 justify-between self-stretch">
            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleThumbClick(index)}
                  className={`p-3 rounded-xl border-[1px] w-full cursor-pointer transition-all duration-300 ${
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

          <div className="group/parent relative shrink-0 overflow-hidden border-stroke border-[1px] rounded-xl">
            <div className="relative w-full xl:w-auto lg:w-[45vw] xl:h-[344px]">
              <img
                src={items[selectedIndex].imgSrc}
                className="invisible w-full xl:w-auto lg:w-[45vw] xl:h-[344px]"
                alt="Size reference"
              />

              <div className="absolute inset-0 group-hover/parent:scale-105 transition-all duration-150 ease-in-out">
                {items.map((item, index) => (
                  <img
                    key={index}
                    src={item.imgSrc}
                    className={`w-full xl:w-auto lg:w-[45vw] xl:h-[344px] absolute top-0 left-0 transition-opacity duration-500 ease-linear ${
                      index === selectedIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    }`}
                    alt={item.title}
                  />
                ))}
              </div>

              <span
                onClick={() => toggleFullScreenView(selectedIndex)}
                className={`group z-20 absolute w-full h-full grid place-items-center left-0 top-0 m-auto hover:bg-black/35 transition-colors duration-150 ease-in-out ${
                  windowWidth >= 1024 ? "cursor-pointer" : ""
                }`}
              >
                <span className="text-secondary hover:text-primary p-4">
                  <FullscreenIcon
                    className={`group-hover:opacity-100 opacity-0 h-6 transition-all duration-150 ease-in-out group-hover:scale-125 ${
                      windowWidth < 1024 ? "lg:opacity-0" : ""
                    }`}
                  />
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbClick(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedIndex ? "bg-brand" : "bg-secondary/30"
              }`}
              aria-label={`Select item ${index + 1}`}
            />
          ))}
        </div>
      </InViewAnimation>

      {/* Fullscreen View with EmblaCarousel - Only for viewports ≥ 1024px */}
      {isFullscreenView && windowWidth >= 1024 && (
        <FullscreenCarousel
          items={items}
          initialIndex={fullscreenStartIndex}
          onClose={() => setIsFullscreenView(false)}
        />
      )}
    </div>
  );
}

function FullscreenCarousel({ items, initialIndex, onClose }: any) {
  // Use local state for the carousel - independent from parent
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: true, // Enable loop for better user experience
    align: "center",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Handle slide changes and update the local currentIndex
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="w-full h-full max-w-7xl max-h-screen flex flex-col">
        {/* Close button */}
        <div className="flex justify-end py-2 px-4">
          <button
            onClick={onClose}
            className="text-inactive hover:text-primary p-2 rounded-full transition-colors"
            aria-label="Close fullscreen view"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* EmblaCarousel */}
        <div className="relative flex-1 overflow-hidden">
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {items.map((item: any, index: any) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 h-full relative"
                >
                  <img
                    src={item.imgSrc}
                    className="w-full h-full object-contain"
                    alt={item.title}
                  />

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 py-6 px-24 bg-gradient-to-t from-middleground to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary">{item.icon}</div>
                      <h3 className="text-xl text-primary font-bold">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-primary font-medium text-base shadow-lg">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-hover text-inactive hover:text-primary p-3 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-hover text-inactive hover:text-primary p-3 rounded-full transition-colors"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
