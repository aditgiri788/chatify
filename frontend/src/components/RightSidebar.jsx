import React, { useState } from "react";
import {
  Image,
  Video,
  FileText,
  Mic,
  Link,
  Smile,
  Clock,
  Circle,
  ArrowLeftIcon,
} from "lucide-react";
import assets, { getExtensionIcon } from "../assets/assets";
import { useAuthStore } from "../stores/authStore";
import {
  formatMessageTime,
  generateThumbnailUrl,
  getMediaTypeFromUrl,
} from "../lib/utils";
import { useChatStore } from "../stores/messageStore";
import { MediaDialog } from "./chatContainer/MediaDialog";

const RightSidebar = ({
  selectedUser,
  setShowRightSidebar,
  showRightSidebar,
}) => {
  const { onlineUsers } = useAuthStore();
  const { chats } = useChatStore();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaFilter, setMediaFilter] = useState("all"); // 'all', 'image', 'video', 'doc'

  // Extract media files from chats with proper typing
  const allMediaFiles = chats.reduce((acc, chat) => {
    if (chat.file) {
      const fileUrl = chat.file;
      let fileType = getMediaTypeFromUrl(fileUrl);
      let extension = fileUrl.split(".").pop().toLowerCase();
      let fileName = chat.fileName || `File.${extension}`;

      // For video thumbnails - adjust based on your storage solution
      const thumbnailUrl =
        fileType === "video" ? generateThumbnailUrl(fileUrl) : fileUrl;

      acc.push({
        type: fileType,
        url: fileUrl,
        thumbnailUrl,
        extension,
        fileName,
        timestamp: chat.createdAt,
      });
    }
    return acc;
  }, []);

  // Filter media files based on selected filter
  const filteredMediaFiles = allMediaFiles.filter((file) => {
    if (mediaFilter === "all") return true;
    if (mediaFilter === "image") return file.type === "image";
    if (mediaFilter === "video") return file.type === "video";
    if (mediaFilter === "doc") return file.type !== "image" && file.type !== "video";
    if (mediaFilter === "audio") return file.type === "audio";

    return true;
  }).reverse();

  const isOnline = onlineUsers.includes(selectedUser?._id);
  const lastSeen = selectedUser?.lastSeen || new Date();

  const mediaOptions = [
    { key: "all", label: "All", icon: null, title: "All media" },
    { key: "image", label: "", icon: <Image className="h-4 w-4" />, title: "Images", },
    { key: "video", label: "", icon: <Video className="h-4 w-4" />, title: "Videos", },
    { key: "audio", label: "", icon: <Mic className="h-4 w-4" />, title: "Audio files" },
    { key: "doc", label: "", icon: <FileText className="h-4 w-4" />, title: "Documents", },
  ];

  const getMediaIcon = (url) => {
    console.log("Media URL:", url);
    if (!url) return null;
    const ext = getExtensionIcon(url.split(".").pop().toLowerCase());
    const iconClass = "size-10";
    return <img src={ext} alt="Media icon" className={iconClass} />;
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
    <div
      className={`bg-[#0f0e17]/80 text-white w-full h-full overflow-y-auto ${
        selectedUser && !showRightSidebar ? "max-md:hidden" : ""
      }`}
    >
      {/* User Profile Section */}
      <button
        className="p-2 md:hidden bg-[#1a1a2e] hover:bg-[#282142]/50 rounded-full absolute top-4 left-4"
        onClick={() => setShowRightSidebar((prev) => !prev)}
        title="Back to chats"
      >
        <ArrowLeftIcon />
      </button>
      <div className="p-6 flex flex-col items-center gap-4 text-center border-b border-[#393a5a]">
        <div className="relative">
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#393a5a]"
          />
          <div
            className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-[#0f0e17] ${
              isOnline ? "bg-green-500" : "bg-gray-500"
            }`}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">{selectedUser.fullName}</h2>
          <p className="text-gray-300 mt-1">
            {selectedUser.bio || "No bio yet"}
          </p>
          <div className="mt-2">{getStatusIndicator()}</div>
        </div>
      </div>

      {/* Shared Media Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Image className="h-4 w-4 shrink-0" />
            Media{" "}
            {filteredMediaFiles.length > 0 && `(${filteredMediaFiles.length})`}
          </h3>

          <div className="flex items-center gap-1">
            {mediaOptions.map(({ key, label, icon, title }) => {
              const isActive = mediaFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setMediaFilter(key)}
                  className={`cursor-pointer hover:brightness-90 flex items-center justify-center text-sm size-8 rounded transition-colors duration-200 ${
                    isActive
                      ? "bg-[#393a5a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2e2f4a]"
                  }`}
                  title={title}
                >
                  {icon || label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredMediaFiles.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {filteredMediaFiles.map((item, index) => (
              <div
                key={`${item.url}-${index}`}
                className="bg-[#1a1a2e] rounded-md overflow-hidden relative group cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="aspect-square relative">
                  {item.type === "image" || item.type === "video" ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={
                        item.type === "image"
                          ? "Shared media"
                          : "Video thumbnail"
                      }
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      {getMediaIcon(item.extension)}
                    </div>
                  )}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                        <Video className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p
                    className="text-xs text-gray-300 truncate"
                    title={item.fileName}
                  >
                    {item.fileName}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {formatMessageTime(item.timestamp)}
                  </p>
                </div>
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
            <span className="text-gray-400">Status:</span>{" "}
            {isOnline ? "Active now" : "Offline"}
          </p>
          {!isOnline && (
            <p className="text-gray-300">
              <span className="text-gray-400">Last active:</span>{" "}
              {formatMessageTime(lastSeen)}
            </p>
          )}
          <p className="text-gray-300">
            <span className="text-gray-400">Joined:</span>{" "}
            {new Date(selectedUser.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Media Dialog */}
      {selectedMedia && (
        <MediaDialog
          fileUrl={selectedMedia.url}
          fileName={selectedMedia.fileName}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
};

export default RightSidebar;
