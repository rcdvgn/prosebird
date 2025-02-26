export default function formatScript(nodes: any) {
  const words: any = [];
  const chapters: any = {};
  let wordIndex = 0;

  nodes.forEach((entry: any) => {
    // Mark the start of a new chapter at the current global word index.
    chapters[wordIndex] = {
      title: entry.title,
      speaker: entry.speaker,
    };

    // Now, for each paragraph (which is a string) in the chapter,
    // split it into words.
    entry.paragraphs.forEach((paragraph: any, pIndex: number) => {
      // Trim and split the paragraph by whitespace.

      const wordsInParagraph = paragraph
        .map((words: any) => words.text)
        .join("")

        .trim()
        .split(/\s+/);

      wordsInParagraph.forEach((word: string) => {
        words.push({
          word, // The word text
          position: wordIndex,
          chapterTitle: entry.title, // Optional: track chapter info per word
          paragraphIndex: pIndex, // Optional: track which paragraph this word belongs to
        });
        wordIndex++;
      });

      // Optionally, if you want an explicit paragraph break marker,
      // you can push a special token (for example, a newline marker).
      // words.push({ word: "\n", position: wordIndex, isParagraphBreak: true });
      // wordIndex++;
    });
  });

  return {
    formattedScript: {
      words,
      chapters,
    },
  };
}
