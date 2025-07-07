import React from "react";
import {
  Check,
  CheckCheck,
  File,
  Image as ImageIcon,
  Video as VideoIcon,
  FileAudio,
  Play,
} from "lucide-react";
import {
  formatMessageTime,
  generateThumbnailUrl,
  getMediaTypeFromUrl,
} from "../../lib/utils";
import { getExtensionIcon } from "../../assets/assets";

export const MessageBubble = ({
  message,
  isSender,
  senderProfilePic,
  receiverProfilePic,
  onMediaClick,
}) => {
  const getFileIcon = (url) => {
    const ext = url.split(".").pop().toLowerCase();
    const src = getExtensionIcon(ext);
    const iconClass = "h-6 w-6";
    return <img src={src} alt={ext} className={iconClass} />;
  };

  const renderFilePreview = () => {
    if (!message.file) return null;

    const fileType = message.fileType || getMediaTypeFromUrl(message.file);
    const fileName = message.fileName || "File";
    const fileSize = message.fileSize
      ? `(${(message.fileSize / 1024).toFixed(1)} KB)`
      : "";

    if (fileType === "image") {
      return (
        <div
          className="relative group cursor-pointer"
          onClick={() => onMediaClick(message.file)}
        >
          <img
            className={`max-w-[200px] aspect-square rounded-lg border border-[#393a5a] object-cover ${
              message.text ? "rounded-t-lg rounded-b-none" : ""
            }`}
            src={message.file}
            alt="Image attachment"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-black/50 p-2 rounded-full">
              <ImageIcon className="h-5 w-5 text-white" />{" "}
            </div>
          </div>
        </div>
      );
    }

    if (fileType === "video") {
      const thumbnailUrl = generateThumbnailUrl(message.file);
      return (
        <div
          className="relative group cursor-pointer"
          onClick={() => onMediaClick(message.file)}
        >
          <img
            className={`w-full max-w-[240px] aspect-video rounded-lg border border-[#393a5a] object-cover ${
              message.text ? "rounded-t-lg rounded-b-none" : ""
            }`}
            src={thumbnailUrl}
            alt="Video thumbnail"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-black/50 p-2 rounded-full">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
          </div>
        </div>
      );
    }

    if (fileType === "audio") {
      return (
        <div
          className={`bg-[#1a1a2e] rounded-lg border border-[#393a5a] ${
            message.text ? "rounded-t-lg rounded-b-none" : ""
          }`}
          style={{ width: "100%" }}
        >
          <div className="flex flex-col gap-1 p-3">
            <p
              className="text-sm font-medium text-white truncate"
              title={fileName}
            >
              {fileName}
            </p>
            <p className="text-xs text-gray-400">{fileSize}</p>
            <audio
              controls
              className="w-full rounded-md"
              style={{
                height: "40px",
                color: "white",
              }}
            >
              <source
                src={message.file}
                type={`audio/${message.file.split(".").pop()}`}
              />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      );
    }

    // For documents and other files
    return (
      <button
        onClick={() => window.open(message.file, "_blank")}
        className="w-fit max-w-full p-0.5 text-gray-400 hover:brightness-125 cursor-pointer hover:text-white"
      >
        <div
          className={`p-3 overflow-hidden bg-[#1a1a2e] rounded-2xl border border-[#393a5a] ${
            message.text ? "rounded-t-2xl rounded-b-none" : ""
          }`}
        >
          <div className="flex items-end gap-2 max-w-full">
            {getFileIcon(message.file)}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-white truncate whitespace-nowrap overflow-hidden"
                title={fileName}
              >
                {fileName}
              </p>
              <p className="text-xs text-gray-400">{fileSize}</p>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`flex gap-3 px-2 ${
        isSender ? "justify-end" : "justify-start"
      }`}
    >
      {!isSender && (
        <img
          src={receiverProfilePic}
          alt="Receiver"
          className="w-8 h-8 rounded-full self-end flex-shrink-0"
        />
      )}

      <div
        className={`w-full flex flex-col ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        {/* Combined message container */}
        <div
          className={`rounded-2xl overflow-hidden inline-block w-fit ${
            isSender
              ? "bg-[#393a5a] rounded-br-none"
              : "bg-[#282142] rounded-bl-none"
          }`}
        >
          <div
            className={`inline-flex flex-col items-end rounded-2xl overflow-hidden ${
              isSender
                ? "bg-[#393a5a] rounded-br-none"
                : "bg-[#282142] rounded-bl-none"
            }`}
            style={{ width: "fit-content", maxWidth: "100%" }}
          >
            {message.file && renderFilePreview()}
            {message.text && (
              <div className={`p-3 ${message.file ? "pt-2" : ""} w-full`}>
                <p className="text-white break-words whitespace-pre-wrap">
                  {message.text}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1">
          <p className="text-xs text-gray-400">
            {formatMessageTime(message.createdAt)}
          </p>
          {isSender &&
            (message.seen ? (
              <CheckCheck className="h-3 w-3 text-blue-400" />
            ) : (
              <Check className="h-3 w-3 text-gray-400" />
            ))}
        </div>
      </div>

      {isSender && (
        <img
          src={senderProfilePic}
          alt="You"
          className="w-8 h-8 rounded-full self-end flex-shrink-0"
        />
      )}
    </div>
  );
};
