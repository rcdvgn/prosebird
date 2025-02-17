import { Timestamp } from "firebase/firestore";

const getTimeDifference = (timestamp: Timestamp) => {
  if (!timestamp) return null;
  const now = new Date();
  const targetDate = timestamp.toDate();

  const timeDiff = now.getTime() - targetDate.getTime();
  const oneDayInMs = 24 * 60 * 60 * 1000;

  // Check if the event happened today
  if (now.toDateString() === targetDate.toDateString()) {
    return targetDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Check if the event happened yesterday
  const yesterday = new Date(now.getTime() - oneDayInMs);
  if (yesterday.toDateString() === targetDate.toDateString()) {
    return "Yesterday";
  }

  // Format as abbreviated date (e.g., Jan. 27, 2025)
  return targetDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const lastModifiedFormatter = (timestamp: Timestamp) => {
  return getTimeDifference(timestamp);
};
