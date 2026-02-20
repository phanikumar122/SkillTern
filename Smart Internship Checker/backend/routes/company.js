const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getCompanyById
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roleAuth');

// Public route
router.get('/:id', getCompanyById);

// Protected routes (company only)
router.get('/profile/me', protect, authorize('company'), getProfile);
router.put('/profile/me', protect, authorize('company'), updateProfile);

module.exports = router;
