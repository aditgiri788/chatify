
// Utility function to format time
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Set to false for 24-hour format
  });
}
