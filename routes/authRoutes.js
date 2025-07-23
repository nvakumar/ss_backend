const express = require('express');
const router = express.Router();

// Import middleware & controller functions
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, updateProfile, getMe } = require('../controllers/authController'); // Make sure 'getMe' is imported

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Routes (JWT required)
// Route to get the currently logged-in user's profile
router.get('/me', authMiddleware, getMe); // This is the route the frontend was looking for
router.put('/update', authMiddleware, updateProfile);

module.exports = router;
