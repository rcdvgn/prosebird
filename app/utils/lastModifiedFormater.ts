import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";

const getTimeDifference = (timestamp: Timestamp) => {
  const now = new Date();
  const timeDiff = now.getTime() - timestamp.toDate().getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(timeDiff / 60000);

  if (seconds < 60)
    return {
      label: seconds <= 5 ? "just now" : `${seconds} seconds ago`,
      interval: 1000,
    };
  if (minutes < 10) return { label: `${minutes} minutes ago`, interval: 61000 };

  const time = timestamp
    .toDate()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = timestamp.toDate().toLocaleDateString();
  return {
    label: date === new Date().toLocaleDateString() ? time : date,
    interval: null, // No further updates for time/date
  };
};

export const lastModifiedFormatter = (timestamp: Timestamp) => {
  const { label, interval: initialInterval } = getTimeDifference(timestamp);
  const [formattedTime, setFormattedTime] = useState<string>(label);
  const [intervalTime, setIntervalTime] = useState<number | null>(
    initialInterval
  );

  useEffect(() => {
    if (intervalTime === null) return; // Stop updating if no interval is required

    const interval = setInterval(() => {
      const { label, interval } = getTimeDifference(timestamp);
      setFormattedTime(label);
      setIntervalTime(interval); // Update interval dynamically
    }, intervalTime);

    return () => clearInterval(interval); // Clean up on unmount
  }, [intervalTime, timestamp]);

  return formattedTime;
};
