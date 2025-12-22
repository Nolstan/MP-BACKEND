const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: [true, 'Please add a business name'],
        trim: true,
    },
    ownerName: {
        type: String,
        required: [true, 'Please add an owner name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    location: {
        type: String,
        required: [true, 'Please add a location'],
    },
    contactInfo: {
        type: String,
        required: [true, 'Please add contact information'],
    },
    logo: String,
    bio: String,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Encrypt password using bcrypt
// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing from environment variables. Please check your .env file.');
    }
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
