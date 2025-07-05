import React, { useState } from "react";
import { Image, Video, FileText, Mic, Link, Smile, Clock, Circle } from "lucide-react";
import assets from "../assets/assets";
import { useAuthStore } from "../stores/authStore";
import { formatMessageTime, generateThumbnailUrl, getMediaTypeFromUrl } from "../lib/utils";
import { useChatStore } from "../stores/messageStore";
import { MediaDialog } from "./chatContainer/MediaDialog";

const RightSidebar = ({ selectedUser }) => {
  const { onlineUsers } = useAuthStore();
  const { chats } = useChatStore();
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Extract media files from chats with proper typing
  const mediaFiles = chats.reduce((acc, chat) => {
    if (chat.file) {
      const fileUrl = chat.file;
      let fileType = getMediaTypeFromUrl(fileUrl);
      
      // For video thumbnails - adjust based on your storage solution
      const thumbnailUrl = fileType === 'video' 
        ? generateThumbnailUrl(fileUrl) 
        : fileUrl;

      acc.push({
        type: fileType,
        url: fileUrl,
        thumbnailUrl,
        timestamp: chat.createdAt
      });
    }
    return acc;
  }, []);


  const isOnline = onlineUsers.includes(selectedUser?._id);
  const lastSeen = selectedUser?.lastSeen || new Date();

  const getMediaIcon = (type) => {
    const iconProps = { className: "h-4 w-4" };
    switch (type) {
      case "image": return <Image {...iconProps} />;
      case "video": return <Video {...iconProps} />;
      case "file": return <FileText {...iconProps} />;
      case "audio": return <Mic {...iconProps} />;
      default: return <Link {...iconProps} />;
    }
  };

  const getStatusIndicator = () => {
    return isOnline ? (
      <span className="flex items-center text-green-400 text-xs">
        <Circle className="h-2 w-2 fill-green-500 mr-1" />
        Online now
      </span>
    ) : (
      <span className="flex items-center text-gray-400 text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Last seen {formatMessageTime(lastSeen)}
      </span>
    );
  };

  if (!selectedUser) return null;

  return (
    <div className={`bg-[#0f0e17]/80 text-white w-full h-full overflow-y-auto ${selectedUser ? "max-md:hidden" : ""}`}>
      {/* User Profile Section */}
      <div className="p-6 flex flex-col items-center gap-4 text-center border-b border-[#393a5a]">
        <div className="relative">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#393a5a]"
          />
          <div className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-[#0f0e17] ${
            isOnline ? "bg-green-500" : "bg-gray-500"
          }`} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold">{selectedUser.fullName}</h2>
          <p className="text-gray-300 mt-1">{selectedUser.bio || "No bio yet"}</p>
          <div className="mt-2">
            {getStatusIndicator()}
          </div>
        </div>
      </div>

      {/* Shared Media Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <Image className="h-4 w-4" />
          Shared Media {mediaFiles.length > 0 && `(${mediaFiles.length})`}
        </h3>
        
        {mediaFiles.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {mediaFiles.slice(0, 9).map((item, index) => (
              <div 
                key={`${item.url}-${index}`}
                className="aspect-square bg-[#1a1a2e] rounded-md overflow-hidden relative group cursor-pointer"
                onClick={() => setSelectedMedia(item)}
                title={`Shared ${formatMessageTime(item.timestamp)}`}
              >
                {item.type === 'image' || item.type === 'video' ? (
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.type === 'image' ? "Shared media" : "Video thumbnail"} 
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {getMediaIcon(item.type)}
                  </div>
                )}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                      <Video className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No media shared yet</p>
        )}
      </div>

      {/* User Details Section */}
      <div className="p-4 border-t border-[#393a5a]">
        <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <Smile className="h-4 w-4" />
          About
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-300">
            <span className="text-gray-400">Status:</span> {isOnline ? "Active now" : "Offline"}
          </p>
          {!isOnline && (
            <p className="text-gray-300">
              <span className="text-gray-400">Last active:</span> {formatMessageTime(lastSeen)}
            </p>
          )}
          <p className="text-gray-300">
            <span className="text-gray-400">Joined:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Media Dialog */}
      {selectedMedia && (
        <MediaDialog
          fileUrl={selectedMedia.url}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
};

export default RightSidebar;