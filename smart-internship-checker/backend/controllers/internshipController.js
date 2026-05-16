const Internship = require('../models/Internship');
const Company = require('../models/Company');

/**
 * @desc    Create a new internship
 * @route   POST /api/internship
 * @access  Private (Company)
 */
exports.createInternship = async (req, res) => {
    try {
        // Get company profile
        const company = await Company.findOne({ userId: req.user.id });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company profile not found. Please create your profile first.'
            });
        }

        // Normalize required skills to lowercase
        if (req.body.requiredSkills && Array.isArray(req.body.requiredSkills)) {
            req.body.requiredSkills = req.body.requiredSkills.map(skill => skill.toLowerCase().trim());
        }

        // Normalize optional skills to lowercase
        if (req.body.optionalSkills && Array.isArray(req.body.optionalSkills)) {
            req.body.optionalSkills = req.body.optionalSkills.map(skill => skill.toLowerCase().trim());
        }

        const internship = await Internship.create({
            companyId: company._id,
            ...req.body
        });

        res.status(201).json({
            success: true,
            message: 'Internship created successfully',
            internship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating internship',
            error: error.message
        });
    }
};

/**
 * @desc    Get all internships (with filters)
 * @route   GET /api/internship
 * @access  Public
 */
exports.getAllInternships = async (req, res) => {
    try {
        const { status, location, internshipType, companyId } = req.query;

        // Build query
        let query = {};

        if (status) {
            query.status = status;
        } else {
            // Default to active internships only
            query.status = 'active';
        }

        if (location) {
            query.location = new RegExp(location, 'i');
        }

        if (internshipType) {
            query.internshipType = internshipType;
        }

        if (companyId) {
            query.companyId = companyId;
        }

        const internships = await Internship.find(query)
            .populate('companyId', 'companyName location industry logo')
            .sort({ postedDate: -1 });

        res.status(200).json({
            success: true,
            count: internships.length,
            internships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching internships',
            error: error.message
        });
    }
};

/**
 * @desc    Get single internship by ID
 * @route   GET /api/internship/:id
 * @access  Public
 */
exports.getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id)
            .populate('companyId', 'companyName location industry website description logo contactEmail');

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        res.status(200).json({
            success: true,
            internship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching internship',
            error: error.message
        });
    }
};

/**
 * @desc    Update internship
 * @route   PUT /api/internship/:id
 * @access  Private (Company - owner only)
 */
exports.updateInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        // Check if user owns this internship
        const company = await Company.findOne({ userId: req.user.id });
        if (!company || internship.companyId.toString() !== company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this internship'
            });
        }

        // Normalize skills if provided
        if (req.body.requiredSkills && Array.isArray(req.body.requiredSkills)) {
            req.body.requiredSkills = req.body.requiredSkills.map(skill => skill.toLowerCase().trim());
        }

        if (req.body.optionalSkills && Array.isArray(req.body.optionalSkills)) {
            req.body.optionalSkills = req.body.optionalSkills.map(skill => skill.toLowerCase().trim());
        }

        const updatedInternship = await Internship.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Internship updated successfully',
            internship: updatedInternship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating internship',
            error: error.message
        });
    }
};

/**
 * @desc    Delete internship
 * @route   DELETE /api/internship/:id
 * @access  Private (Company - owner only)
 */
exports.deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        // Check if user owns this internship
        const company = await Company.findOne({ userId: req.user.id });
        if (!company || internship.companyId.toString() !== company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this internship'
            });
        }

        await Internship.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Internship deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting internship',
            error: error.message
        });
    }
};

/**
 * @desc    Get company's own internships
 * @route   GET /api/internship/my-internships
 * @access  Private (Company)
 */
exports.getMyInternships = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user.id });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company profile not found'
            });
        }

        const internships = await Internship.find({ companyId: company._id })
            .sort({ postedDate: -1 });

        res.status(200).json({
            success: true,
            count: internships.length,
            internships
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching internships',
            error: error.message
        });
    }
};
