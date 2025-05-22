export function generateTimestamps(words: any, chapters: any, wpm: any) {
  const baseTime = 500;
  const totalDuration = 500 * words.length;

  const flatWords = words.map((w: any, i: any) => ({
    ...w,
    timestamp: i * baseTime,
  }));

  const chapterArray = Object.entries(chapters)
    .map(([startPosition, chapterData]: any) => ({
      startPosition: Number(startPosition),
      ...chapterData,
    }))
    .sort((a, b) => a.startPosition - b.startPosition);

  const chaptersWithTimestamps = chapterArray.map((c: any, idx: any) => ({
    chapterIndex: idx,
    title: c.title,
    timestamp: flatWords[c.startPosition]?.timestamp ?? 0,
    startPosition: c.startPosition,
    speaker: c.speaker,
  }));

  return { flatWords, chaptersWithTimestamps, totalDuration };
}

const words = [
  {
    chapterIndex: 0,
    chapterTitle: "What Is a Parabola?",
    position: 0,
    word: "A",
  },
  {
    chapterIndex: 0,
    chapterTitle: "What Is a Parabola?",
    position: 1,
    word: "parabola",
  },
  {
    chapterIndex: 0,
    chapterTitle: "What Is a Parabola?",
    position: 2,
    word: "is",
  },
];

const chapters = {
  "0": {
    speaker: {
      id: "oXk2R62ek7Y0k8fcsQ4B1wjMdyT2",
      isGuest: false,
    },
    title: "What Is a Parabola?",
  },
  "61": {
    speaker: {
      id: "oXk2R62ek7Y0k8fcsQ4B1wjMdyT2",
      isGuest: false,
    },
    title: "Parabolas in Physics​What Is a Parabola?",
  },
  "114": {
    speaker: {
      id: "oXk2R62ek7Y0k8fcsQ4B1wjMdyT2",
      isGuest: false,
    },
    title: "Parabolas in Engineering",
  },
  "158": {
    speaker: {
      id: "oXk2R62ek7Y0k8fcsQ4B1wjMdyT2",
      isGuest: false,
    },
    title: "Why It Matters",
  },
};

// const baseTime = 60_000 / wpm / speedMultiplier;
//   const flatWords: WordTimestamp[] = words.map((w, i) => ({
//     ...w,
//     timestamp: i * baseTime,
//   }));
//   const totalDuration = flatWords.length * baseTime;

//   // Convert chapters object to sorted array of {startPosition, ...data}
//   const chapterArray = Object.entries(chapters)
//     .map(([startPosition, chapterData]) => ({
//       startPosition: Number(startPosition),
//       ...chapterData,
//     }))
//     .sort((a, b) => a.startPosition - b.startPosition);

//   // Now you can .map chapterArray!
//   const chaptersWithTimestamps: ChapterTimestamp[] = chapterArray.map(
//     (c, idx) => ({
//       chapterIndex: idx,
//       title: c.title,
//       timestamp: flatWords[c.startPosition]?.timestamp ?? 0,
//       startPosition: c.startPosition,
//       speaker: c.speaker,
//     })
//   );
