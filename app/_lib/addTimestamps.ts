async function loadFontAndContext(
  fontSize: any
): Promise<CanvasRenderingContext2D> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to get 2D context for canvas");
  }

  const font = new FontFace(
    "Public-Sans",
    "url(/fonts/Public_Sans/static/PublicSans-Bold.ttf)"
  );
  await font.load();
  document.fonts.add(font);
  context.font = `${fontSize}px Public-Sans`; // Adjust the size as needed

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

  // Get the line height based on the font metrics
  const fontMetrics = context.measureText("Mg"); // Using characters with ascenders and descenders
  const lineHeight =
    fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent;

  words.forEach((wordObject: any) => {
    const testLine =
      currentLine.map((item: any) => item.word).join(" ") +
      (currentLine.length > 0 ? " " : "") +
      wordObject.word;
    const testWidth = context.measureText(testLine).width;

    // Check if the word's key is a chapter start
    if (chapterKeys.has(wordObject.position)) {
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = [wordObject]; // Start a new line with the chapter's first word
    } else if (testWidth > containerWidth) {
      lines.push(currentLine);
      currentLine = [wordObject]; // Start a new line with the word
    } else {
      currentLine.push(wordObject); // Add the word to the current line
    }
  });

  // Push the final line if it's not empty
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return {
    lines,
    lineHeight,
  };
}

function calculateTotalDuration(
  numberOfLines: any,
  speedMultiplier: any,
  baseSpeed: any,
  numberOfChapters: any,
  heightPerLine: any
) {
  const durationWoChapterTitles = numberOfLines * speedMultiplier * baseSpeed;
  const durationPerPixel =
    durationWoChapterTitles / (numberOfLines * heightPerLine);
  const chapterTitlesDuration = numberOfChapters * 80 * durationPerPixel;
  return durationWoChapterTitles + chapterTitlesDuration;
}

function calculateWordTimestamps(
  lines: any,
  chapters: any,
  totalDuration: any
) {
  const durationPerLine = totalDuration / lines.length;
  const scriptWithTimestamps: any = {};
  const chaptersWithTimestamps: any = {};

  const chapterPositions = Object.keys(chapters);

  lines.forEach((line: any, lineIndex: any) => {
    // const lineWords = line.split(" ");
    const wordsWithTimestamps = line.map((wordObject: any, wordIndex: any) => {
      const timestamp =
        lineIndex * durationPerLine +
        durationPerLine * (wordIndex / line.length);

      if (chapterPositions.includes(wordObject.position.toString())) {
        chaptersWithTimestamps[wordObject.position] = {
          ...chapters[wordObject.position],
          timestamp,
        };
      }
      return { ...wordObject, timestamp };
    });

    scriptWithTimestamps[lineIndex] = wordsWithTimestamps;
  });

  return { scriptWithTimestamps, chaptersWithTimestamps };
}

export default async function calculateTimestamps(
  words: any,
  chapters: any,
  containerWidth: any,
  speedMultiplier: any,
  fontSize: any
) {
  const baseSpeed = 1500;

  const context = await loadFontAndContext(fontSize);

  const { lines, lineHeight: heightPerLine } = calculateLineBreaks(
    context,
    words,
    chapters,
    containerWidth
  );

  const totalDuration = calculateTotalDuration(
    lines.length,
    speedMultiplier,
    baseSpeed,
    Object.keys(chapters).length,
    heightPerLine
  );

  const { scriptWithTimestamps, chaptersWithTimestamps } =
    calculateWordTimestamps(lines, chapters, totalDuration);

  return { scriptWithTimestamps, chaptersWithTimestamps, totalDuration };
}
