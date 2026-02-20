const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Internship title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    requiredSkills: [{
        type: String,
        trim: true,
        lowercase: true,
        required: true
    }],
    optionalSkills: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    location: {
        type: String,
        trim: true
    },
    internshipType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote'],
        default: 'full-time'
    },
    duration: {
        type: String,
        trim: true
    },
    stipend: {
        type: Number,
        default: 0
    },
    eligibility: {
        minCGPA: {
            type: Number,
            default: 0,
            min: 0,
            max: 10
        },
        degrees: [{
            type: String,
            trim: true
        }],
        years: [{
            type: Number,
            min: 1,
            max: 5
        }]
    },
    responsibilities: [{
        type: String,
        trim: true
    }],
    perks: [{
        type: String,
        trim: true
    }],
    openings: {
        type: Number,
        default: 1,
        min: 0
    },
    applicationDeadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    },
    postedDate: {
        type: Date,
        default: Date.now
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
internshipSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Internship', internshipSchema);
