import { Timestamp } from "firebase/firestore";

function normalizeTimestamp(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  } else if (
    typeof timestamp === "object" &&
    timestamp?.seconds &&
    timestamp?.nanoseconds
  ) {
    // Handle custom objects that mimic Firestore Timestamp structure
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  } else if (timestamp instanceof Date) {
    // Already a Date object
    return timestamp;
  } else if (typeof timestamp === "number") {
    // Handle numeric timestamps (e.g., Unix epoch time in milliseconds)
    return new Date(timestamp);
  } else {
    throw new Error("Unsupported timestamp format");
  }
}

export function groupInstancesByTime(
  instances: any[],
  criteria: string
): Record<string, any[]> {
  const now = new Date();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const oneWeekInMs = 7 * oneDayInMs;
  const oneMonthInMs = 30 * oneDayInMs;

  const organizedInstances: Record<string, any[]> = {};

  instances.forEach((instance) => {
    const rawTimestamp = instance[criteria];
    let date: Date;

    try {
      date = normalizeTimestamp(rawTimestamp);
    } catch (error) {
      console.error(`Failed to normalize timestamp:`, rawTimestamp);
      return;
    }

    const timeDiff = now.getTime() - date.getTime();

    if (timeDiff < oneDayInMs) {
      organizedInstances["today"] = organizedInstances["today"] || [];
      organizedInstances["today"].push(instance);
    } else if (timeDiff < oneWeekInMs) {
      organizedInstances["last 7 days"] =
        organizedInstances["last 7 days"] || [];
      organizedInstances["last 7 days"].push(instance);
    } else if (timeDiff < oneMonthInMs) {
      organizedInstances["last 30 days"] =
        organizedInstances["last 30 days"] || [];
      organizedInstances["last 30 days"].push(instance);
    } else {
      const isSameYear = now.getFullYear() === date.getFullYear();
      const key = isSameYear
        ? date.toLocaleString("en-US", { month: "long" })
        : date.getFullYear().toString();

      organizedInstances[key] = organizedInstances[key] || [];
      organizedInstances[key].push(instance);
    }
  });

  return organizedInstances;
}
