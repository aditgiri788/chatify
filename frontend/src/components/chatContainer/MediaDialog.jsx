import React from "react";
import { X, ImageIcon, VideoIcon, FileIcon, FileTextIcon, FileAudioIcon, Download } from "lucide-react";
import { getMediaTypeFromUrl } from "../../lib/utils";

export const MediaDialog = ({ fileUrl, onClose }) => {
  const mediaType = getMediaTypeFromUrl(fileUrl);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleOpenInDefaultApp = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderMedia = () => {
    switch (mediaType) {
      case 'image':
        return (
          <div 
            className={`relative ${isFullscreen ? 'fixed inset-0 bg-black z-50' : ''}`}
            onClick={toggleFullscreen}
          >
            <img
              src={fileUrl}
              alt="Full size preview"
              className={`
                ${isFullscreen ? 
                  'w-full h-full object-contain' : 
                  'max-w-[90vw] max-h-[80vh] object-contain md:max-h-[90vh]'
                }
                cursor-zoom-in
              `}
            />
            {isFullscreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            )}
          </div>
        );
      case 'video':
        return (
          <video
            controls
            autoPlay
            className="w-full max-w-[90vw] max-h-[80vh] object-contain md:max-h-[90vh]"
          >
            <source src={fileUrl} type={`video/${fileUrl.split('.').pop()}`} />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <div className="bg-gray-800 p-8 flex flex-col items-center w-full max-w-md">
            <FileAudioIcon className="h-16 w-16 text-gray-400 mb-4" />
            <audio
              controls
              autoPlay
              className="w-full"
            >
              <source src={fileUrl} type={`audio/${fileUrl.split('.').pop()}`} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return (
          <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center w-full max-w-md">
            <FileTextIcon className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-300 mb-4">No preview available</p>
            <button
              onClick={handleOpenInDefaultApp}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Open in default app
            </button>
          </div>
        );
    }
  };

  const getMediaIcon = () => {
    switch (mediaType) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'video': return <VideoIcon className="h-5 w-5" />;
      case 'audio': return <FileAudioIcon className="h-5 w-5" />;
      default: return <FileIcon className="h-5 w-5" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-4xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {!isFullscreen && (
          <div className="bg-[#27293e] rounded-lg overflow-hidden shadow-xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-2 bg-gray-900">
              <div className="flex items-center gap-2 text-gray-300">
                {getMediaIcon()}
                <span className="text-sm">
                  {mediaType === 'unknown' ? 'Document' : mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Close media viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex items-center justify-center">
              {renderMedia()}
            </div>
            
            {mediaType === 'unknown' && (
              <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-center">
                <button
                  onClick={handleOpenInDefaultApp}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors text-sm"
                >
                  <Download className="h-4 w-4" />
                  Open in default application
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Fullscreen content renders outside the container */}
        {isFullscreen && renderMedia()}
      </div>
    </div>
  );
};