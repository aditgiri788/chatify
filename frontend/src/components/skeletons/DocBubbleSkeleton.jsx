import { FileIcon, Loader2 } from 'lucide-react'
import React from 'react'

const DocBubbleSkeleton = () => {
  return (
   <div className="space-y-1">
      <div className="flex text-violet-400 gap-2 items-center animate-pulse p-2 ml-auto max-w-52 bg-violet-600 brightness-75 rounded-2xl rounded-br-none">
        <div className="bg-black/30 flex items-center justify-center size-10 rounded-full aspect-square">
          <FileIcon className="size-4 absolute" />
          <Loader2 className="absolute animate-spin size-10" />
        </div>
        <div className="w-full h-6 bg-black/30 rounded-md" />
      </div>
      <div className="animate-pulse ml-auto h-4 w-16 bg-violet-600 brightness-75 rounded-2xl" />
    </div>
  )
}

export default DocBubbleSkeleton
