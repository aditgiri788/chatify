import React from "react";
import { LogOut, Image, Video, FileText, Mic, Link, Smile, Clock, Circle } from "lucide-react";
import assets from "../assets/assets";
import { useAuthStore } from "../stores/authStore";
import { formatMessageTime } from "../lib/utils"; // You'll need to implement this utility

const RightSidebar = ({ selectedUser }) => {
  const { onlineUsers, logout } = useAuthStore();
  
  // Sample media data - replace with actual data from your app
  const mediaData = [
    { type: "image", url: assets.sample_image1 },
    { type: "image", url: assets.sample_image2 },
    { type: "video", url: assets.sample_video },
    { type: "image", url: assets.sample_image3 },
    { type: "file", url: assets.sample_file },
    { type: "image", url: assets.sample_image4 },
  ];

  const isOnline = onlineUsers.includes(selectedUser?._id);
  const lastSeen = selectedUser?.lastSeen || new Date(); // Use actual lastSeen from your user data

  const getMediaIcon = (type) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "file": return <FileText className="h-4 w-4" />;
      case "audio": return <Mic className="h-4 w-4" />;
      default: return <Link className="h-4 w-4" />;
    }
  };

  const getStatusIndicator = () => {
    if (isOnline) {
      return (
        <span className="flex items-center text-green-400 text-xs">
          <Circle className="h-2 w-2 fill-green-500 mr-1" />
          Online now
        </span>
      );
    }
    return (
      <span className="flex items-center text-gray-400 text-xs">
        <Clock className="h-3 w-3 mr-1" />
        Last seen {formatMessageTime(lastSeen)}
      </span>
    );
  };

  return (
    selectedUser && (
      <div className={`bg-[#0f0e17]/80 text-white w-full h-full flex flex-col ${selectedUser ? "max-md:hidden" : ""}`}>
        {/* User Profile Section */}
        <div className="p-6 flex flex-col items-center gap-4 text-center border-b border-[#393a5a]">
          <div className="relative">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#393a5a]"
            />
            <div className={`absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-[#0f0e17] ${
              isOnline ? "bg-green-500" : "bg-gray-500"
            }`}></div>
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
            Shared Media
          </h3>
          
          <div className="grid grid-cols-3 gap-2">
            {mediaData.map((item, index) => (
              <div 
                key={index} 
                className="aspect-square bg-[#1a1a2e] rounded-md overflow-hidden relative group cursor-pointer"
                onClick={() => window.open(item.url, "_blank")}
              >
                {item.type === "image" ? (
                  <img 
                    src={item.url} 
                    alt="Media" 
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    {getMediaIcon(item.type)}
                  </div>
                )}
              </div>
            ))}
          </div>
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

        {/* Action Buttons */}
        <div className="p-4 cursor-pointer border-t border-[#393a5a] space-y-2">
          <button className="w-full py-2 px-4 bg-[#1a1a2e] hover:bg-[#282142] text-white rounded-lg transition-all">
            View Full Profile
          </button>
          <button 
          onClick={logout}
          className="w-full cursor-pointer py-2 px-4 bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-800 hover:to-violet-800 text-white rounded-lg flex items-center justify-center gap-2 transition-all">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default RightSidebar;