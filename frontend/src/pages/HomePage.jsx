import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import { ChatContainer } from "../components/chatContainer/ChatContainer.jsx";


const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(false); // moved inside component
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <div className="max-w-screen-2xl mx-auto h-svh">
      <div
        className={`backdrop-blur-xl rounded-2xl overflow-hidden h-full grid relative ${
          selectedUser
            ? "grid-cols-1 md:grid-cols-[auto_1fr_auto] lg:grid-cols-[300px_1fr_300px]"
            : "grid-cols-1 md:grid-cols-[auto_1fr]"
        }`}
      >
        <Sidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatContainer
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowRightSidebar={setShowRightSidebar}
          showRightSidebar={showRightSidebar}
        />
        {selectedUser && (
          <RightSidebar
            className={`${!showRightSidebar ? "hidden lg:block" : ""}`}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setShowRightSidebar={setShowRightSidebar}
            showRightSidebar={showRightSidebar}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
