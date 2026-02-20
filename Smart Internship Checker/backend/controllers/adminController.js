const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await Student.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalInternships = await Internship.countDocuments();
        const activeInternships = await Internship.countDocuments({ status: 'active' });
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'pending' });
        const acceptedApplications = await Application.countDocuments({ status: 'accepted' });

        // Get user role breakdown
        const students = await User.countDocuments({ role: 'student' });
        const companies = await User.countDocuments({ role: 'company' });
        const admins = await User.countDocuments({ role: 'admin' });

        res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    students,
                    companies,
                    admins
                },
                profiles: {
                    students: totalStudents,
                    companies: totalCompanies
                },
                internships: {
                    total: totalInternships,
                    active: activeInternships,
                    closed: totalInternships - activeInternships
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications,
                    accepted: acceptedApplications,
                    rejected: totalApplications - pendingApplications - acceptedApplications
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

/**
 * @desc    Get all internships (Admin view)
 * @route   GET /api/admin/internships
 * @access  Private (Admin)
 */
exports.getAllInternships = async (req, res) => {
    try {
        const internships = await Internship.find({})
            .populate('companyId', 'companyName contactEmail')
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
 * @desc    Delete a user (Admin only)
 * @route   DELETE /api/admin/user/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete associated profile
        if (user.role === 'student') {
            await Student.findOneAndDelete({ userId: user._id });
        } else if (user.role === 'company') {
            await Company.findOneAndDelete({ userId: user._id });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

/**
 * @desc    Update internship status (Admin moderation)
 * @route   PUT /api/admin/internship/:id/status
 * @access  Private (Admin)
 */
exports.updateInternshipStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'closed', 'draft'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const internship = await Internship.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!internship) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Internship status updated',
            internship
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating internship status',
            error: error.message
        });
    }
};
