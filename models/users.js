const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required!"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
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
        required: [true, "Password is required!"]
    }
}, {timestamps: true});

const User = new mongoose.model('User', userSchema);
module.exports = User;