import React, { useState, useRef, useEffect } from "react";
import { Send, ImageIcon, VideoIcon, FileIcon, FileTextIcon, FileAudioIcon, X, Loader2, Plus, LinkIcon } from "lucide-react";
import { useChatStore } from "../../stores/messageStore";
import { getExtensionIcon } from "../../assets/assets";

export const MessageInput = ({ 
  message, 
  setMessage, 
  fileType,
  setFileType,
  onSend, 
  onKeyPress 
}) => {
  const { sendingMessage } = useChatStore();
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [rows, setRows] = useState(1);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const videoRef = useRef(null);

  const MAX_ROWS = 10;
  const LINE_HEIGHT = 24; // px

  useEffect(() => {
    // Reset video when preview is removed
    if (!mediaPreview && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [mediaPreview]);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const type = file.type.split('/')[0];
      setFileType(type);

      if (['image', 'video', 'audio'].includes(type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setMediaPreview(null);
      }
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
    setMessage("");
    removeMediaPreview();
    setRows(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && (message.trim() || mediaFile)) {
      e.preventDefault();
      handleSend();
    } else if (onKeyPress) {
      onKeyPress(e);
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    // Calculate rows needed
    const previousRows = e.target.rows;
    e.target.rows = 1; // reset rows to get scrollHeight
    const currentRows = Math.floor(e.target.scrollHeight / LINE_HEIGHT);
    
    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }
    
    if (currentRows >= MAX_ROWS) {
      e.target.rows = MAX_ROWS;
      e.target.scrollTop = e.target.scrollHeight;
    } else {
      e.target.rows = currentRows;
    }
    
    setRows(currentRows < MAX_ROWS ? currentRows : MAX_ROWS);
  };

  const getFileIcon = () => {
    const ext = mediaFile ? mediaFile.name.split('.').pop().toLowerCase() : '';
    const src = getExtensionIcon(ext);
    const iconClass = "h-6 w-6";  
    return <img src={src} alt={ext} className={iconClass} />;
  };

  const renderFilePreview = () => {
    if (!mediaFile) return null;

    if (fileType === 'image') {
      return (
        <div className="relative w-max">
          <img
            src={mediaPreview}
            alt="Preview"
            className="aspect-square max-h-24 rounded-lg border border-[#393a5a] object-cover"
          />
          <button
            onClick={removeMediaPreview}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      );
    }

    if (fileType === 'video') {
      return (
        <div className="relative w-max">
          <video 
            ref={videoRef}
            controls
            autoPlay
            className="aspect-video max-h-32 rounded-lg border border-[#393a5a] object-cover"
          >
            <source src={mediaPreview} type={mediaFile.type} />
            Your browser does not support the video tag.
          </video>
          <button
            onClick={removeMediaPreview}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      );
    }

    if (fileType === 'audio') {
      return (
        <div className="relative w-full max-w-xs bg-[#1a1a2e] p-4 rounded-lg border border-[#393a5a]">
          <div className="flex items-center gap-4">
            <FileAudioIcon className="h-8 w-8 text-violet-400" />
            <audio
              controls
              autoPlay
              className="flex-1"
            >
              <source src={mediaPreview} type={mediaFile.type} />
              Your browser does not support the audio element.
            </audio>
          </div>
          <button
            onClick={removeMediaPreview}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center w-max gap-2 p-3 bg-[#1a1a2e] rounded-lg border border-[#393a5a]">
        {getFileIcon()}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{mediaFile.name}</p>
          <p className="text-xs text-gray-400">
            {(mediaFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <button
          onClick={removeMediaPreview}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="flex-shrink-0 p-3 border-t border-[#393a5a] bg-[#0f0e17]">
      {/* Media preview */}
      {(mediaPreview || (mediaFile && !mediaPreview)) && (
        <div className="relative p-4 border-[#393a5a] bg-[#0f0e17]">
          {renderFilePreview()}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1 flex flex-col bg-[#1a1a2e] rounded-2xl">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyPress}
            rows={rows}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-white px-4 py-3 placeholder-gray-400 resize-none max-h-[calc(10*24px)] overflow-y-auto"
            style={{ lineHeight: `${LINE_HEIGHT}px` }}
          />
          <div className="flex items-center px-2 pb-2">
            <label className="cursor-pointer p-2 rounded-full bg-[#393a5a] hover:brightness-90 transition-colors">
              <input
                type="file"
                id="media"
                accept="*/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleMediaChange}
              />
              <LinkIcon className="size-5 text-violet-400"/>
            </label>
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={(!message.trim() && !mediaFile) || sendingMessage}
          className={`flex-shrink-0 p-3 rounded-full ${
            message.trim() || mediaFile
              ? "bg-[#4f46e5] hover:bg-[#4338ca]"
              : "bg-[#393a5a]"
          } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {sendingMessage ? (
            <Loader2 className="animate-spin h-5 w-5 text-white"/>
          ) : (
            <Send className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};