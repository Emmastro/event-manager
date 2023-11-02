const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['alumni', 'admin'],
        required: false,
        default: 'alumni',
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    graduationYear: {
        type: Number,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false
    },    

});

const User = mongoose.model('User', userSchema);
module.exports = User;
