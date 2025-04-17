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
      className={`w-full h-screen flex justify-center items-start py-32`}
      style={{
        backgroundImage: `linear-gradient(to top, rgba(var(--middleground), ${
          gradientPosition / 100
        }) ${gradientPosition}%, rgba(var(--middleground), 0) 100%)`,
      }}
    >
      <InViewAnimation
        duration={1}
        scale={false}
        y={false}
        className="w-[1080px]"
      >
        <div className="flex justify-center">
          <div className="w-[630px]">
            <div className="font-extrabold text-[76px] leading-[85px] my-6 text-center">
              <span className="text-primary">Meet </span>
              <span className="text-brand">stress-free </span>
              <span className="text-primary">presentations</span>
            </div>

            <div className="my-1 text-center mb-12">
              <span className="font-semibold text-base leading-6 text-secondary">
                Stop worrying about memorization, cadence or pacing. ProseBird
                takes these variables out of your presentations so you can
                deliver confidently with minimal rehearsal and hit your marks.
                Everytime.
              </span>
            </div>

            <Cta
              success={success}
              setSuccess={setSuccess}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        </div>
      </InViewAnimation>
    </div>
  );
}
