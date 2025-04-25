"use client";

import { useEffect, useState } from "react";
import Cta from "./Cta";
import InViewAnimation from "./InViewAnimation";

export default function Hero({
  scrollContainerRef,
  success,
  setSuccess,
  loading,
  setLoading,
  source,
  details,
}: any) {
  const [gradientPosition, setGradientPosition] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollPosition = scrollContainer.scrollTop;

      const componentHeight = window.innerHeight;
      const scrollPercentage = Math.min(
        Math.max((scrollPosition / componentHeight) * 100, 0),
        100
      );

      setGradientPosition(scrollPercentage * 1.5);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <div
      className={`relative w-full sm:h-screen min-h-screen flex justify-center items-start py-32`}
    >
      <div
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[rgba(var(--middleground),1)] to-transparent"
        style={{
          height: `${gradientPosition}%`,
        }}
      />
      <InViewAnimation
        duration={1}
        scale={false}
        y={false}
        className="w-full max-w-[1080px] px-4 lg:px-0"
      >
        <div className="flex justify-center">
          <div className="w-full max-w-[680px] flex flex-col items-center">
            <p className="font-extrabold text-[42px] min-[550px]:text-5xl sm:text-6xl lg:text-[76px] leading-tight lg:leading-[85px] my-4 sm:my-5 md:my-6 text-center">
              <span className="text-primary">Meet </span>

              <span
                className="whitespace-nowrap"
                style={{ whiteSpace: "nowrap" }}
              >
                <span className="text-primary/40">[</span>
                <span className="text-primary/40">stress-free</span>
                <span className="text-primary/40">]</span>
              </span>
              <span className="text-primary"> presentations</span>
            </p>

            <div className="my-1 text-center mb-4 w-[80%] sm:w-[90%]">
              <p className="font-semibold text-[13px] leading-5 sm:leading-6 min-[550px]:text-sm sm:text-[15px] md:text-base text-secondary">
                Stop worrying about memorization, cadence or pacing. ProseBird
                takes these variables out of the equation so you can deliver
                confidently with minimal rehearsal. Everytime.
              </p>
            </div>

            <Cta
              success={success}
              setSuccess={setSuccess}
              loading={loading}
              setLoading={setLoading}
              source={source}
              details={details}
            />
          </div>
        </div>
      </InViewAnimation>
    </div>
  );
}
