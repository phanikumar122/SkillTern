const express = require('express');
const router = express.Router();
const {
    getMatchedInternships,
    getMatchedStudents,
    checkMatch
} = require('../controllers/matchingController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roleAuth');

// Student routes - get matched internships
router.get('/internships', protect, authorize('student'), getMatchedInternships);
router.get('/check/:internshipId', protect, authorize('student'), checkMatch);

// Company routes - get matched students for an internship
router.get('/students/:internshipId', protect, authorize('company'), getMatchedStudents);

module.exports = router;
