const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    img: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = new mongoose.model('User', userSchema);
module.exports = User;