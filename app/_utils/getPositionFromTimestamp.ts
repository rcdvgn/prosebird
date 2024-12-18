export default function getPositionFromTimestamp(
  wordsWithTimestamps: any,
  progress: any,
  timestamp: any
) {
  let startLine = 0;
  let startIndex = 0;

  const lastLine = wordsWithTimestamps[wordsWithTimestamps.length - 1];
  const lastWordObject = lastLine ? lastLine[lastLine.length - 1] : null;
  if (lastWordObject && timestamp >= lastWordObject.timestamp) {
    return {
      line: wordsWithTimestamps.length - 1,
      index: lastLine.length - 1,
    };
  }

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

  // console.log(wordsWithTimestamps);

  let i;
  for (i = lineKeys.indexOf(startLine); i < lineKeys.length; i++) {
    if (
      i === lineKeys.length - 1 ||
      timestamp < wordsWithTimestamps[lineKeys[i + 1]][0].timestamp
    ) {
      break;
    }
  }

  const line = lineKeys[i];
  const wordObjects = wordsWithTimestamps[line];
  let j;
  for (j = i === startLine ? startIndex : 0; j < wordObjects.length; j++) {
    // console.log(
    //   "Elapsed time: " +
    //     timestamp +
    //     ". Timestamp on local index " +
    //     j +
    //     ": " +
    //     wordObjects[j].timestamp +
    //     " (" +
    //     wordsWithTimestamps[i][j].word +
    //     ")."
    // );
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
        return { line: line, index: j - 1 };
      }
    } else if (j === wordObjects.length - 1) {
      return { line: line, index: j };
    }
  }
}

// export default function getPositionFromTimestamp(
//   wordsWithTimestamps: any,
//   progress: any,
//   timestamp: any
// ) {
//   if (!progress || !wordsWithTimestamps[progress.line]) {
//     return null;
//   }

//   const line = wordsWithTimestamps[progress.line];
//   const targetWord = line.find((word: any) => word.timestamp >= timestamp);

//   if (targetWord) {
//     return {
//       index: line.indexOf(targetWord),
//       line: progress.line,
//     };
//   }

//   // If the timestamp is after all words in the current line, move to the next line
//   const nextLines = Object.keys(wordsWithTimestamps)
//     .map(Number)
//     .filter(line => line > progress.line);

//   for (const nextLine of nextLines) {
//     const wordsInNextLine = wordsWithTimestamps[nextLine];
//     const firstWordInNextLine = wordsInNextLine[0];

//     if (timestamp >= firstWordInNextLine.timestamp) {
//       return {
//         index: 0,
//         line: nextLine,
//       };
//     }
//   }

//   // If we reach here, the timestamp is after all lines
//   return null;
// }
