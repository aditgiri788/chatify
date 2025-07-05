import React, { useState, useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useChatStore } from "../../stores/messageStore";
import { MediaDialog } from "./MediaDialog";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import MessagesSkeleton from "../skeletons/MessagesSkeleton";
import assets from "../../assets/assets";
import Skeleton from "../skeletons/Skeleton";

export const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const { onlineUsers, authUser } = useAuthStore();
  const { loadingChat, chats, getChats, sendMessage, sendingMessage} = useChatStore();

  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getChats(selectedUser._id);
    }
  }, [selectedUser?._id, getChats]);

  useEffect(() => {
    // Scroll to the last message when chats update
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [chats]);

  const handleSendMessage = async (file) => {
    if (message.trim() || file) {
      try {
        const formData = new FormData();
        if (message.trim()) formData.append("text", message);
        if (file) formData.append("file", file);

        await sendMessage(selectedUser._id, formData);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openMediaDialog = (fileUrl) => {
    setSelectedImage(fileUrl);
  };

  const closeMediaDialog = () => {
    setSelectedImage(null);
  };

  if (!selectedUser) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center gap-4 h-full p-8 text-center bg-[#0f0e17]/80 backdrop-blur-sm">
        <div className="p-6 rounded-full bg-[#1a1a2e]">
          <MessageSquare className="h-12 w-12 text-[#8185b2]" />
        </div>
        <h3 className="text-xl font-medium text-white">
          Chat anytime, anywhere
        </h3>
        <p className="text-gray-400 max-w-md">
          Select a conversation to start messaging or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-[#0f0e17]/80 backdrop-blur-sm">
      <ChatHeader
        selectedUser={selectedUser}
        onlineUsers={onlineUsers}
        onBackClick={() => setSelectedUser(null)}
      />

      <div className="flex-1 overflow-y-auto p-4">
        {loadingChat ? (
          <MessagesSkeleton />
        ) : chats?.length > 0 ? (
          chats.map((msg, index) => (
            <div
              className={`${index === chats.length - 1? "pb-10" : ""}`}
              key={msg._id}
              ref={index === chats.length - 1 ? lastMessageRef : null}
            >
              <MessageBubble
                message={msg}
                isSender={msg.senderId === authUser?._id}
                senderProfilePic={authUser?.profilePic || assets.avatar_icon}
                receiverProfilePic={
                  selectedUser.profilePic || assets.avatar_icon
                }
                onImageClick={openMediaDialog}
              />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-6 rounded-full bg-[#1a1a2e] mb-4">
              <MessageSquare className="h-12 w-12 text-[#8185b2]" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Start a conversation with {selectedUser.fullName.split(" ")[0]}
            </h3>
            <p className="text-gray-400 max-w-md">
              Send your first message and get the conversation going
            </p>
          </div>
        )}
        {sendingMessage && (
          <Skeleton className="rounded-2xl w-full max-w-60 ml-auto rounded-br-none bg-violet-400/60 h-16" />
        )}
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
      />

      {selectedImage && (
        <MediaDialog fileUrl={selectedImage} onClose={closeMediaDialog} />
      )}
    </div>
  );
};
