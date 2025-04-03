import React, { useState } from 'react';
import { FaExpand } from 'react-icons/fa';

const PhotoCard = ({ photo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const imageUrl = `http://localhost:5000${photo.imagePath}`;
  
  return (
    <>
      <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-gray-200 aspect-square">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Image not available
          </div>
        ) : (
          <>
            <img 
              src={imageUrl}
              alt={photo.title} 
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#075985] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
        
        <div className="absolute inset-0 bg-[#00000017] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button 
            onClick={() => setIsOpen(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white p-2 rounded-full"
            aria-label="Expand image"
          >
            <FaExpand className="text-[#075985]" />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-semibold">{photo.title}</h3>
          {photo.description && (
            <p className="text-sm text-gray-200">{photo.description}</p>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000017] bg-opacity-80 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="max-w-4xl max-h-screen p-2 bg-white rounded-lg"
            onClick={e => e.stopPropagation()}
          >
            {imageError ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Image not available
              </div>
            ) : (
              <img 
                src={imageUrl}
                alt={photo.title} 
                className="max-h-[80vh] max-w-full object-contain mx-auto"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold">{photo.title}</h2>
              {photo.description && (
                <p className="mt-2 text-gray-700">{photo.description}</p>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-[#075985] text-white rounded hover:bg-[#0369a1] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoCard;