import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPhotos } from '../services/api';
import PhotoGrid from '../components/PhotoGrid';

const HomePage = () => {
  const { data: photos, isLoading, error } = useQuery({
    queryKey: ['photos'],
    queryFn: fetchPhotos
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0ea5e9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Photos</h2>
          <p className="text-gray-700">
            {error.message || 'Something went wrong. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Photos Yet</h2>
          <p className="text-gray-600">
            Check back later for beautiful photos in our gallery!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Photo Gallery</h1>
        <p className="text-gray-600 mt-2">Explore our collection of beautiful photos</p>
      </div>

      <PhotoGrid photos={photos} />
    </div>
  );
};

export default HomePage;
