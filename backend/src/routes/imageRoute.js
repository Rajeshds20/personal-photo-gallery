const router = require('express').Router();
const userAuth = require('../middleware/userAuth');
const { imageUpload, uploadImage, getImage, deleteImage, getImagesofUser } = require('../controllers/imageController');

// Route to upload an image
router.post('/upload', userAuth, imageUpload.single('image'), uploadImage);

// Route to get a specific image by ID
router.get('/:id', userAuth, getImage);

// Route to delete a specific image by ID
router.delete('/:id', userAuth, deleteImage);

// Route to get all images for the authenticated user
router.get('/', userAuth, getImagesofUser);

module.exports = router;