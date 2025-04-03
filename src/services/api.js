import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Photo Services
export const fetchPhotos = async () => {
  const response = await axios.get(`${API_URL}/photos`);
  return response.data;
};

export const fetchPhotoById = async (id) => {
  const response = await axios.get(`${API_URL}/photos/${id}`);
  return response.data;
};

export const createPhoto = async (photoData) => {
  const formData = new FormData();
  
  if (photoData.image) {
    formData.append('image', photoData.image);
  }
  
  if (photoData.title) {
    formData.append('title', photoData.title);
  }
  
  if (photoData.description) {
    formData.append('description', photoData.description);
  }
  
  if (photoData.order !== undefined) {
    formData.append('order', photoData.order);
  }
  
  const response = await axios.post(`${API_URL}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const updatePhoto = async (id, photoData) => {
  const formData = new FormData();
  
  if (photoData.image) {
    formData.append('image', photoData.image);
  }
  
  if (photoData.title) {
    formData.append('title', photoData.title);
  }
  
  if (photoData.description) {
    formData.append('description', photoData.description);
  }
  
  if (photoData.order !== undefined) {
    formData.append('order', photoData.order);
  }
  
  const response = await axios.put(`${API_URL}/photos/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const deletePhoto = async (id) => {
  const response = await axios.delete(`${API_URL}/photos/${id}`);
  return response.data;
};

export const reorderPhotos = async (photoOrders) => {
  const response = await axios.post(`${API_URL}/photos/reorder`, { photoOrders });
  return response.data;
};