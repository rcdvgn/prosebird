export default function generatePresentationCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const getRandomLetter = () =>
    letters[Math.floor(Math.random() * letters.length)];

  const getRandomNumber = () =>
    numbers[Math.floor(Math.random() * numbers.length)];

  const characters = [
    getRandomLetter(),
    getRandomLetter(),
    getRandomNumber(),
    getRandomNumber(),
  ];

  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  return characters.join("");
}
