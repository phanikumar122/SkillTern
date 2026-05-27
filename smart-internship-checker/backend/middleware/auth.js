const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

/**
 * Middleware to protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Please login.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        let errorMessage = 'Not authorized, token failed';
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Your session has expired. Please login again.';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Invalid token. Please login again.';
        } else if (error.name === 'NotBeforeError') {
            errorMessage = 'Token not yet valid.';
        }
        
        return res.status(401).json({
            success: false,
            message: errorMessage
        });
    }
};

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpire
    });
};

module.exports = { protect, generateToken };
