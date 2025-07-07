import React from "react";
import { ArrowLeft, HelpCircle, Info } from "lucide-react";
import assets from "../../assets/assets";

export const ChatHeader = ({
  selectedUser,
  onlineUsers,
  onBackClick,
  setShowRightSidebar,
  showRightSidebar,
}) => {
  return (
    <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[#393a5a]">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackClick}
          className="md:hidden p-1 rounded-full hover:bg-[#282142]/50"
        >
          <ArrowLeft className="h-5 w-5 text-gray-300" />
        </button>
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-[#393a5a]"
        />
        <div>
          <p className="text-white font-medium flex items-center gap-2">
            {selectedUser.fullName}
            {onlineUsers.includes(selectedUser._id) && (
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            )}
          </p>
          <p className="text-xs text-gray-400">
            {onlineUsers.includes(selectedUser._id)
              ? "Online"
              : `Last seen ${selectedUser.lastSeen || "recently"}`}
          </p>
        </div>
      </div>
      <button
        className="p-2 md:hidden cursor-pointer rounded-full hover:bg-[#282142]/50"
        onClick={()=>setShowRightSidebar((prev) => !prev)}
      >
        <Info className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
};
