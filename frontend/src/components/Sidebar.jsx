import React, { useState, useEffect } from "react";
import { User, Search, X, LogOut, Settings, Menu } from "lucide-react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import SidebarUsersSkeleton from "./skeletons/SidebarUsersSkeleton";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const {
    authUser,
    logout,
    getAllUsers,
    allUsers,
    fetchingUsers,
    onlineUsers,
  } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = allUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`bg-[#0f0e17] w-full h-full p-4 rounded-r-xl overflow-y-auto text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* Header Section */}
      <div className="pb-5 sticky top-0 bg-[#0f0e17] z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={assets.logo} alt="Logo" className="h-8 w-auto" />
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#282142]/50 transition-colors"
            >
              <img
                src={authUser?.profilePic || assets.avatar_icon}
                className="h-8 w-8 rounded-full object-cover border-2 border-[#393a5a]"
                alt="Profile"
              />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 z-20 w-48 p-2 rounded-md bg-[#1a1a2e] border border-gray-700 shadow-lg"
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 hover:bg-[#3a3655] rounded text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </button>
                <button
                  className="w-full flex items-center gap-2 p-2 hover:bg-[#3a3655] rounded text-sm text-red-300"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#1a1a2e] rounded-full flex items-center gap-3 py-2 px-4 mt-5 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
          <Search className="shrink-0 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-transparent border-none outline-none text-white text-sm placeholder-gray-400 flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-1 pt-2">
        {fetchingUsers ? (
          <SidebarUsersSkeleton />
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-colors group
                ${
                  selectedUser?._id === user._id
                    ? "bg-[#393a5a]"
                    : "hover:bg-[#282142]"
                }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={`${user.fullName}'s profile`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#393a5a] group-hover:border-purple-500 transition-colors"
                />
                {onlineUsers.includes(user._id) && (
                  <div className="absolute z-10 size-3 bg-green-500 border-2 border-[#0f0e17] rounded-full bottom-0 right-0" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-left">{user.fullName}</p>
                <p
                  className={`text-xs text-left ${
                    onlineUsers.includes(user._id)
                      ? "text-green-400"
                      : "text-gray-400"
                  }`}
                >
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </p>
              </div>

              {selectedUser?._id === user._id && (
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              )}
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Search className="h-8 w-8 mb-2" />
            <p>No users found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;