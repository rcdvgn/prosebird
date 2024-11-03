type ScriptNode = {
  paragraph: { [key: number]: string };
  [key: string]: any;
};

// Normalizes a word to remove punctuation and make it lowercase.
const normalizeWord = (word: string): string => {
  return word
    .replace(/[-—]/g, " ")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase();
};

// Formats the script nodes to give each word a unique index.
// function formatScript(nodes: ScriptNode[]): ScriptNode[] {
//   let counter = -1;

//   return nodes.map((node) => {
//     const paragraph = Object.fromEntries(
//       Object.entries(node.paragraph).map(([key, word]) => {
//         counter++;
//         return [counter, word];
//       })
//     );
//     return { ...node, paragraph };
//   });
// }

// Checks for matches between the last spoken words and expected words in the script.
function checkMatch(
  lastSpokenWords: string[],
  expectedWordsWindow: { word: string; currentPosition: number }[]
): number | undefined {
  const normalizedSpokenWords = lastSpokenWords.map(normalizeWord);

  for (let j = 0; j < expectedWordsWindow.length; j++) {
    const { word: normalizedExpectedWord, currentPosition } =
      expectedWordsWindow[j];
    const numOfExpectedWords = normalizedExpectedWord.split(" ").length;

    const spokenSegment = normalizedSpokenWords
      .slice(normalizedSpokenWords.length - numOfExpectedWords)
      .join(" ");

    if (spokenSegment === normalizedExpectedWord) {
      return currentPosition;
    }
  }

  return undefined;
}

// Main function to match transcript to script and return the new currentPosition.
export default function matchToScript(
  currentPosition: number,
  nodes: ScriptNode[],
  transcript: string
): number {
  //   const processedScript = formatScript(nodes);
  const spokenWords = transcript.split(" ");
  let newcurrentPosition = currentPosition;
  let matched = false;

  const lastSpokenWords = spokenWords.slice(-3);

  if (newcurrentPosition < Object.keys(nodes).length) {
    const expectedWordsWindow = Object.entries(nodes)
      .slice(newcurrentPosition, newcurrentPosition + 3)
      .map(([index, word]: any) => ({
        word: normalizeWord(word),
        currentPosition: parseInt(index),
      }));

    const matchIndex = checkMatch(lastSpokenWords, expectedWordsWindow);

    if (matchIndex !== undefined) {
      newcurrentPosition += matchIndex;
      matched = true;
    }
  }

  return matched ? newcurrentPosition + 1 : currentPosition;
}
