const express = require('express');
const router = express.Router();

// Import middleware & controller functions
// Ensure ALL required controller functions are explicitly imported here.
// This includes: register, login, updateProfile, and getMe.
const { register, login, updateProfile, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this path is correct

// --- Public Routes ---
// Route for user registration
router.post('/register', register);
// Route for user login
router.post('/login', login);

// --- Protected Routes (JWT required for these) ---
// Route to get the currently logged-in user's profile
// This route requires authentication via authMiddleware before calling getMe.
router.get('/me', authMiddleware, getMe);

// Route to update the logged-in user's profile
// This route also requires authentication.
router.put('/update', authMiddleware, updateProfile);

module.exports = router;
