const Photo = require('../models/photo.model');
const fs = require('fs').promises;
const path = require('path');

exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find().sort({ order: 1, createdAt: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photo', error: error.message });
  }
};

exports.createPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const { title, description, order } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;
    
    const photo = new Photo({
      title,
      description,
      imagePath,
      order: order || 0
    });
    
    await photo.save();
    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const update = { title, description, order };
    
    if (req.file) {
      update.imagePath = `/uploads/${req.file.filename}`;
      
      // Delete old image
      const oldPhoto = await Photo.findById(req.params.id);
      if (oldPhoto && oldPhoto.imagePath) {
        const oldImagePath = path.join(__dirname, '..', oldPhoto.imagePath);
        await fs.unlink(oldImagePath).catch(err => console.log('Error deleting old image:', err));
      }
    }
    
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    res.json({
      message: 'Photo updated successfully',
      photo
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating photo', error: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    
    // Delete image file
    if (photo.imagePath) {
      const imagePath = path.join(__dirname, '..', photo.imagePath);
      await fs.unlink(imagePath).catch(err => console.log('Error deleting image file:', err));
    }
    
    await Photo.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting photo', error: error.message });
  }
};

exports.reorderPhotos = async (req, res) => {
  try {
    const { photoOrders } = req.body;
    
    if (!Array.isArray(photoOrders)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }
    
    // Update each photo's order in a transaction
    const session = await Photo.startSession();
    session.startTransaction();
    
    try {
      for (const item of photoOrders) {
        await Photo.findByIdAndUpdate(
          item.id,
          { order: item.order },
          { session }
        );
      }
      
      await session.commitTransaction();
      session.endSession();
      
      res.json({ message: 'Photos reordered successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ message: 'Error reordering photos', error: error.message });
  }
};