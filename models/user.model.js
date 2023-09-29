const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!']
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!']
    },
    token: {
        type: String
    }
}, { timestamps: true });

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;