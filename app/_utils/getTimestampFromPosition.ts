export default function getTimestampFromPosition(
  wordsWithTimestamps: any,
  position: any
) {
  let testIndex = position;

  for (const line of Object.values(wordsWithTimestamps) as any) {
    if (line.length > testIndex) {
      return line[testIndex].timestamp;
    } else {
      testIndex -= line.length;
    }
  }

  return null;
}
