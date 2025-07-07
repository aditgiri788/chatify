import React from "react";

const ChatBubbleSkeleton = () => {
  return (
    <div className="space-y-1">
      <div
        className={
          "animate-pulse h-12 ml-auto max-w-82 bg-violet-600 brightness-75 rounded-2xl rounded-br-none"
        }
      ></div>
      <div className="animate-pulse ml-auto h-4 w-16 bg-violet-600 brightness-75 rounded-2xl" />
    </div>
  );
};

export default ChatBubbleSkeleton;
