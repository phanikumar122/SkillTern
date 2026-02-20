const Company = require('../models/Company');
const User = require('../models/User');

/**
 * @desc    Get company profile
 * @route   GET /api/company/profile
 * @access  Private (Company)
 */
exports.getProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user.id });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company profile not found'
            });
        }

        res.status(200).json({
            success: true,
            company
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
 * @desc    Update company profile
 * @route   PUT /api/company/profile
 * @access  Private (Company)
 */
exports.updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Don't allow updating userId
        delete updateData.userId;

        let company = await Company.findOne({ userId: req.user.id });

        if (!company) {
            // Create new company profile if doesn't exist
            company = await Company.create({
                userId: req.user.id,
                contactEmail: req.user.email,
                ...updateData
            });
        } else {
            // Update existing profile
            company = await Company.findOneAndUpdate(
                { userId: req.user.id },
                updateData,
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            company
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
 * @desc    Get company by ID (public info)
 * @route   GET /api/company/:id
 * @access  Public
 */
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching company',
            error: error.message
        });
    }
};
