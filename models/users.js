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
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'],
        default: 'user',
        required: true
    },
    img: {
        type: String,
        default: "https://letmestudyhere.files.wordpress.com/2021/11/dodger-blue_035032206.jpg"
    },
    password: {
        type: String,
        minlength: [8, 'Password length needs to be at least 8!'],
        required: [true, "Password is required!"]
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(username, password){
    const user = await this.findOne({ username });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }else{
            throw Error('Password is incorrect!')
        }
    }else{
        throw Error('Username is incorrect!')
    }
}

const User = new mongoose.model('User', userSchema);
module.exports = User;