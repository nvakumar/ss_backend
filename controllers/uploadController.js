// controllers/uploadController.js
const Upload = require('../models/Upload'); // Import your Mongoose Upload model
const cloudinary = require('cloudinary').v2; // Import Cloudinary SDK
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Import Multer Cloudinary Storage

// Initialize Cloudinary configuration
// IMPORTANT: Ensure these are loaded from environment variables (e.g., .env file)
// and match your Render deployment environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
// This tells Multer to send files directly to Cloudinary.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stage_scout_uploads', // Folder name in your Cloudinary account
    resource_type: 'auto', // Automatically detect file type (image, video, raw/pdf)
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique public ID for the uploaded file
  },
});

// --- Controller Functions ---

/**
 * @desc    Upload a new file (photo, video, story/pdf)
 * @route   POST /api/uploads/upload
 * @access  Private (requires JWT authentication)
 */
exports.uploadFile = async (req, res) => {
  try {
    const { type, title, description } = req.body;
    const file = req.file; // Multer (with CloudinaryStorage) populates req.file after upload

    // Check if a file was actually uploaded by Multer
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded. Please select a file.' });
    }

    // Create a new Upload document in MongoDB
    const newUpload = new Upload({
      user: req.user.id, // User ID comes from the authenticated JWT payload
      type, // 'photo', 'video', or 'story' (must match Mongoose enum)
      url: file.path, // Cloudinary URL provided by multer-storage-cloudinary
      title,
      description,
    });

    await newUpload.save(); // Save the document to MongoDB

    res.status(201).json({ message: 'Uploaded successfully', upload: newUpload });
  } catch (err) {
    console.error('Upload File Error:', err); // Log the full error for debugging
    res.status(500).json({ message: 'Upload failed', error: err.message }); // Send specific error message
  }
};

/**
 * @desc    Get all public uploads
 * @route   GET /api/uploads/
 * @access  Public
 */
exports.getPublicUploads = async (req, res) => {
  try {
    // Find all uploads that are not private.
    // Populate the 'user' field to get uploader's name, role, and location for the frontend.
    const uploads = await Upload.find({ isPrivate: false }).populate('user', 'name role location');
    res.json(uploads);
  } catch (err) {
    console.error('Error fetching public uploads:', err);
    res.status(500).json({ message: 'Failed to load public uploads', error: err.message });
  }
};

/**
 * @desc    Get uploads for the currently logged-in user
 * @route   GET /api/uploads/mine
 * @access  Private (requires JWT authentication)
 */
exports.getMyUploads = async (req, res) => {
  try {
    // Find uploads where the 'user' field matches the authenticated user's ID.
    // Populate the 'user' field to get uploader's name, role, and location for the frontend.
    const uploads = await Upload.find({ user: req.user.id }).populate('user', 'name role location');
    res.json(uploads);
  } catch (err) {
    console.error('Error fetching user uploads:', err);
    res.status(500).json({ message: 'Failed to load your uploads', error: err.message });
  }
};

/**
 * @desc    Toggle visibility (public/private) of a specific upload
 * @route   PATCH /api/uploads/:id/toggle
 * @access  Private (requires JWT authentication, only owner can toggle)
 */
exports.toggleVisibility = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    // Check if the upload exists and if the authenticated user is the owner
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }
    if (upload.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to toggle this upload' });
    }

    upload.isPrivate = !upload.isPrivate; // Toggle the boolean value
    await upload.save(); // Save the updated document

    res.json({ message: 'Visibility updated successfully', isPrivate: upload.isPrivate });
  } catch (err) {
    console.error('Toggle Visibility Error:', err);
    res.status(500).json({ message: 'Failed to toggle visibility', error: err.message });
  }
};

// --- Export all necessary components for use in routes ---
module.exports = {
  storage, // Export Multer storage configured with Cloudinary
  uploadFile: exports.uploadFile,
  getPublicUploads: exports.getPublicUploads,
  getMyUploads: exports.getMyUploads,
  toggleVisibility: exports.toggleVisibility,
};
