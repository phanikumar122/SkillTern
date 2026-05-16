const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    college: {
        type: String,
        trim: true
    },
    degree: {
        type: String,
        trim: true
    },
    year: {
        type: Number,
        min: 1,
        max: 5
    },
    cgpa: {
        type: Number,
        min: 0,
        max: 10
    },
    skills: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    preferences: {
        locations: [{
            type: String,
            trim: true
        }],
        domains: [{
            type: String,
            trim: true
        }],
        internshipType: {
            type: String,
            enum: ['full-time', 'part-time', 'remote', '']
        }
    },
    resume: {
        type: String, // URL to resume file
        default: ''
    },
    profilePicture: {
        type: String, // URL to profile picture
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamps
studentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Student', studentSchema);
