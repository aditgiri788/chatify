import { FileAudio, Loader2 } from "lucide-react";
import React from "react";

const AudioBubbleSkeleton = () => {
  return (
    <div className="space-y-1">
      <div className="flex text-violet-400 gap-2 items-end animate-pulse p-4 ml-auto max-w-82 bg-violet-600 brightness-75 rounded-2xl rounded-br-none">
        <div className="bg-black/30 flex items-center justify-center size-10 rounded-full aspect-square">
          <FileAudio className="size-4 absolute" />
          <Loader2 className="absolute animate-spin size-10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img className="w-full object-contain" src="/audio-wave.svg" />
        </div>
      </div>
      <div className="animate-pulse ml-auto h-4 w-16 bg-violet-600 brightness-75 rounded-2xl" />
    </div>
  );
};

export default AudioBubbleSkeleton;
