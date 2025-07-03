import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState("hyzen burg");
  const [bio, setBio] = useState("hii every one");

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center backdrop-blur-2xl">
      <div
        className="w-[300px] rounded-md max-w-2xl backdrop:blur-2xl text-gray-300 border-2 border-gray-600
      flex items-center justify-between max-sm:flex flex-col-reverse
      " //???
      >
        <form
          className="flex flex-col gap-5 p-10 flex-1 "
          onSubmit={handleSubmit}
        >
          <h3 className=" font-bold text-lg text-white text-center">
            Profile Details{" "}
          </h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer justify-center"
          >
            <input type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : assets.avatar_icon
              }
              alt=""
              className="w-12 h-12"
            />
          </label>
          <input
            type="text"
            required
            placeholder="Your name"
            className="p-2  border border-gray-500 
          rounded-md focus outline-none focus:ring-2 focus:ring-violet-500"
            onChange={(e) => setName(e.target.name)}
          />
          <textarea
            placeholder="Write Profile bio"
            required
            className="border border-gray-500 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
            onChange={(e) => setBio(e.target.bio)}
          ></textarea>

          <button
            type="submit"
            className="p-2 rounded-md bg-gradient-to-r from-purple-400 to-violet-600 cursor-pointer  text-lg border border-black"
          >
            Submit
          </button>
        </form>
        <img src={assets.logo_icon} className="h-12 w-12 mt-9" alt="" />
      </div>
    </div>
  );
};

export default ProfilePage;
