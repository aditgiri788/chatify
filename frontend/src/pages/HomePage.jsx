import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import { ChatContainer } from "../components/chatContainer/ChatContainer.jsx";

//here is define when we click on user than it will make grid according to its ratio

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(false); // moved inside component
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <div className="border max-w-screen-xl mx-auto h-svh">
      <div
        className={`backdrop-blur-xl  border-2 border-gray-600 
           rounded-2xl overflow-hidden h-full grid grid-cols-1 relative ${
             selectedUser
               ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
               : "md:grid-cols-2"
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
        <RightSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setShowRightSidebar={setShowRightSidebar}
          showRightSidebar={showRightSidebar}
        />
      </div>
    </div>
  );
};

export default HomePage;
