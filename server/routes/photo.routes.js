const express = require('express');
const photoController = require('../controllers/photo.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

// Public routes
router.get('/', photoController.getAllPhotos);
router.get('/:id', photoController.getPhotoById);

// Admin routes
router.post('/', authenticate, isAdmin, upload.single('image'), photoController.createPhoto);
router.put('/:id', authenticate, isAdmin, upload.single('image'), photoController.updatePhoto);
router.delete('/:id', authenticate, isAdmin, photoController.deletePhoto);
router.post('/reorder', authenticate, isAdmin, photoController.reorderPhotos);

module.exports = router;