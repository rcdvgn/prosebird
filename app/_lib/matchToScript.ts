type ScriptNode = {
  paragraph: { [key: number]: string };
  [key: string]: any;
};

const normalizeWord = (word: string): string => {
  return word
    .replace(/[-—]/g, " ")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase();
};

const checkMatch = (lastSpokenWords: any, expectedWordsWindow: any): any => {
  // console.log(lastSpokenWords, expectedWordsWindow);
  const normalizedSpokenWords = lastSpokenWords.map((word: any) =>
    normalizeWord(word)
  );

  for (let j = 0; j < expectedWordsWindow.length; j++) {
    const { word: normalizedExpectedWord, position } = expectedWordsWindow[j];

    const numOfNormalizedExpectedWords =
      normalizedExpectedWord.split(" ").length;

    const normalizedSpokenWord = normalizedSpokenWords
      .slice(normalizedSpokenWords.length - numOfNormalizedExpectedWords)
      .join(" ");

    // console.log("Spoken word: " + normalizedSpokenWord);
    // console.log("Expected word: " + normalizedExpectedWord);

    if (normalizedSpokenWord === normalizedExpectedWord) {
      // console.log("Match! " + position);
      return position;
    }
    // console.log("No match");
  }

  return undefined;
};

export default function matchToScript(
  currentPosition: number,
  words: any,
  lastSpokenWords: string
): any {
  let newCurrentPosition = currentPosition;
  let matched = false;

  if (newCurrentPosition < words.length) {
    const expectedWordsWindow = words
      .slice(newCurrentPosition, newCurrentPosition + 3)
      .map((wordObject: any, index: any) => ({
        word: normalizeWord(wordObject.word),
        position: index,
      }));

    const matchIndex = checkMatch(lastSpokenWords, expectedWordsWindow);
    if (matchIndex !== undefined) {
      newCurrentPosition += matchIndex;
      matched = true;
    }
  }

  return matched ? words[newCurrentPosition + 1].index : currentPosition;
}
