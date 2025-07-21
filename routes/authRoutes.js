const express = require('express');
const router = express.Router();

// Import middleware & controller functions
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, updateProfile } = require('../controllers/authController');

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route (JWT required)
router.put('/update', authMiddleware, updateProfile);

module.exports = router;
