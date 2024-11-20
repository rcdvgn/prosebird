// import splitWithSpaces from "../_utils/splitWithSpaces";

export default function formatScript(
  nodes: any,
  userId: any,
  scriptsParticipants: any
) {
  const words: any = [];
  const chapters: any = {};
  const speakers: any = [];
  let wordIndex = 0;

  nodes.forEach((entry: any) => {
    if (!speakers.includes(entry.speaker)) {
      if (entry.speaker !== userId) {
        speakers.push(entry.speaker);
      }
    }

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

  const presentationParticipants: any = [];
  scriptsParticipants.forEach((scriptsParticipant: any) => {
    if (speakers.includes(scriptsParticipant.id)) {
      presentationParticipants.push({
        ...scriptsParticipant,
        isConnected: false,
      });
    }
  });

  return {
    formattedScript: {
      words,
      chapters,
    },
    participants: presentationParticipants,
  };
}
