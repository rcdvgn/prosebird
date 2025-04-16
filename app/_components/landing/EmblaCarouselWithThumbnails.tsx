import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
// import Image from "next/image";

export default function EmblaCarouselWithThumbnails() {
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true }, [
    WheelGesturesPlugin(),
  ]);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const slides = [
    "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUQatI08Y3MIxDcvU82Y60FplRHeP5CohdAqVs",
    "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUQatI08Y3MIxDcvU82Y60FplRHeP5CohdAqVs",
    "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUQatI08Y3MIxDcvU82Y60FplRHeP5CohdAqVs",
    "https://utfs.io/a/dv6kwxfdfm/X7kJqL6j4LDUQatI08Y3MIxDcvU82Y60FplRHeP5CohdAqVs",
  ];

  const onThumbClick = useCallback(
    (index: any) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    return () => {
      emblaMainApi.off("select", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  useEffect(() => {
    if (!emblaMainApi) return;

    const autoplayInterval = setInterval(() => {
      emblaMainApi.scrollNext();
    }, 6000);

    return () => clearInterval(autoplayInterval);
  }, [emblaMainApi, selectedIndex]);

  return (
    <div className="max-w-full mx-auto">
      {/* Main carousel */}
      <div className="overflow-hidden" ref={emblaMainRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div className="flex-[0_0_100%] min-w-0" key={index}>
              <div className="rounded-2xl border-[1px] border-stroke w-full overflow-hidden mb-6">
                <img
                  className="w-full h-auto"
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  // width={3724}
                  // height={2000}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-2 overflow-hidden" ref={emblaThumbsRef}>
        <div className="flex justify-center gap-4">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={`relative cursor-pointer w-[70px] flex-shrink-0 ${
                index === selectedIndex ? "opacity-100" : "opacity-50"
              }`}
            >
              <div
                className={`rounded-md ${
                  index === selectedIndex
                    ? "border-brand border-2"
                    : "border-border border-[1px]"
                } overflow-hidden h-12`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={slide}
                  alt={`Thumbnail ${index + 1}`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
