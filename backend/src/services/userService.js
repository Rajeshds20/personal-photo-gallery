const User = require('../models/User');

const bcrypt = require('bcrypt');

const userAuth = require('../middleware/userAuth');

const createNewUser = async (name, email, password) => {
    try {
        const user = new User({ name, email, password });
        await user.save();
        return user;
    }
    catch (e) {
        throw new Error(e.message);
    }
};

const findUserbyEmail = async function (email) {
    try {
        const user = await User.findOne({ email });
        return user;
    }
    catch (e) {
        throw new Error(e.message);
    }
};

const findUserbyId = async function (id) {
    try {
        const user = await User.findOne({ _id: id });
        return user;
    }
    catch (e) {
        throw new Error(e.message);
    }
};

module.exports = {
    createNewUser,
    findUserbyEmail,
    findUserbyId
};