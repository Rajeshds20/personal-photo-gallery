const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Please enter a valid email',
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    name: {
        type: String,
        required: true,
    },
    joined: {
        type: Date,
        default: Date.now,
    },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Image'
        }
    ]
});

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;