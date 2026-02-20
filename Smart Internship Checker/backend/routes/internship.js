const express = require('express');
const router = express.Router();
const {
    createInternship,
    getAllInternships,
    getInternshipById,
    updateInternship,
    deleteInternship,
    getMyInternships
} = require('../controllers/internshipController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roleAuth');

// Public routes
router.get('/', getAllInternships);
router.get('/:id', getInternshipById);

// Protected routes (company only)
router.post('/', protect, authorize('company'), createInternship);
router.put('/:id', protect, authorize('company'), updateInternship);
router.delete('/:id', protect, authorize('company'), deleteInternship);
router.get('/my/internships', protect, authorize('company'), getMyInternships);

module.exports = router;
