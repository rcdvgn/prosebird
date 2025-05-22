// Returns the word position whose timestamp is <= the given timestamp
export default function getPositionFromTimestamp(
  timestamps: number[],
  timestamp: number
): number {
  const n = timestamps.length;
  if (n === 0) return 0;
  if (timestamp <= timestamps[0]) return 0;
  if (timestamp >= timestamps[n - 1]) return n - 1;

  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (timestamps[mid] <= timestamp) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}
