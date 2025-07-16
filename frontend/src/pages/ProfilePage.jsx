import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Camera, 
  Pencil, 
  Loader2, 
  ArrowLeft, 
  Check, 
  X,
  Edit3,
  Info
} from "lucide-react";
import assets from "../assets/assets";
import { useAuthStore } from "../stores/authStore";

const ProfilePage = () => {
  const { authUser, updateProfile, updatingProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("fullName", name);
    formData.append("bio", bio);
    if (selectedImg) {
      formData.append("file", selectedImg);
    }

    await updateProfile(formData);
  };

  return (
    <div className="min-h-svh bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a2e] rounded-xl shadow-xl overflow-hidden border border-[#393a5a]">
        {/* Header */}
        <div className="bg-[#16213e] p-5 border-b border-[#393a5a]">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-full hover:bg-[#393a5a] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-300" />
            </button>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-violet-400" />
              Edit Profile
            </h2>
            <div className="w-9"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="relative group mb-3">
              <img
                src={
                  selectedImg
                    ? URL.createObjectURL(selectedImg)
                    : authUser?.profilePic || assets.avatar_icon
                }
                referrerPolicy="no-referrer"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#393a5a] hover:border-violet-500 transition-all cursor-pointer shadow-lg"
                onClick={() => fileInputRef.current.click()}
              />
              <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              id="avatar"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            
            <label
              htmlFor="avatar"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#282142] hover:bg-[#393a5a] text-sm text-gray-200 transition-colors cursor-pointer"
            >
              <Pencil className="h-4 w-4" />
              Change photo
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User className="h-4 w-4 text-violet-400" />
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  placeholder="Enter your name"
                  className="w-full p-3 pl-10 bg-[#16213e] border border-[#393a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-500 transition-all"
                  onChange={(e) => setName(e.target.value)}
                />
                <Info className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Pencil className="h-4 w-4 text-violet-400" />
                About Me
              </label>
              <textarea
                placeholder="Tell us about yourself..."
                required
                className="w-full p-3 bg-[#16213e] border border-[#393a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-500 min-h-[120px] transition-all"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 border border-[#393a5a] rounded-lg text-gray-300 hover:text-white hover:bg-[#282142] transition-colors flex items-center justify-center gap-2"
            >
              <X className="h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingProfile}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {updatingProfile ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;