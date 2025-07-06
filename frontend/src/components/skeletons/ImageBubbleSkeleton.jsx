import { ImageIcon, Loader2 } from "lucide-react";
import React from "react";

const ImageBubbleSkeleton = () => {
  return (
    <div className="space-y-1">
      <div
        className={
          "realtive animate-pulse h-32 ml-auto aspect-video bg-violet-600 brightness-75 rounded-2xl rounded-br-none"
        }
      >
        <div className="bg-black/30 text-violet-400 rounded-full size-10 flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ImageIcon className="size-4 absolute" />
          <Loader2 className="absolute animate-spin size-10" />
        </div>
      </div>
      <div className="animate-pulse ml-auto h-4 w-16 bg-violet-600 brightness-75 rounded-2xl" />
    </div>
  );
};

export default ImageBubbleSkeleton;
