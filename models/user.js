const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    _id: {
        type: String,
    },
    mobileNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,  
    },
    Date : {
        type: String,
        default: Date.now
    },
    loggedIn: {
        type: Boolean,
    },
    extra1: {
        type: String
    },
    extra2: {
        type: String
    },
    extra3: {
        type: String
    },
    extra4: {
        type: String
    },
    extra5: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);