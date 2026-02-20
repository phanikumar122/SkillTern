const Application = require('../models/Application');
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Company = require('../models/Company');
const { calculateMatch } = require('./matchingController');

/**
 * @desc    Apply to an internship
 * @route   POST /api/application/apply
 * @access  Private (Student)
 */
exports.applyToInternship = async (req, res) => {
    try {
        const { internshipId, coverLetter } = req.body;

        if (!internshipId) {
            return res.status(400).json({
                success: false,
                message: 'Internship ID is required'
            });
        }

        // Get student profile
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        // Get internship
        const internship = await Internship.findById(internshipId);

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        // Check if internship is active
        if (internship.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This internship is not currently accepting applications'
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            studentId: student._id,
            internshipId: internshipId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this internship'
            });
        }

        // Calculate match percentage
        const matchResult = calculateMatch(student, internship);

        // Create application
        const application = await Application.create({
            internshipId,
            studentId: student._id,
            companyId: internship.companyId,
            coverLetter: coverLetter || '',
            matchPercentage: matchResult.percentage,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });
    } catch (error) {
        // Handle duplicate application error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this internship'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

/**
 * @desc    Get student's own applications
 * @route   GET /api/application/my-applications
 * @access  Private (Student)
 */
exports.getMyApplications = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        const applications = await Application.find({ studentId: student._id })
            .populate('internshipId')
            .populate('companyId', 'companyName location logo')
            .sort({ appliedDate: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

/**
 * @desc    Get applications for a specific internship (Company view)
 * @route   GET /api/application/internship/:internshipId
 * @access  Private (Company)
 */
exports.getInternshipApplications = async (req, res) => {
    try {
        const { internshipId } = req.params;

        // Verify ownership
        const company = await Company.findOne({ userId: req.user.id });
        const internship = await Internship.findById(internshipId);

        if (!company || !internship) {
            return res.status(404).json({
                success: false,
                message: 'Company or internship not found'
            });
        }

        if (internship.companyId.toString() !== company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view applications for this internship'
            });
        }

        const applications = await Application.find({ internshipId })
            .populate('studentId')
            .sort({ appliedDate: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

/**
 * @desc    Get all applications for company
 * @route   GET /api/application/company-applications
 * @access  Private (Company)
 */
exports.getCompanyApplications = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user.id });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company profile not found'
            });
        }

        const applications = await Application.find({ companyId: company._id })
            .populate('studentId')
            .populate('internshipId')
            .sort({ appliedDate: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

/**
 * @desc    Update application status (Accept/Reject)
 * @route   PUT /api/application/:id/status
 * @access  Private (Company)
 */
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: accepted, rejected, or pending'
            });
        }

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify company owns this application
        const company = await Company.findOne({ userId: req.user.id });

        if (!company || application.companyId.toString() !== company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        application.status = status;
        await application.save();

        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
};

/**
 * @desc    Withdraw application (Student)
 * @route   PUT /api/application/:id/withdraw
 * @access  Private (Student)
 */
exports.withdrawApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Verify student owns this application
        const student = await Student.findOne({ userId: req.user.id });

        if (!student || application.studentId.toString() !== student._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to withdraw this application'
            });
        }

        application.status = 'withdrawn';
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully',
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error withdrawing application',
            error: error.message
        });
    }
};
