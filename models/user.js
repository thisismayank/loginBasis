'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    phoneNumber: {
        type: Number,
        required: true
    },
    userCode:{ 
        type:String,
        required: true
    }
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    otp: Number,
    isActive: Boolean,
});

module.exports = mongoose.model('User', userSchema);