const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createNewUser, findUserbyEmail, findUserbyId } = require('../services/userService');

const newUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await findUserbyEmail(email);
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createNewUser(name, email, hashedPassword);
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('authToken', token, {
            httpOnly: true
        });
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        const user = await findUserbyEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('authToken', token, {
            httpOnly: true
        });
        res.status(200).json({ message: "User logged in successfully", user });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('authToken');
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const getUser = async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = {
    newUser,
    loginUser,
    logoutUser,
    getUser
};
