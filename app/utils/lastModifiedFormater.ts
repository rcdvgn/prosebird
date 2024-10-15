import { Timestamp } from "firebase/firestore";

const getTimeDifference = (timestamp: Timestamp) => {
  const now = new Date();
  const timeDiff = now.getTime() - timestamp.toDate().getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(timeDiff / 60000);

  if (seconds < 60) {
    return seconds <= 5 ? "just now" : `${seconds} seconds ago`;
  }
  if (minutes < 10) {
    return `${minutes} minutes ago`;
  }

  const time = timestamp
    .toDate()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = timestamp.toDate().toLocaleDateString();

  return date === new Date().toLocaleDateString() ? time : date;
};

export const lastModifiedFormatter = (timestamp: Timestamp) => {
  return getTimeDifference(timestamp); // Static value, no need for interval or re-rendering logic
};
