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

function formatScript(nodes: any) {
  return nodes.reduce((acc: any, node: any) => {
    Object.assign(acc, node.paragraph);
    return acc;
  }, {});
}

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

    console.log("Spoken word: " + normalizedSpokenWord);
    console.log("Expected word: " + normalizedExpectedWord);

    if (normalizedSpokenWord === normalizedExpectedWord) {
      console.log("Match! " + position);
      return position;
    }
    console.log("No match");
  }

  return undefined;
};

export default function matchToScript(
  currentPosition: number,
  nodes: ScriptNode[],
  transcript: string
): number {
  const fullScript = formatScript(nodes);
  const spokenWords = transcript.split(" ");
  let newcurrentPosition = currentPosition;
  let matched = false;

  const lastSpokenWords = spokenWords.slice(-3);

  if (newcurrentPosition < Object.keys(fullScript).length) {
    const expectedWordsWindow = Object.keys(fullScript)
      .slice(newcurrentPosition, newcurrentPosition + 3)
      .map((key, index: any) => ({
        word: normalizeWord(fullScript[key]),
        position: parseInt(index, 10),
      }));

    const matchIndex = checkMatch(lastSpokenWords, expectedWordsWindow);
    if (matchIndex !== undefined) {
      newcurrentPosition += matchIndex;
      matched = true;
    }
  }

  return matched ? newcurrentPosition + 1 : currentPosition;
}
