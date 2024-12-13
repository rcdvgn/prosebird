export default function getPositionFromTimestamp(
  wordsWithTimestamps: any,
  progress: any,
  timestamp: any
) {
  let startLine = 0;
  let startIndex = 0;

  if (
    progress &&
    wordsWithTimestamps[progress.line]?.[progress.index]?.timestamp <= timestamp
  ) {
    startLine = progress.line;
    startIndex = progress.index;
  }

  const lineKeys = Object.keys(wordsWithTimestamps)
    .map(Number)
    .sort((a, b) => a - b);

  let i;
  for (i = lineKeys.indexOf(startLine); i < lineKeys.length; i++) {
    if (
      i + 1 < lineKeys.length &&
      timestamp < wordsWithTimestamps[lineKeys[i + 1]][0].timestamp
    ) {
      break;
    }
  }

  const line = lineKeys[i];
  const wordObjects = wordsWithTimestamps[line];

  for (let j = startIndex; j < wordObjects.length; j++) {
    if (wordObjects[j].timestamp > timestamp) {
      if (j === 0) {
        if (i === 0) {
          return null;
        } else {
          return {
            index: wordsWithTimestamps[lineKeys[i - 1]].length - 1,
            line: lineKeys[i - 1],
          };
        }
      } else {
        return { index: j - 1, line: line };
      }
    }
  }

  const lastLine = lineKeys.at(-1);
  return lastLine !== undefined
    ? wordsWithTimestamps[lastLine].at(-1) || null
    : null;
}
