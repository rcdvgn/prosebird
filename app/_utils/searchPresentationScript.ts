/**
 * Search through presentation script and return matching chapters and occurrences grouped by chapter
 * @param searchQuery The string to search for
 * @param wordsWithTimestamps Object containing words with timestamps and metadata
 * @param chaptersWithTimestamps Object containing chapter information
 * @returns Object with matching chapters and occurrences grouped by chapter
 */
export function searchPresentationScript(
  searchQuery: string,
  wordsWithTimestamps: any,
  chaptersWithTimestamps: any
) {
  const query = searchQuery.toLowerCase();

  // Results containers
  const matchingChapters: any[] = [];
  const occurrencesByChapter: { [key: string]: any[] } = {};

  // First pass: find all matching chapters by title only
  Object.keys(chaptersWithTimestamps).forEach((chapterKey) => {
    const chapter = chaptersWithTimestamps[chapterKey];
    const title = chapter.title;
    const titleLower = title.toLowerCase();

    if (titleLower.includes(query)) {
      // Find the query position in the title
      const queryIndex = titleLower.indexOf(query);
      const queryLength = query.length;

      // Split the title into before, match, and after parts
      const beforeMatch = title.substring(0, queryIndex);
      const match = title.substring(queryIndex, queryIndex + queryLength);
      const afterMatch = title.substring(queryIndex + queryLength);

      matchingChapters.push({
        chapterIndex: parseInt(chapterKey),
        title,
        beforeMatch,
        match,
        afterMatch,
        timestamp: chapter.timestamp,
        speaker: chapter.speaker,
      });
    }
  });

  // Second pass: find all matching occurrences in the script
  Object.keys(wordsWithTimestamps).forEach((lineKey) => {
    const line = wordsWithTimestamps[lineKey];

    // Build full text for the line with original casing and positions
    const lineText: string[] = [];
    const wordIndices: number[] = [];
    const wordData: any[] = [];

    line.forEach((wordObj: any, idx: number) => {
      lineText.push(wordObj.word);
      wordIndices.push(lineText.join(" ").length - wordObj.word.length);
      wordData.push(wordObj);
    });

    const fullLineText = lineText.join(" ");
    const fullLineTextLower = fullLineText.toLowerCase();

    // Search for query in the full line text
    let startIdx = 0;
    let queryIdx = fullLineTextLower.indexOf(query, startIdx);

    while (queryIdx !== -1) {
      // Find which word object contains the start of the match
      let startWordIdx = -1;
      for (let i = 0; i < wordIndices.length; i++) {
        if (
          wordIndices[i] <= queryIdx &&
          (i === wordIndices.length - 1 || wordIndices[i + 1] > queryIdx)
        ) {
          startWordIdx = i;
          break;
        }
      }

      if (startWordIdx !== -1) {
        const startWord = wordData[startWordIdx];
        const chapterIndex = startWord.chapterIndex;

        // Get the exact match with original casing
        const match = fullLineText.substring(queryIdx, queryIdx + query.length);

        // Build before context (up to 5 words or 30 chars)
        let beforeContext = "";
        let charCountBefore = 0;
        let currentWordIdx = startWordIdx;
        let wordCountBefore = 0;
        let moreBefore = false;

        // Start from the word before the matching word
        while (
          currentWordIdx > 0 &&
          wordCountBefore < 5 &&
          charCountBefore < 30
        ) {
          currentWordIdx--;

          // Ensure we're still in the same chapter
          if (wordData[currentWordIdx].chapterIndex !== chapterIndex) {
            break;
          }

          const prevWord = wordData[currentWordIdx].word;
          const prevWordWithSpace = prevWord + " ";

          if (charCountBefore + prevWordWithSpace.length <= 30) {
            beforeContext = prevWordWithSpace + beforeContext;
            charCountBefore += prevWordWithSpace.length;
            wordCountBefore++;
          } else {
            moreBefore = true;
            break;
          }
        }

        // There's more before if we stopped before reaching the beginning
        moreBefore = moreBefore || currentWordIdx > 0;

        // Build after context (up to 10 words or 60 chars)
        let afterContext = "";
        let charCountAfter = 0;
        let wordCountAfter = 0;
        let moreAfter = false;

        // Find the last word that contains part of the query
        let endWordIdx = startWordIdx;
        const queryEnd = queryIdx + query.length;

        while (
          endWordIdx < wordIndices.length - 1 &&
          wordIndices[endWordIdx + 1] < queryEnd
        ) {
          endWordIdx++;
        }

        // Start from the word after the last word of the match
        currentWordIdx = endWordIdx;

        while (
          currentWordIdx < wordData.length - 1 &&
          wordCountAfter < 10 &&
          charCountAfter < 60
        ) {
          currentWordIdx++;

          // Ensure we're still in the same chapter
          if (wordData[currentWordIdx].chapterIndex !== chapterIndex) {
            break;
          }

          const nextWord = wordData[currentWordIdx].word;
          const nextWordWithSpace = " " + nextWord;

          if (charCountAfter + nextWordWithSpace.length <= 60) {
            afterContext += nextWordWithSpace;
            charCountAfter += nextWordWithSpace.length;
            wordCountAfter++;
          } else {
            moreAfter = true;
            break;
          }
        }

        // There's more after if we haven't reached the end
        moreAfter = moreAfter || currentWordIdx < wordData.length - 1;

        // Create the occurrence object
        const occurrence = {
          beforeContext: beforeContext.trim(),
          match,
          afterContext: afterContext.trim(),
          timestamp: startWord.timestamp,
          moreBefore,
          moreAfter,
        };

        // Add to results, grouped by chapter
        const chapterKey = String(chapterIndex);
        if (!occurrencesByChapter[chapterKey]) {
          occurrencesByChapter[chapterKey] = [
            {
              chapterIndex,
              chapterTitle: startWord.chapterTitle,
              occurrences: [occurrence],
            },
          ];
        } else {
          // Chapter already exists, add to its occurrences
          occurrencesByChapter[chapterKey][0].occurrences.push(occurrence);
        }
      }

      // Look for next occurrence
      startIdx = queryIdx + 1;
      queryIdx = fullLineTextLower.indexOf(query, startIdx);
    }
  });

  // Convert chapter occurrences from object to array and sort by timestamp
  const occurrences = Object.values(occurrencesByChapter).flat();

  // Sort chapters and chapter occurrences by timestamp
  matchingChapters.sort((a, b) => a.timestamp - b.timestamp);
  occurrences.forEach((chapter) => {
    chapter.occurrences.sort((a: any, b: any) => a.timestamp - b.timestamp);
  });
  occurrences.sort((a, b) => a.timestamp - b.timestamp);

  return {
    chapters: matchingChapters,
    occurrences,
  };
}
