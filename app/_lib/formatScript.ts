import splitWithSpaces from "../_utils/splitWithSpaces";

export default function formatScript(nodes: any) {
  const words: any = [];
  const chapters: any = {};
  let wordIndex = 0;

  nodes.forEach((entry: any) => {
    const script = entry.paragraph.trim().split(/\s+/);
    // const script = splitWithSpaces(entry.paragraph.trim());

    chapters[wordIndex] = {
      title: entry.title,
      speaker: entry.speaker,
    };

    script.forEach((word: any) => {
      words.push({
        word: word,
        index: wordIndex,
      });
      wordIndex++;
    });
  });

  return {
    words,
    chapters,
  };
}
