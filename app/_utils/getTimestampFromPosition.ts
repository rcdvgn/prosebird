export default function getTimestampFromPosition(
  timestamps: number[],
  position: number
): number | null {
  if (
    !timestamps ||
    !Array.isArray(timestamps) ||
    position < 0 ||
    position >= timestamps.length
  ) {
    return null;
  }
  return timestamps[position] ?? null;
}
