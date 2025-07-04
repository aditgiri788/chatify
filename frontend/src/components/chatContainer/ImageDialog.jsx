import React from "react";
import { X } from "lucide-react";

export const ImageDialog = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={imageUrl}
          alt="Full size preview"
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};