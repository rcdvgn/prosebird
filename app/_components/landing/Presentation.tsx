import React from "react";
import EmblaCarouselWithThumbnails from "./EmblaCarouselWithThumbnails";

export default function Presentation() {
  return (
    <div className="bg-middleground w-full min-h-screen flex justify-center items-start pb-40 -mb-16 md:-mb-32 sm:px-12">
      <div className="w-full max-w-[1080px] -translate-y-16 md:-translate-y-32 px-4">
        <EmblaCarouselWithThumbnails />
      </div>
    </div>
  );
}
