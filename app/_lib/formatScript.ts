export default function formatScript(nodes: any) {
  const words: any = [];
  const chapters: any = {};
  let wordIndex = 0;

  nodes.forEach((chapter: any, cIndex: any) => {
    chapters[wordIndex] = {
      title: chapter.title,
      speaker: chapter.speaker,
    };

    chapter.paragraphs.forEach((paragraph: any) => {
      const wordsInParagraph = paragraph
        .map((words: any) => words.text)
        .join("")

        .trim()
        .split(/\s+/);

      wordsInParagraph.forEach((word: string) => {
        words.push({
          word,
          position: wordIndex,
          chapterTitle: chapter.title,
          chapterIndex: cIndex,
        });
        wordIndex++;
      });
    });
  });

  return {
    formattedScript: {
      words,
      chapters,
    },
  };
}
