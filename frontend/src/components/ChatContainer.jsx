import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Image,
  ArrowLeft,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import MessagesSkeleton from "./skeletons/MessagesSkeleton";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messagesDummyData]);

  const scrollToBottom = () => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement message sending logic
      setMessage("");
      setTimeout(scrollToBottom, 100); // Scroll after message is added
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return selectedUser ? (
    <div className="h-full justify-between flex flex-col bg-[#0f0e17]/80 backdrop-blur-sm">
      {/* Chat header - fixed height */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[#393a5a]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden p-1 rounded-full hover:bg-[#282142]/50"
          >
            <ArrowLeft className="h-5 w-5 text-gray-300" />
          </button>
          <img
            src={assets.profile_martin}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-[#393a5a]"
          />
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              Martin Johnson
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </p>
            <p className="text-xs text-gray-400">
              {isTyping ? "typing..." : "online"}
            </p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-[#282142]/50">
          <HelpCircle className="h-5 w-5 text-gray-300" />
        </button>
      </div>

      {/* Messages area - flexible space with proper scrolling */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          maxHeight: "calc(100vh - 160px)", // Adjust based on your header/input heights
          scrollBehavior: "smooth",
        }}
      >
        {messagesDummyData.length > 0 ? (
          messagesDummyData.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.senderId === "680f50e4f10f3cd28382ecf9"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.senderId !== "680f50e4f10f3cd28382ecf9" && (
                <img
                  src={assets.profile_martin}
                  alt="Profile"
                  className="w-8 h-8 rounded-full self-end"
                />
              )}

              <div
                className={`max-w-[80%] flex flex-col ${
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? "items-end"
                    : "items-start"
                }`}
              >
                {msg.image ? (
                  <img
                    className="max-w-full max-h-64 rounded-lg border border-[#393a5a] object-cover"
                    src={msg.image}
                    alt="Attachment"
                  />
                ) : (
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.senderId === "680f50e4f10f3cd28382ecf9"
                        ? "bg-[#393a5a] rounded-br-none"
                        : "bg-[#282142] rounded-bl-none"
                    }`}
                  >
                    <p className="text-white">{msg.text}</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formatMessageTime(msg.createdAt)}
                </p>
              </div>

              {msg.senderId === "680f50e4f10f3cd28382ecf9" && (
                <img
                  src={assets.avatar_icon}
                  alt="You"
                  className="w-8 h-8 rounded-full self-end"
                />
              )}
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400">No messages yet</p>
          </div>
        )}
        <div ref={scrollEnd} />
      </div>

      {/* Fixed message input at bottom */}
      <div className="flex-shrink-0 p-3 border-t border-[#393a5a] bg-[#0f0e17]">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-[#1a1a2e] rounded-full px-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none text-white py-3 placeholder-gray-400"
            />
            <label className="cursor-pointer p-2 rounded-full hover:bg-[#282142]">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
              />
              <Image className="h-5 w-5 text-gray-400" />
            </label>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="flex-shrink-0 p-3 rounded-full bg-[#393a5a] hover:bg-[#4a4b6a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="hidden md:flex flex-col items-center justify-center gap-4 h-full p-8 text-center">
      <div className="p-6 rounded-full bg-[#1a1a2e]">
        <MessageSquare className="h-12 w-12 text-[#8185b2]" />
      </div>
      <h3 className="text-xl font-medium text-white">Chat anytime, anywhere</h3>
      <p className="text-gray-400 max-w-md">
        Select a conversation to start messaging or create a new one
      </p>
    </div>
  );
};

export default ChatContainer;
