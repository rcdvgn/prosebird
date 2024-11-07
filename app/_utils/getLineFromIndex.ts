export default function getLineFromIndex(
  wordsWithTimestamps: any,
  position: any
) {
  let testIndex = position;

  for (const [key, line] of Object.entries(wordsWithTimestamps) as any) {
    if (line.length > testIndex) {
      return key;
    } else {
      testIndex -= line.length;
    }
  }

  return null;
}
