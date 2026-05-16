const Student = require('../models/Student');
const User = require('../models/User');

/**
 * @desc    Get student profile
 * @route   GET /api/student/profile
 * @access  Private (Student)
 */
exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.status(200).json({
            success: true,
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

/**
 * @desc    Update student profile
 * @route   PUT /api/student/profile
 * @access  Private (Student)
 */
exports.updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Don't allow updating userId
        delete updateData.userId;

        let student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            // Create new student profile if doesn't exist
            student = await Student.create({
                userId: req.user.id,
                email: req.user.email,
                ...updateData
            });
        } else {
            // Update existing profile
            student = await Student.findOneAndUpdate(
                { userId: req.user.id },
                updateData,
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

/**
 * @desc    Add/Update skills
 * @route   PUT /api/student/skills
 * @access  Private (Student)
 */
exports.updateSkills = async (req, res) => {
    try {
        const { skills } = req.body;

        if (!Array.isArray(skills)) {
            return res.status(400).json({
                success: false,
                message: 'Skills must be an array'
            });
        }

        // Normalize skills to lowercase
        const normalizedSkills = skills.map(skill => skill.toLowerCase().trim());

        const student = await Student.findOneAndUpdate(
            { userId: req.user.id },
            { skills: normalizedSkills },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Skills updated successfully',
            skills: student.skills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating skills',
            error: error.message
        });
    }
};

/**
 * @desc    Update preferences
 * @route   PUT /api/student/preferences
 * @access  Private (Student)
 */
exports.updatePreferences = async (req, res) => {
    try {
        const { locations, domains, internshipType } = req.body;

        const student = await Student.findOneAndUpdate(
            { userId: req.user.id },
            {
                preferences: {
                    locations: locations || [],
                    domains: domains || [],
                    internshipType: internshipType || ''
                }
            },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            preferences: student.preferences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating preferences',
            error: error.message
        });
    }
};
