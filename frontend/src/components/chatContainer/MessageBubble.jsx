import React from "react";
import { Check, CheckCheck, File, Image as ImageIcon } from "lucide-react";
import { formatMessageTime } from "../../lib/utils";

export const MessageBubble = ({ 
  message,
  isSender,
  senderProfilePic,
  receiverProfilePic,
  onImageClick,
}) => {
  const renderFilePreview = () => {
    if (!message.file) return null;

    const fileType = message.fileType || getFileType(message.file);
    const fileName = message.fileName || "File";

    switch(fileType) {
      case 'image':
        return (
          <div className="relative">
            <img
              className="max-w-full aspect-video max-h-38 rounded-lg border border-[#393a5a] object-cover cursor-pointer"
              src={message.file}
              alt="Attachment"
              onClick={() => onImageClick(message.file)}
            />
          </div>
        );
      case 'video':
        return (
          <div className="relative">
            <video 
              controls
              className="max-w-full aspect-video max-h-38 rounded-lg border border-[#393a5a] object-cover"
              onClick={(e) => e.stopPropagation()}
            >
              <source src={message.file} type={`video/${message.file.split('.').pop()}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      default:
        return (
          <a 
            href={message.file} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-lg border border-[#393a5a] bg-[#282142] text-white hover:bg-[#393a5a]"
          >
            <File className="h-5 w-5" />
            <span className="truncate max-w-xs">{fileName}</span>
          </a>
        );
    }
  };

  const getFileType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension)) return 'video';
    return 'document';
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
        {message.file ? (
          renderFilePreview()
        ) : (
          <div
            className={`p-3 rounded-2xl ${
              isSender
                ? "bg-[#393a5a] rounded-br-none"
                : "bg-[#282142] rounded-bl-none"
            }`}
          >
            <p className="text-white">{message.text}</p>
          </div>
        )}
        <div className="flex items-center gap-1 mt-1">
          <p className="text-xs text-gray-400">
            {formatMessageTime(message.createdAt)}
          </p>
          {isSender && (
            message.seen ? (
              <CheckCheck className="h-3 w-3 text-blue-400" />
            ) : (
              <Check className="h-3 w-3 text-gray-400" />
            )
          )}
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