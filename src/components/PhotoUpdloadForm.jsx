// src/components/PhotoUploadForm.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const PhotoUploadForm = ({ onSubmit, initialData = {}, submitLabel = "Upload Photo" }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [imagePreview, setImagePreview] = useState(initialData.imagePath ? `http://localhost:5000${initialData.imagePath}` : null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImage(acceptedFiles[0]);
        setImagePreview(URL.createObjectURL(acceptedFiles[0]));
        setError('');
      }
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles[0].errors[0].code === 'file-too-large') {
        setError('File is too large. Maximum size is 5MB.');
      } else {
        setError('Please upload a valid image file.');
      }
    }
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!imagePreview && !initialData.imagePath) {
      setError('Please upload an image');
      return;
    }
    
    onSubmit({ 
      title, 
      description, 
      image,
      order: initialData.order
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Enter photo title"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
          rows={3}
          placeholder="Enter photo description (optional)"
        />
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image {!initialData.imagePath && '*'}
        </label>
        
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors ${
            isDragActive ? 'border-[#0ea5e9] bg-[#f0f9ff]' : 'border-gray-300 hover:border-[#0ea5e9]'
          }`}
        >
          <input {...getInputProps()} />
          
          {imagePreview ? (
            <div className="space-y-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-48 mx-auto rounded"
              />
              <p className="text-sm text-gray-500">
                Click or drag to replace this image
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-500">
                {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
              </p>
              <p className="text-xs text-gray-400">
                Max file size: 5MB
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default PhotoUploadForm;