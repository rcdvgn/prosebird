export function searchPresentationScript(
  searchQuery: string,
  wordsWithTimestamps: any,
  chaptersWithTimestamps: any
) {
  const query = searchQuery.toLowerCase();
  const matchingChapters: any[] = [];
  const occurrencesByChapter: { [key: string]: any[] } = {};

  // First pass: chapter title matches
  Object.keys(chaptersWithTimestamps).forEach((chapterKey) => {
    const chapter = chaptersWithTimestamps[chapterKey];
    const titleLower = chapter.title.toLowerCase();
    if (titleLower.includes(query)) {
      const queryIndex = titleLower.indexOf(query);
      matchingChapters.push({
        chapterIndex: parseInt(chapterKey),
        title: chapter.title,
        beforeMatch: chapter.title.substring(0, queryIndex),
        match: chapter.title.substring(queryIndex, queryIndex + query.length),
        afterMatch: chapter.title.substring(queryIndex + query.length),
        timestamp: chapter.timestamp,
        speaker: chapter.speaker,
      });
    }
  });

  // Second pass: word matches
  const allWords: any[] = [];
  Object.keys(wordsWithTimestamps).forEach((lineKey) => {
    wordsWithTimestamps[lineKey].forEach((wordObj: any) =>
      allWords.push(wordObj)
    );
  });
  allWords.sort((a, b) => a.position - b.position);

  const wordsByChapter: { [key: number]: any[] } = {};
  allWords.forEach((word) => {
    wordsByChapter[word.chapterIndex] = wordsByChapter[word.chapterIndex] || [];
    wordsByChapter[word.chapterIndex].push(word);
  });

  const positionToIndexByChapter: { [key: number]: { [key: number]: number } } =
    {};
  Object.keys(wordsByChapter).forEach((chapterIdx) => {
    const chapter = parseInt(chapterIdx);
    positionToIndexByChapter[chapter] = {};
    wordsByChapter[chapter].forEach((word, idx) => {
      positionToIndexByChapter[chapter][word.position] = idx;
    });
  });

  Object.keys(wordsWithTimestamps).forEach((lineKey) => {
    const line = wordsWithTimestamps[lineKey];
    const lineText: string[] = [];
    const wordPositions: number[] = [];
    const wordStartIndices: number[] = [];
    let currentPosition = 0;

    line.forEach((wordObj: any, idx: number) => {
      lineText.push(wordObj.word);
      wordPositions.push(wordObj.position);
      wordStartIndices.push(currentPosition);
      currentPosition += wordObj.word.length + (idx < line.length - 1 ? 1 : 0);
    });

    const fullLineText = lineText.join(" ");
    const fullLineTextLower = fullLineText.toLowerCase();
    let queryIdx = fullLineTextLower.indexOf(query);

    while (queryIdx !== -1) {
      let matchStartPos = -1;
      let matchWordStartIdx = 0;

      for (let i = 0; i < lineText.length; i++) {
        const wordEndIdx = wordStartIndices[i] + lineText[i].length;
        if (queryIdx >= wordStartIndices[i] && queryIdx < wordEndIdx) {
          matchStartPos = wordPositions[i];
          matchWordStartIdx = wordStartIndices[i];
          break;
        }
      }

      if (matchStartPos !== -1) {
        const matchWordObj = allWords.find(
          (w: any) => w.position === matchStartPos
        );
        if (matchWordObj) {
          const chapterIndex = matchWordObj.chapterIndex;
          const chapterWords = wordsByChapter[chapterIndex];
          const matchWordIndexInChapter =
            positionToIndexByChapter[chapterIndex][matchStartPos];
          const match = fullLineText.substring(
            queryIdx,
            queryIdx + query.length
          );

          // Before context logic
          let beforeContext = "";
          let charCount = 0;
          let moreBefore = false;
          let currentIdx = matchWordIndexInChapter;
          const matchStartsAt = queryIdx - matchWordStartIdx;

          // Check if the query starts at a word boundary with a space before it
          const isAtWordBoundary = matchStartsAt === 0 && queryIdx > 0;

          if (isAtWordBoundary) {
            // Add space before the match if it exists
            beforeContext = " ";
            charCount = 1;
          } else if (matchStartsAt > 0) {
            // Add partial word before the match
            beforeContext = chapterWords[currentIdx].word.substring(
              0,
              matchStartsAt
            );
            charCount = beforeContext.length;
          }

          // Add words before the match
          let wordsBefore = 0;
          let tempCurrentIdx = currentIdx;
          if (matchStartsAt > 0 || isAtWordBoundary) {
            // If we've already used part of a word, don't count it again
            tempCurrentIdx--;
          }

          while (tempCurrentIdx >= 0 && wordsBefore < 5 && charCount < 30) {
            const prevWord = chapterWords[tempCurrentIdx].word;

            // Check if adding this word would exceed character limit
            const withSpace = beforeContext.length > 0 ? " " : "";
            const newContentLength = prevWord.length + withSpace.length;

            if (charCount + newContentLength <= 30) {
              if (beforeContext.length > 0) {
                beforeContext = prevWord + " " + beforeContext;
              } else {
                beforeContext = prevWord;
              }
              charCount += newContentLength;
              wordsBefore++;
              tempCurrentIdx--;
            } else {
              moreBefore = true;
              break;
            }
          }

          moreBefore = moreBefore || tempCurrentIdx >= 0;

          // After context logic
          let afterContext = "";
          charCount = 0;
          let moreAfter = false;
          const queryEndIdx = queryIdx + query.length;
          let matchEndWordPos = -1;
          let endWordStartIdx = 0;

          for (let i = 0; i < lineText.length; i++) {
            const wordEndIdx = wordStartIndices[i] + lineText[i].length;
            if (
              queryEndIdx > wordStartIndices[i] &&
              queryEndIdx <= wordEndIdx
            ) {
              matchEndWordPos = wordPositions[i];
              endWordStartIdx = wordStartIndices[i];
              break;
            }
          }

          if (matchEndWordPos !== -1) {
            currentIdx =
              positionToIndexByChapter[chapterIndex][matchEndWordPos];
            const endWord = chapterWords[currentIdx].word;
            const matchEndsAt = queryEndIdx - endWordStartIdx;

            // Check if the query ends at a word boundary
            const isEndWordBoundary = matchEndsAt === endWord.length;

            if (isEndWordBoundary) {
              // Add space after the match
              afterContext = " ";
              charCount = 1;
            } else if (matchEndsAt < endWord.length) {
              // Add partial word after the match
              afterContext = endWord.substring(matchEndsAt);
              charCount = afterContext.length;
            }

            // Add words after the match
            let wordsAfter = 0;
            let tempCurrentIdx = currentIdx;

            if (matchEndsAt < endWord.length && !isEndWordBoundary) {
              // If we've already used part of a word, don't count it again
              tempCurrentIdx++;
            } else if (isEndWordBoundary) {
              // If the match ends at a word boundary, move to the next word
              tempCurrentIdx++;
            }

            while (
              tempCurrentIdx < chapterWords.length &&
              wordsAfter < 10 &&
              charCount < 60
            ) {
              const nextWord = chapterWords[tempCurrentIdx].word;

              // Check if adding this word would exceed character limit
              const withSpace = afterContext.length > 0 ? " " : "";
              const newContentLength = nextWord.length + withSpace.length;

              if (charCount + newContentLength <= 60) {
                if (afterContext.length > 0) {
                  afterContext = afterContext + " " + nextWord;
                } else {
                  afterContext = nextWord;
                }
                charCount += newContentLength;
                wordsAfter++;
                tempCurrentIdx++;
              } else {
                moreAfter = true;
                break;
              }
            }

            moreAfter = moreAfter || tempCurrentIdx < chapterWords.length;
          }

          // Add to results
          const occurrence = {
            beforeContext,
            match,
            afterContext,
            timestamp: matchWordObj.timestamp,
            moreBefore,
            moreAfter,
          };

          const chapterKey = String(chapterIndex);
          if (!occurrencesByChapter[chapterKey]) {
            occurrencesByChapter[chapterKey] = [
              {
                chapterIndex,
                chapterTitle: matchWordObj.chapterTitle,
                occurrences: [occurrence],
              },
            ];
          } else {
            occurrencesByChapter[chapterKey][0].occurrences.push(occurrence);
          }
        }
      }

      queryIdx = fullLineTextLower.indexOf(query, queryIdx + 1);
    }
  });

  // Post-processing
  const occurrences = Object.values(occurrencesByChapter).flat();
  matchingChapters.sort((a, b) => a.timestamp - b.timestamp);
  occurrences.forEach((chapter) =>
    chapter.occurrences.sort((a: any, b: any) => a.timestamp - b.timestamp)
  );
  occurrences.sort((a, b) => a.chapterIndex - b.chapterIndex);

  return {
    chapters: matchingChapters,
    occurrences,
  };
}

// const obj = [
//   {
//     "chapterIndex": 0,
//     "chapterTitle": "Introduction to AI in Quantitative Computing",
//     "occurrences": [
//       {
//         "beforeContext": "has led to breakthroughs",
//         "match": "in",
//         "afterContext": " both efficiency and accuracy.",
//         "correct": false,
//         "correctBeforeContext": "has led to breakthroughs ",
//         "correctMatch": "in",
//         "correctAfterContext": " both efficiency and accuracy.",
//     },
//     {
//       "beforeContext": "the key advantages of AI",
//       "match": "in",
//       "afterContext": " quantitative computing is its capacity for optimization. ",
//       "correct": false,
//       "correctBeforeContext": "the key advantages of AI ",
//       "correctMatch": "in",
//       "correctAfterContext": " quantitative computing is its capacity for optimization. ",
//   }
//     ]
//   },
// ]
