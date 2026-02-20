const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getStats,
    getAllInternships,
    deleteUser,
    updateInternshipStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/roleAuth');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/stats', getStats);
router.get('/internships', getAllInternships);
router.delete('/user/:id', deleteUser);
router.put('/internship/:id/status', updateInternshipStatus);

module.exports = router;
