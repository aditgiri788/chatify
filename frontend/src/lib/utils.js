// Utility function to format time
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Set to false for 24-hour format
  });
}

export const getMediaTypeFromUrl = (url) => {
  if (!url) return "unknown";
  const extension = url.split(".").pop().toLowerCase().split(/[#?]/)[0];

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const videoExtensions = ["mp4", "webm", "mov", "avi", "mkv"];
  const audioExtensions = ["mp3", "wav", "ogg", "m4a"];
  const documentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"];

  if (imageExtensions.includes(extension)) return "image";
  if (videoExtensions.includes(extension)) return "video";
  if (audioExtensions.includes(extension)) return "audio";
  if (documentExtensions.includes(extension)) return "document";

  return "unknown";
};

export const generateThumbnailUrl = (videoUrl) => {
  return videoUrl
        .replace('/video/upload/', '/video/upload/so_1/')
        .replace(/\.(mp4|webm|mov)$/, '.jpg')
};
