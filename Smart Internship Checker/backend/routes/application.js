const express = require('express');
const router = express.Router();
const {
    applyToInternship,
    getMyApplications,
    getInternshipApplications,
    getCompanyApplications,
    updateApplicationStatus,
    withdrawApplication
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roleAuth');

// Student routes
router.post('/apply', protect, authorize('student'), applyToInternship);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.put('/:id/withdraw', protect, authorize('student'), withdrawApplication);

// Company routes
router.get('/internship/:internshipId', protect, authorize('company'), getInternshipApplications);
router.get('/company-applications', protect, authorize('company'), getCompanyApplications);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus);

module.exports = router;
