import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPhotos, createPhoto, updatePhoto, deletePhoto, reorderPhotos } from '../services/api';
import PhotoUploadForm from '../components/PhotoUpdloadForm';
import AdminPhotoCard from '../components/AdminPhotoCard';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPage = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  
  // Updated to v5 object syntax
  const { data: photos, isLoading } = useQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos
  });
  
  // Updated to v5 object syntax
  const createMutation = useMutation({
    mutationFn: createPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    }
  });
  
  // Updated to v5 object syntax
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePhoto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      setEditingPhoto(null);
    }
  });
  
  // Updated to v5 object syntax
  const deleteMutation = useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    }
  });
  
  // Updated to v5 object syntax
  const reorderMutation = useMutation({
    mutationFn: reorderPhotos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    }
  });
  
  const handleUpload = async (photoData) => {
    try {
      setIsUploading(true);
      await createMutation.mutateAsync(photoData);
      setIsUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };
  
  const handleUpdate = async (photoData) => {
    try {
      setIsUploading(true);
      await updateMutation.mutateAsync({
        id: editingPhoto._id,
        data: photoData
      });
      setIsUploading(false);
    } catch (error) {
      console.error('Update error:', error);
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  
  const handleMoveUp = (photo) => {
    if (!photos) return;
    
    const index = photos.findIndex(p => p._id === photo._id);
    if (index <= 0) return;
    
    const newOrders = photos.map(p => ({
      id: p._id,
      order: p.order
    }));
    
    const temp = newOrders[index].order;
    newOrders[index].order = newOrders[index - 1].order;
    newOrders[index - 1].order = temp;
    
    reorderMutation.mutate(newOrders);
  };
  
  const handleMoveDown = (photo) => {
    if (!photos) return;
    
    const index = photos.findIndex(p => p._id === photo._id);
    if (index === -1 || index >= photos.length - 1) return;
    
    const newOrders = photos.map(p => ({
      id: p._id,
      order: p.order
    }));
    
    const temp = newOrders[index].order;
    newOrders[index].order = newOrders[index + 1].order;
    newOrders[index + 1].order = temp;
    
    reorderMutation.mutate(newOrders);
  };
  
  // Redirect non-admin users
  if (!authLoading && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-min">
          <h2 className="text-xl font-semibold mb-4">
            {editingPhoto ? 'Edit Photo' : 'Upload New Photo'}
          </h2>
          
          {editingPhoto ? (
            <>
              <PhotoUploadForm 
                onSubmit={handleUpdate} 
                initialData={editingPhoto}
                submitLabel="Update Photo"
              />
              
              <button 
                onClick={() => setEditingPhoto(null)}
                className="mt-4 w-full btn btn-secondary"
              >
                Cancel Editing
              </button>
            </>
          ) : (
            <PhotoUploadForm onSubmit={handleUpload} />
          )}
          
          {isUploading && (
            <div className="mt-4 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ea5e9]"></div>
              <p className="mt-2 text-sm text-gray-600">
                {editingPhoto ? 'Updating...' : 'Uploading...'}
              </p>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Manage Photos</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0ea5e9]"></div>
              <p className="mt-2 text-gray-600">Loading photos...</p>
            </div>
          ) : !photos || photos.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No photos uploaded yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map(photo => (
                <AdminPhotoCard
                  key={photo._id}
                  photo={photo}
                  onEdit={() => setEditingPhoto(photo)}
                  onDelete={handleDelete}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;