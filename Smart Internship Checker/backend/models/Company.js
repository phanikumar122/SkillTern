const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '500+', '']
    },
    contactPerson: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        required: [true, 'Contact email is required'],
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true
    },
    logo: {
        type: String, // URL to logo
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
companySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Company', companySchema);
