"use client";

import { useEffect, useState } from "react";
import Cta from "./Cta";

export default function Hero({ scrollContainerRef }: any) {
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleScroll = () => {
      // Calculate the scroll percentage based on component height
      const scrollPosition = scrollContainer.scrollTop;

      const componentHeight = window.innerHeight; // Since it's h-screen
      // Calculate percentage (0-100)
      const scrollPercentage = Math.min(
        Math.max((scrollPosition / componentHeight) * 100, 0),
        100
      );

      setGradientPosition(scrollPercentage * 1.5);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <div
      className={`w-full h-screen flex justify-center items-start -mt-16 py-28`}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(var(--middleground), ${
          gradientPosition / 100
        }) ${gradientPosition}%, rgba(var(--middleground), 0) 100%)`,
      }}
    >
      <div className="w-[1080px]">
        <div className="flex justify-center items-center">
          <div className="w-[620px]">
            <div className="font-extrabold text-7xl leading-[80px] my-6 text-center">
              <div className="">
                <span className="text-primary opacity-10 select-none">[</span>
                <span className="text-primary">Take doubt out</span>
              </div>

              <div className="">
                <span className="text-brand">of your words</span>
                <span className="text-primary opacity-10 select-none">]</span>
              </div>
            </div>

            <div className="my-1 text-center mb-12">
              <span className="font-semibold text-base leading-6 text-secondary">
                ProseBird is your all-in-one teleprompter for flawless virtual
                presentations that helps you deliver confidently every time you
                step on the virtual stage.
              </span>
            </div>

            <Cta />
          </div>
        </div>
      </div>
    </div>
  );
}
