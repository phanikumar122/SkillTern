const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending'
    },
    matchPercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    coverLetter: {
        type: String,
        trim: true
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

// Update timestamps
applicationSchema.pre('save', function (next) {
    this.updatedDate = Date.now();
    next();
});

module.exports = mongoose.model('Application', applicationSchema);
