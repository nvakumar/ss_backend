const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const authMiddleware = require('../middleware/authMiddleware');
const {
  uploadFile,
  getPublicUploads,
  getMyUploads,
  toggleVisibility,
} = require('../controllers/uploadController');

router.post('/upload', authMiddleware, upload.single('file'), uploadFile);
router.get('/', getPublicUploads);
router.get('/mine', authMiddleware, getMyUploads);
router.patch('/:id/toggle', authMiddleware, toggleVisibility);

module.exports = router;
