const Image = require('../models/Image');

const findImageById = async (id) => {
    try {
        const image = await Image.findById(id);
        return image;
    }
    catch (e) {
        throw new Error(e.message);
    }
};

const createNewImage = async (user, data, contentType, name, description, size) => {
    try {
        const newImage = new Image({
            user,
            data,
            contentType,
            name,
            description,
            size
        });
        await newImage.save();
        return newImage;
    }
    catch (e) {
        throw new Error(e.message);
    }
};

const deleteImagebyId = async (id) => {
    try {
        const image = await Image.findByIdAndDelete(id);
        return image;
    }
    catch (e) {
        throw new Error(e.message);
    }
};

const findImagesbyUserId = async (userId) => {
    try {
        const images = await Image.find({ user: userId });
        return images;
    }
    catch (e) {
        throw new Error(e.message);
    }
};

module.exports = {
    findImageById,
    createNewImage,
    deleteImagebyId,
    findImagesbyUserId
};
