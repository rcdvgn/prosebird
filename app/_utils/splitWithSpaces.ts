export default function splitWithSpaces(sentence: any) {
  const words = sentence.trim().split(/\s+/);
  return words.map((word: any) => `${word} `);
}
