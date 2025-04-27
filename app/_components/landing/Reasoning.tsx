"use client";
import { motion, useTransform, useMotionValue } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import {
  Palette,
  FastForward,
  Eye,
  Rabbit,
  Lightbulb,
  Wand,
  DraftingCompass,
  WandSparkles,
  Atom,
} from "lucide-react";
import InViewAnimation from "./InViewAnimation";

export default function Reasoning({ scrollContainerRef }: any) {
  const [progress, setProgress] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Create a motion value from the progress state
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    scrollProgress.set(progress);
  }, [progress]);

  const ps = [
    // "A solution should allow presenters to focus on creating instead of rehearsing. All arrows pointed to teleprompting.",
    "As if the words could simply appear before your eyes—like magic, or better yet, a teleprompter.",
    "But traditional telemprompters just don't cut it in dynamic, fast-paced environments.",
    "So we reinvented it.",
  ];

  const specialWords: any = {
    // creating: {
    //   icon: <Palette size={25} strokeWidth={2.5} />,
    //   color: "!text-green-500",
    // },
    magic: {
      icon: <WandSparkles size={25} strokeWidth={2.5} />,
      color: "!text-purple-500",
    },
    teleprompter: {
      icon: <Lightbulb size={25} strokeWidth={2.5} />,
      color: "!text-yellow-400",
    },
    dynamic: {
      icon: <Atom size={25} strokeWidth={2.5} />,
      color: "!text-green-500",
    },
    "fast-paced": {
      icon: <Rabbit size={25} strokeWidth={2.5} />,
      color: "!text-pink-500",
    },
    "reinvented it": {
      icon: <DraftingCompass size={25} strokeWidth={2.5} />,
      color: "!text-blue-500",
    },
  };

  const allWords = ps.join(" ").split(" ");

  useEffect(() => {
    if (!scrollContainerRef?.current || !sectionRef.current) return;

    const container = scrollContainerRef.current;
    const section = sectionRef.current;

    const calculateProgress = () => {
      const sectionRect = section.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const sectionTop = sectionRect.top - containerRect.top;
      const sectionHeight = sectionRect.height;
      const viewportHeight = container.clientHeight;

      const totalDistance = sectionHeight - viewportHeight;

      const scrolledDistance = -sectionTop;

      const progressValue = Math.max(
        0,
        Math.min(1, scrolledDistance / totalDistance)
      );

      setProgress(Math.round(progressValue * 100) / 100);
    };

    calculateProgress();

    const handleScroll = () => {
      calculateProgress();
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef]);

  return (
    <div
      ref={sectionRef}
      className="relative bg-middleground w-full h-[500vh] flex justify-center items-start sm:px-12"
    >
      <div className="sticky top-0 w-full max-w-[1080px] px-6 h-screen grid place-items-center">
        <InViewAnimation className="text-left">
          {ps.map((p, pIndex) => {
            // Process for multi-word special phrases
            let processedParagraph = p;
            let specialPhraseIndices: any = [];

            // Find all special phrases in this paragraph
            Object.keys(specialWords).forEach((phrase) => {
              const phraseRegex = new RegExp(phrase, "gi");
              let match;

              while ((match = phraseRegex.exec(p)) !== null) {
                specialPhraseIndices.push({
                  start: match.index,
                  end: match.index + phrase.length,
                  phrase: phrase,
                  data: specialWords[phrase],
                });
              }
            });

            // Sort by starting position to handle overlaps correctly
            specialPhraseIndices.sort((a: any, b: any) => a.start - b.start);

            // Convert paragraph to words while tracking special phrases
            const paragraphWords = p.split(" ");

            // Find where this paragraph starts in the overall word sequence
            const startWordIndex =
              pIndex === 0
                ? 0
                : ps.slice(0, pIndex).join(" ").split(" ").length;

            return (
              <p
                key={pIndex}
                className="w-full md:w-[680px] my-6 sm:my-10 text-2xl sm:text-3xl leading-[40px] sm:leading-[48px]"
              >
                {(() => {
                  // Track processed words to handle multi-word special phrases
                  let wordIndex = 0;
                  let result = [];
                  let skipWords = 0;

                  while (wordIndex < paragraphWords.length) {
                    if (skipWords > 0) {
                      skipWords--;
                      wordIndex++;
                      continue;
                    }

                    // Check if current position starts a special phrase
                    const currentPos =
                      paragraphWords.slice(0, wordIndex).join(" ").length +
                      (wordIndex > 0 ? 1 : 0);
                    const matchingPhrase = specialPhraseIndices.find(
                      (item: any) =>
                        item.start <= currentPos && currentPos < item.end
                    );

                    if (matchingPhrase) {
                      // Calculate how many words this phrase contains
                      const phraseWords = matchingPhrase.phrase.split(" ");
                      skipWords = phraseWords.length - 1;

                      // Get the complete multi-word phrase
                      const completePhrase = paragraphWords
                        .slice(wordIndex, wordIndex + phraseWords.length)
                        .join(" ");

                      // Calculate progress range
                      const globalWordIndex = startWordIndex + wordIndex;
                      const start = globalWordIndex / allWords.length;
                      const end =
                        (globalWordIndex + phraseWords.length) /
                        allWords.length;

                      result.push(
                        <React.Fragment key={wordIndex}>
                          {wordIndex > 0 ? " " : ""}
                          <IconWordPair
                            word={completePhrase}
                            icon={matchingPhrase.data.icon}
                            color={matchingPhrase.data.color}
                            range={[start, end]}
                            progress={scrollProgress}
                          />
                        </React.Fragment>
                      );

                      wordIndex += phraseWords.length;
                    } else {
                      // Regular word
                      const globalWordIndex = startWordIndex + wordIndex;
                      const start = globalWordIndex / allWords.length;
                      const end = (globalWordIndex + 1) / allWords.length;

                      // Check if next word starts a special phrase
                      const nextWordPos =
                        paragraphWords.slice(0, wordIndex + 1).join(" ")
                          .length + 1;

                      result.push(
                        <React.Fragment key={wordIndex}>
                          {wordIndex > 0 ? " " : ""}
                          <Word range={[start, end]} progress={scrollProgress}>
                            {paragraphWords[wordIndex]}
                          </Word>
                        </React.Fragment>
                      );

                      wordIndex++;
                    }
                  }

                  return result;
                })()}
              </p>
            );
          })}
        </InViewAnimation>
      </div>
    </div>
  );
}

const Word = ({ children, range, progress }: any) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span
      className="relative inline-block text-primary font-extrabold text-2xl sm:text-3xl leading-[40px] sm:leading-[48px]
 whitespace-pre"
    >
      <span className="opacity-20 pointer-events-none">{children}</span>
      <motion.span className="absolute top-0 left-0" style={{ opacity }}>
        {children}
      </motion.span>

      {/* {isNextSpecialWord ? " " : ""} */}
    </span>
  );
};

const IconWordPair = ({ word, icon, color, range, progress }: any) => {
  const opacity = useTransform(progress, range, [0, 1]);

  const responsiveIcon = React.cloneElement(icon, {
    className: "hidden sm:inline-block",
    size: "1em",
  });

  // Smaller icon for mobile
  const mobileIcon = React.cloneElement(icon, {
    className: "sm:hidden inline-block",
    size: 20,
    strokeWidth: 2.5,
  });

  return (
    <span
      className={`relative inline-flex items-center text-primary font-extrabold text-2xl sm:text-3xl leading-[40px] sm:leading-[48px]
 ${color}`}
    >
      <span className="opacity-20 inline-flex items-center gap-1 pointer-events-none">
        <span className="-translate-y-[2px] ml-0.5 sm:ml-1">
          {mobileIcon}
          {responsiveIcon}
        </span>

        {word}
      </span>
      <motion.span
        className="absolute top-0 left-0 inline-flex items-center gap-1"
        style={{ opacity }}
      >
        <span className="-translate-y-[2px] ml-0.5 sm:ml-1">
          {mobileIcon}
          {responsiveIcon}
        </span>

        {word}
      </motion.span>
    </span>
  );
};
