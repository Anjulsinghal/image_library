import React, { useState } from 'react';
import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AdminPhotoCard = ({ photo, onEdit, onDelete, onMoveUp, onMoveDown }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img 
          src={`http://localhost:5000${photo.imagePath}`} 
          alt={photo.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-3">
        <h3 className="font-medium truncate">{photo.title}</h3>
        {photo.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {photo.description}
          </p>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex space-x-1">
            <button 
              onClick={() => onEdit(photo)}
              className="p-2 text-blue-700 hover:bg-blue-50 rounded"
              title="Edit photo"
            >
              <FaEdit />
            </button>
            
            {!isConfirmingDelete ? (
              <button 
                onClick={() => setIsConfirmingDelete(true)}
                className="p-2 text-red-700 hover:bg-red-50 rounded"
                title="Delete photo"
              >
                <FaTrash />
              </button>
            ) : (
              <div className="flex space-x-1">
                <button 
                  onClick={() => {
                    onDelete(photo._id);
                    setIsConfirmingDelete(false);
                  }}
                  className="p-1 text-xs bg-red-600 text-white rounded"
                >
                  Confirm
                </button>
                <button 
                  onClick={() => setIsConfirmingDelete(false)}
                  className="p-1 text-xs bg-gray-200 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="flex space-x-1">
            <button 
              onClick={() => onMoveUp(photo)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded"
              title="Move up"
            >
              <FaArrowUp />
            </button>
            <button 
              onClick={() => onMoveDown(photo)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded"
              title="Move down"
            >
              <FaArrowDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPhotoCard;