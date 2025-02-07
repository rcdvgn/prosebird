import { Timestamp } from "firebase/firestore";

export const timeAgoFormatter = (timestamp: Timestamp) => {
  const now = new Date();
  const targetDate = timestamp.toDate();

  const timeDiffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000
  );

  if (timeDiffInSeconds < 60) {
    return `${timeDiffInSeconds}s`; // Seconds
  }

  const timeDiffInMinutes = Math.floor(timeDiffInSeconds / 60);
  if (timeDiffInMinutes < 60) {
    return `${timeDiffInMinutes}m`; // Minutes
  }

  const timeDiffInHours = Math.floor(timeDiffInMinutes / 60);
  if (timeDiffInHours < 24) {
    return `${timeDiffInHours}h`; // Hours
  }

  const timeDiffInDays = Math.floor(timeDiffInHours / 24);
  if (timeDiffInDays < 7) {
    return `${timeDiffInDays}d`; // Days
  }

  const timeDiffInWeeks = Math.floor(timeDiffInDays / 7);
  return `${timeDiffInWeeks}w`; // Weeks
};
