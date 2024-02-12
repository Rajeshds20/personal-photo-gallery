const multer = require('multer');
const sharp = require('sharp');
const { findImageById, createNewImage, deleteImagebyId, findImagesbyUserId } = require('../services/imageService');

const imageUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

const uploadImage = async (req, res) => {
    try {
        // Ensure if the user has <10 images uploaded
        if (req.user.images?.length >= 10) {
            return res.status(400).json({ message: "You have reached the maximum limit of 10 images" });
        }
        const buffer = await sharp(req.file.buffer).resize({ width: 450, height: 450, fit: 'inside' }).png().toBuffer();
        const { width, height, size } = await sharp(buffer).metadata();
        // console.log(width, height, size);
        const newImage = await createNewImage(req.user._id, buffer, req.file.mimetype, req.file.originalname, req.body.description, size);
        // Update the images array in the user model
        req.user.images = req.user.images?.concat(newImage._id);
        await req.user.save();
        res.status(201).json({ message: "Image uploaded successfully", image: newImage });
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
};

const getImage = async (req, res) => {
    try {
        const image = await findImageById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        // Verify User as owner of the image
        if (image.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.set('Content-Type', image.contentType);
        res.send(image.data);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
};

const deleteImage = async (req, res) => {
    try {
        const image = await deleteImagebyId(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        // Verify User as owner of the image
        if (image.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Update the user images array
        req.user.images = req.user.images.filter((id) => id.toString() !== req.params.id);
        await req.user.save();
        res.status(200).json({ message: "Image deleted successfully", image });
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await findImagesbyUserId(req.user._id);
        res.status(200).json({ images });
    }
    catch (e) {
        console.log(e.message);
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    imageUpload,
    uploadImage,
    getImage,
    deleteImage,
    getImages
};
