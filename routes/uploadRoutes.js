// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

// Ensure the path to your Cloudinary config is correct.
// Assuming it's in a file like `../config/cloudinary.js` and exports `storage`.
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// Import all necessary controller functions.
// Make sure getMyUploads is explicitly listed here.
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this path is correct
const {
  uploadFile,
  getPublicUploads,
  getMyUploads,
  toggleVisibility,
} = require('../controllers/uploadController');

// --- Routes ---

// POST /api/uploads/upload - Route for uploading a new file
// Requires authentication and uses multer for file processing.
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

// GET /api/uploads/ - Route to get all public uploads
// This route is typically public and does not require authentication.
router.get('/', getPublicUploads);

// GET /api/uploads/mine - Route to get uploads for the currently logged-in user
// Requires authentication to fetch user-specific uploads.
router.get('/mine', authMiddleware, getMyUploads);

// PATCH /api/uploads/:id/toggle - Route to toggle visibility of a specific upload
// Requires authentication to ensure only the owner can modify their upload.
router.patch('/:id/toggle', authMiddleware, toggleVisibility);

module.exports = router;
