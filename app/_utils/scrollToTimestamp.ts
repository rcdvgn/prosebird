import { usePresentation } from "../_contexts/PresentationContext";

export function scrollToTimestamp(
  timestamp: any,
  scrollContainer: any,
  scriptContainer: any,
  scrollThumb: any
) {
  const { totalDuration, setIsAutoscrollOn } = usePresentation();

  // Ensure timestamp is a number
  const numericTimestamp =
    typeof timestamp === "string" ? parseFloat(timestamp) : timestamp;

  if (isNaN(numericTimestamp)) {
    console.error("Invalid timestamp format. Expected a number.");
    return;
  }

  // Turn off auto-scroll
  setIsAutoscrollOn(false);

  // Check if all required elements are available
  if (
    !scrollThumb.current ||
    !scriptContainer.current ||
    !scrollContainer.current
  ) {
    console.error("Required DOM elements not available");
    return;
  }

  const scrollContainerHeight = scrollContainer.current.clientHeight;
  const scriptContainerHeight = scriptContainer.current.scrollHeight;

  // Calculate scroll ratio based on timestamp and total duration
  const scrollRatio = Math.min(numericTimestamp / totalDuration, 1); // Ensure we don't exceed 1

  // Calculate new positions
  const newThumbTop =
    scrollRatio * (scrollContainerHeight - scrollThumb.current.offsetHeight);
  const newScriptTop =
    -scrollRatio * (scriptContainerHeight - scrollContainerHeight);

  // Update the scrollThumb and scriptContainer positions
  scrollThumb.current.style.top = `${newThumbTop}px`;
  scriptContainer.current.style.top = `${newScriptTop}px`;
}
