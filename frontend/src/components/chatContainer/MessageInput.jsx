import React from "react";
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useChatStore } from "../../stores/messageStore";

export const MessageInput = ({ 
  message, 
  setMessage, 
  onSend, 
  onKeyPress 
}) => {
  const {sendingMessage} = useChatStore();

  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' or 'video'
  const fileInputRef = useRef(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      
      // Determine file type
      const type = file.type.split('/')[0];
      setFileType(type === 'video' ? 'video' : 'image');

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMediaPreview = () => {
    setMediaPreview(null);
    setMediaFile(null);
    setFileType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = () => {
    onSend(mediaFile);
    setMediaPreview(null);
    setMediaFile(null);
    setFileType(null);
  };

  return (
    <div className="flex-shrink-0 p-3 border-t border-[#393a5a] bg-[#0f0e17]">
      {/* Media preview */}
      {mediaPreview && (
        <div className="relative p-4 border-t border-[#393a5a] bg-[#0f0e17]">
          <div className="relative w-full max-w-xs">
            {fileType === 'video' ? (
              <video 
                controls
                className="w-full h-auto max-h-64 rounded-lg border border-[#393a5a] object-cover"
              >
                <source src={mediaPreview} type={mediaFile.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-full h-auto max-h-64 rounded-lg border border-[#393a5a] object-cover"
              />
            )}
            <button
              onClick={removeMediaPreview}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center bg-[#1a1a2e] rounded-full px-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-white py-3 placeholder-gray-400"
          />
          <label className="cursor-pointer p-2 rounded-full hover:bg-[#282142]">
            <input
              type="file"
              id="media"
              accept="image/*, video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleMediaChange}
            />
            <ImageIcon className="h-5 w-5 text-gray-400" />
          </label>
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() && !mediaFile || sendingMessage}
          className={`flex-shrink-0 p-3 rounded-full ${
            message.trim() || mediaFile
              ? "bg-[#4f46e5] hover:bg-[#4338ca]"
              : "bg-[#393a5a]"
          } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {
            sendingMessage
            ? <Loader2 className="animate-spin"/>
            : <Send className="h-5 w-5 text-white" /> 
          }
        </button>
      </div>
    </div>
  );
};