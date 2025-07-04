import React from 'react';
import Skeleton from './Skeleton';

const MessagesSkeleton = ({ length = 6 }) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {Array.from({ length }).map((_, i) => {
        const isSender = i % 2 === 0; // Alternate left/right
        return (
          <div
            key={i}
            className={`flex ${isSender ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex gap-2 items-end ${isSender? 'flex-row' : 'flex-row-reverse'}`}>
            <Skeleton className="size-6  aspect-square rounded-full"/>
            <Skeleton
              className={`px-4 py-2 max-w-[70%] rounded-lg ${
                isSender
                ? 'bg-neutral-500 rounded-bl-none'
                : 'bg-neutral-600 rounded-br-none'
              }`}
              >
              <div className="h-4 min-w-20 w-[80%] bg-neutral-600 rounded" />
            </Skeleton>
              </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesSkeleton;
