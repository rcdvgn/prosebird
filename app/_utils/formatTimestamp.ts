export default function formatTimestamp(milliseconds: number): string {
  const totalSeconds = Math.round(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  const formattedMinutes = minutes.toString();
  const formattedSeconds =
    remainingSeconds < 10
      ? `0${remainingSeconds}`
      : remainingSeconds.toString();

  if (hours > 0) {
    return `${hours}:${formattedMinutes.padStart(2, "0")}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
