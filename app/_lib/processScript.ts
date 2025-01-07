const maxWidth = 520;
const baseFactor = 1500;

async function loadFontAndContext(): Promise<CanvasRenderingContext2D> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to get 2D context for canvas");
  }

  const font = new FontFace(
    "Public-Sans",
    "url(src/assets/Public_Sans/static/PublicSans-Bold.ttf)"
  );
  await font.load();
  document.fonts.add(font);
  context.font = "36px Public-Sans"; // Adjust the size as needed

  return context;
}

function calculateLineBreaks(
  context: CanvasRenderingContext2D,
  script: string
): { lines: string[]; wordsPerLine: number[] } {
  let currentLine = "";
  let lines: string[] = [];
  let wordsPerLine: number[] = [];
  const words = script.split(" ");

  words.forEach((word) => {
    const testLine = currentLine + (currentLine.length > 0 ? " " : "") + word;
    const testWidth = context.measureText(testLine).width;

    if (testWidth > maxWidth) {
      lines.push(currentLine);
      wordsPerLine.push(currentLine.split(" ").length);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine); // Push the last line
    wordsPerLine.push(currentLine.split(" ").length);
  }

  return { lines, wordsPerLine };
}

export default function processScript(nodes: any) {
  const processedScript = nodes.forEach((node: any) => {});

  // const processScript =
  return processedScript;
}
