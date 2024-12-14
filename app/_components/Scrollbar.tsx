import React, { useState, useEffect, useRef } from "react";
// import { useAutoscroll } from "@/app/_contexts/AutoScrollContext";
import { usePresentation } from "../_contexts/PresentationContext";

export default function Scrollbar({
  calculateScrollbarHeight,
  scrollContainer,
  scriptContainer,
  scrollbarHeight,
}: {
  calculateScrollbarHeight: any;
  scrollContainer: React.RefObject<HTMLDivElement>;
  scriptContainer: React.RefObject<HTMLDivElement>;
  scrollbarHeight: any;
}) {
  // const { isAutoscrollOn, setIsAutoscrollOn } = useAutoscroll();
  const { elapsedTime, totalDuration, isAutoscrollOn, setIsAutoscrollOn } =
    usePresentation();

  const scrollThumb = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Recalculate scrollbar height on window resize
    window.addEventListener("resize", calculateScrollbarHeight);

    const moveScrollThumb = (newThumbTop: number) => {
      if (
        !scrollThumb.current ||
        !scriptContainer.current ||
        !scrollContainer.current
      )
        return;

      const scrollContainerHeight = scrollContainer.current.clientHeight;
      const scriptContainerHeight = scriptContainer.current.scrollHeight;

      // Constrain the thumb position within the scroll track
      newThumbTop = Math.max(
        0,
        Math.min(
          newThumbTop,
          scrollContainerHeight - scrollThumb.current!.offsetHeight
        )
      );

      // Calculate the corresponding top value for scriptContainer
      const scrollRatio =
        newThumbTop /
        (scrollContainerHeight - scrollThumb.current!.offsetHeight);
      const newScriptTop = -scrollRatio * scriptContainerHeight;

      // Update the scrollThumb and scriptContainer positions
      scrollThumb.current!.style.top = `${newThumbTop}px`;
      scriptContainer.current!.style.top = `${newScriptTop}px`;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (
        !scrollThumb.current ||
        !scrollContainer.current ||
        !scriptContainer.current
      )
        return;

      isAutoscrollOn ? setIsAutoscrollOn(!isAutoscrollOn) : "";

      const initialMouseY = e.clientY;
      const initialThumbTop =
        scrollThumb.current.getBoundingClientRect().top -
        scrollContainer.current.getBoundingClientRect().top;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = moveEvent.clientY - initialMouseY;
        const newThumbTop = initialThumbTop + deltaY;
        moveScrollThumb(newThumbTop);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        !scrollThumb.current ||
        !scrollContainer.current ||
        !scriptContainer.current
      )
        return;

      isAutoscrollOn ? setIsAutoscrollOn(!isAutoscrollOn) : "";

      const scrollSensitivity = 0.1; // Adjust this value to control the sensitivity of the scroll
      const delta = event.deltaY * scrollSensitivity;
      const currentThumbTop = parseFloat(scrollThumb.current.style.top) || 0;
      const newThumbTop = currentThumbTop + delta;
      moveScrollThumb(newThumbTop);
    };

    if (scrollThumb.current) {
      scrollThumb.current.addEventListener("mousedown", handleMouseDown);
    }

    if (scrollContainer.current) {
      scrollContainer.current.addEventListener("wheel", handleWheel);
    }

    return () => {
      window.removeEventListener("resize", calculateScrollbarHeight);
      if (scrollThumb.current) {
        scrollThumb.current.removeEventListener("mousedown", handleMouseDown);
      }
      if (scrollContainer.current) {
        scrollContainer.current.removeEventListener("wheel", handleWheel);
      }
    };
  }, [
    calculateScrollbarHeight,
    scrollContainer,
    scriptContainer,
    isAutoscrollOn,
  ]);

  useEffect(() => {
    if (isAutoscrollOn) {
      const scrollContainerHeight = scrollContainer.current?.clientHeight || 0;
      const scriptContainerHeight = scriptContainer.current?.scrollHeight || 0;

      const scrollRatio = elapsedTime / totalDuration;
      const newThumbTop =
        scrollRatio *
        (scrollContainerHeight - scrollThumb.current!.offsetHeight);
      const newScriptTop =
        -scrollRatio * (scriptContainerHeight - scrollContainerHeight);

      // Update the scrollThumb and scriptContainer positions
      if (scrollThumb.current) {
        scrollThumb.current.style.top = `${newThumbTop}px`;
      }
      // if (scriptContainer.current) {
      //   scriptContainer.current.style.top = `${newScriptTop}px`;
      // }
    }
  }, [elapsedTime, totalDuration, isAutoscrollOn]);

  return (
    <div className="absolute h-full top-0 right-0 m-auto">
      <div className="h-full w-2 relative">
        <div
          ref={scrollThumb}
          style={{
            height: `${scrollbarHeight}px`,
          }}
          className="w-full absolute right-0 m-auto bg-foreground-primary rounded-full border-[1px] border-border"
        ></div>
      </div>
    </div>
  );
}
