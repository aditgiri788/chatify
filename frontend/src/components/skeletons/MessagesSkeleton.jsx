import React from "react";
import Skeleton from "./Skeleton";

const MessagesSkeleton = ({ length = 6 }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {Array.from({ length }).map((_, i) => {
        const isSender = i % 2 === 0; // Alternate left/right
        return (
          <div
            key={i}
            className={`flex ${isSender ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`flex gap-2 items-end ${
                isSender ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <Skeleton className="size-8 bg-violet-400/10 aspect-square rounded-full" />
              <div className="space-y-2 w-full">
                <Skeleton
                  className={`p-4 w-60 flex-1 rounded-xl ${
                    isSender
                      ? "bg-violet-950/10 rounded-bl-none"
                      : "bg-violet-400/10 rounded-br-none"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="h-3 min-w-20 bg-violet-500/10 rounded" />
                    <div className="h-3 min-w-20 bg-violet-500/10 rounded" />
                  </div>
                </Skeleton>
                <Skeleton className={`h-4 ${isSender? "" : "ml-auto"} w-12 bg-violet-500/10`}/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesSkeleton;
