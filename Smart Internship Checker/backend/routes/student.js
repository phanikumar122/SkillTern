const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    updateSkills,
    updatePreferences
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roleAuth');

// All routes require authentication and student role
router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/skills', updateSkills);
router.put('/preferences', updatePreferences);

module.exports = router;
