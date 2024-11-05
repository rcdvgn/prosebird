async function loadFontAndContext(): Promise<CanvasRenderingContext2D> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to get 2D context for canvas");
  }

  const font = new FontFace(
    "Public-Sans",
    "url(/fonts/Public_Sans/PublicSans.ttf)"
  );
  await font.load();
  document.fonts.add(font);
  context.font = "36px Public-Sans"; // Adjust the size as needed

  return context;
}

function calculateLineBreaks(
  context: any,
  words: any,
  chapters: any,
  containerWidth: any
) {
  let currentLine: any = [];
  let lines: any = [];
  let chapterKeys = new Set(Object.keys(chapters)); // Use a Set for faster lookup

  words.forEach((wordObject: any) => {
    const testLine =
      currentLine.map((item: any) => item.word).join(" ") +
      (currentLine.length > 0 ? " " : "") +
      wordObject.word;
    const testWidth = context.measureText(testLine).width;

    // Check if the word's key is a chapter start
    if (chapterKeys.has(wordObject.index)) {
      if (currentLine.length > 0) {
        lines.push(currentLine); // Push the existing line if it's not empty
      }
      currentLine = [wordObject]; // Start a new line with the chapter's first word
    } else if (testWidth > containerWidth) {
      lines.push(currentLine); // Push the current line if it exceeds width
      currentLine = [wordObject]; // Start a new line with the word
    } else {
      currentLine.push(wordObject); // Add the word to the current line
    }
  });

  // Push the final line if it's not empty
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
}

function calculateTotalDuration(
  numberOfLines: any,
  speedMultiplier: any,
  baseSpeed: any
) {
  return numberOfLines * speedMultiplier * baseSpeed;
}

function calculateWordTimestamps(lines: any, totalDuration: any) {
  const durationPerLine = totalDuration / lines.length;
  const scriptWithTimestamps: any = {};

  lines.forEach((line: any, lineIndex: any) => {
    // const lineWords = line.split(" ");
    const wordsWithTimestamps = line.map((wordObject: any, wordIndex: any) => {
      const timestamp =
        lineIndex * durationPerLine +
        durationPerLine * (wordIndex / line.length);
      return { ...wordObject, timestamp };
    });

    scriptWithTimestamps[lineIndex] = wordsWithTimestamps;
  });

  return scriptWithTimestamps;
}

export default async function calculateTimestamps(
  words: any,
  chapters: any,
  containerWidth: any,
  speedMultiplier: any
) {
  const baseSpeed = 1500;

  const context = await loadFontAndContext();

  const lines = calculateLineBreaks(context, words, chapters, containerWidth);

  const totalDuration = calculateTotalDuration(
    lines.length,
    speedMultiplier,
    baseSpeed
  );

  const scriptWithTimestamps = calculateWordTimestamps(lines, totalDuration);

  return { scriptWithTimestamps, totalDuration };
}
