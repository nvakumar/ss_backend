const express = require('express');
const router = express.Router();

// Import middleware & controller functions
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, updateProfile, getMe } = require('../controllers/authController'); // <<< ADD 'getMe' here

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Routes (JWT required)
router.put('/update', authMiddleware, updateProfile);

// --- ADD THIS NEW ROUTE ---
// Route to get the currently logged-in user's profile
router.get('/me', authMiddleware, getMe); // <<< THIS IS THE MISSING ROUTE
// --- END NEW ROUTE ---

module.exports = router;
