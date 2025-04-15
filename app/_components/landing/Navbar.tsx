"use client";

import StandaloneLogo from "@/app/_assets/StandaloneLogo";
import { PrimaryLogo } from "@/app/_assets/logos";
import { useEffect, useState } from "react";

export default function Navbar({ scrollContainerRef }: any) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    // Function to check scroll position
    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollTop;
      if (scrollPosition > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add event listener to the specific scrollable element
    scrollContainer.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Clean up
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <div className="z-30 sticky top-0 h-24 w-full flex justify-center items-center">
      <div
        className={`w-[95%] max-w-[1080px] transition-all duration-300 ease-in-out h-16 flex items-center justify-between px-7 rounded-[20px] border-[1px] ${
          scrolled
            ? "backdrop-blur-lg bg-middleground/50 border-stroke"
            : "border-transparent"
        }`}
      >
        <div className="max-[820px]:hidden flex items-center gap-3">
          <PrimaryLogo className="h-6" />

          <div className="rounded-full px-2.5 py-1 ring-1 ring-brand/35 bg-gradient-to-r from-brand/20 to-blue-700/20 font-bold text-[11px] text-brand cursor-default">
            Early access
          </div>
        </div>

        <span className="min-[820px]:hidden ">
          <StandaloneLogo className="h-6" />
        </span>

        <div className="flex items-center gap-10">
          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1">
            Presentation
          </span>

          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1">
            Script Editor
          </span>

          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1">
            Collaboration
          </span>

          <span className="text-inactive font-bold text-sm cursor-pointer hover:text-primary px-1">
            FAQ
          </span>
        </div>
      </div>
    </div>
  );
}
