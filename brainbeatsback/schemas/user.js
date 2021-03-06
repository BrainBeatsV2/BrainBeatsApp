const mongoose = require('mongoose')
const User = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    favoritesList: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    token: {
        type: String,
        required: false,
      },
    tokenExpires: {
        type: Date,
        default: Date.now() + 86400 * 1000
    }
});

module.exports = mongoose.model('User', User, 'users');
