const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
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

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = new mongoose.model('User', userSchema);
module.exports = User;