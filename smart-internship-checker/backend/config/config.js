const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/internship-matching',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
