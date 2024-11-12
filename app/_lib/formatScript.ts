// import splitWithSpaces from "../_utils/splitWithSpaces";

export default function formatScript(nodes: any, userId: any) {
  const words: any = [];
  const chapters: any = {};
  const guestsObject: any = {};
  let wordIndex = 0;

  nodes.forEach((entry: any) => {
    if (!Object.keys(guestsObject).includes(entry.speaker.id)) {
      if (entry.speaker.id !== userId) {
        guestsObject[entry.speaker.id] = {
          ...entry.speaker,
          isConnected: false,
        };
      }
    }

    const script = entry.paragraph.trim().split(/\s+/);
    // const script = splitWithSpaces(entry.paragraph.trim());

    chapters[wordIndex] = {
      title: entry.title,
      speaker: entry.speaker.id,
    };

    script.forEach((word: any) => {
      words.push({
        word: word,
        index: wordIndex,
      });
      wordIndex++;
    });
  });

  const guests: any = [];
  Object.values(guestsObject).forEach((guest) => guests.push(guest));

  return {
    formattedScript: {
      words,
      chapters,
    },
    guests: guests,
  };
}
