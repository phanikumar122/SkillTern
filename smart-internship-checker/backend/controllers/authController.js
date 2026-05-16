const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const { generateToken } = require('../middleware/auth');

/**
 * @desc    Register a new user (student, company, or admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        const { email, password, role, profileData } = req.body;

        // Validation
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, password, and role'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            role
        });

        // Create role-specific profile
        if (role === 'student' && profileData) {
            const studentData = {
                userId: user._id,
                email: email,
                name: profileData.name || '',
                phone: profileData.phone || '',
                college: profileData.college || '',
                degree: profileData.degree || '',
                skills: profileData.skills || []
            };

            // Only include year and cgpa if they are provided and valid
            if (profileData.year && profileData.year > 0) {
                studentData.year = profileData.year;
            }
            if (profileData.cgpa && profileData.cgpa >= 0) {
                studentData.cgpa = profileData.cgpa;
            }

            await Student.create(studentData);
        } else if (role === 'company' && profileData) {
            await Company.create({
                userId: user._id,
                companyName: profileData.companyName || '',
                contactEmail: email,
                industry: profileData.industry || '',
                location: profileData.location || '',
                contactPerson: profileData.contactPerson || ''
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user (include password field)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
