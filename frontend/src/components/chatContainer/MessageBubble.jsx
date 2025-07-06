import React, { useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  File,
  Image as ImageIcon,
  Video as VideoIcon,
  FileAudio,
  FileText,
  Play,
  Download,
  Pause,
  MoreVertical,
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
            className={`w-full max-w-60 aspect-square rounded-lg border border-[#393a5a] object-cover ${
              message.text ? "rounded-t-lg rounded-b-none" : ""
            }`}
            src={message.file}
            alt="Image attachment"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-black/50 p-2 rounded-full">
              <ImageIcon className="h-5 w-5 text-white" />
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
            className={`w-full max-w-xs aspect-video rounded-lg border border-[#393a5a] object-cover ${
              message.text ? "rounded-t-lg rounded-b-none" : ""
            }`}
            src={thumbnailUrl}
            alt="Video thumbnail"
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
          className={`p-3 min-w-80 bg-[#1a1a2e] rounded-lg border border-[#393a5a] ${
            message.text ? "rounded-t-lg rounded-b-none" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            {/* <div className="bg-[#282142] p-3 rounded-full">
              <FileAudio className="h-5 w-5 text-violet-400" />
            </div> */}
            <div className="flex-1">
              <p className="text-sm font-medium text-white truncate">
                {fileName}
              </p>
              <p className="text-xs text-gray-400">{fileSize}</p>
              <audio
                controls
                className="w-full mt-2"
                style={{
                  height: "40px",
                  borderRadius: "20px",
                  backgroundColor: "#282142",
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
        </div>
      );
    }

    // For documents and other files
    return (
      <button
        onClick={() => window.open(message.file, "_blank")}
        className="p-0.5 text-gray-400 hover:brightness-125 cursor-pointer hover:text-white"
      >
        <div
          className={`p-3 overflow-hidden bg-[#1a1a2e] rounded-2xl border border-[#393a5a] ${
            message.text ? "rounded-t-2xl rounded-b-none" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {getFileIcon(message.file)}
            <div className="flex-1">
              <p className="text-sm font-medium text-white truncate">
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
    <div className={`flex gap-3 ${isSender ? "justify-end" : "justify-start"}`}>
      {!isSender && (
        <img
          src={receiverProfilePic}
          alt="Receiver"
          className="w-8 h-8 rounded-full self-end"
        />
      )}

      <div
        className={`max-w-[80%] flex flex-col ${
          isSender ? "items-end" : "items-start"
        }`}
      >
        {/* Combined message container */}
        <div
          className={`rounded-2xl overflow-hidden ${
            isSender
              ? "bg-[#393a5a] rounded-br-none"
              : "bg-[#282142] rounded-bl-none"
          }`}
        >
          {message.file && renderFilePreview()}
          {message.text && (
            <div className={`p-3 ${message.file ? "pt-2" : ""}`}>
              <p className="text-white">{message.text}</p>
            </div>
          )}
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
          className="w-8 h-8 rounded-full self-end"
        />
      )}
    </div>
  );
};
