const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin'); // Check if user is admin
const {
  getReports,
  approveStoryAccess,
  blockUpload,
  blockUser
} = require('../controllers/adminController');

router.get('/reports', auth, isAdmin, getReports);
router.put('/approve-pdf/:uploadId', auth, isAdmin, approveStoryAccess);
router.put('/block-upload/:uploadId', auth, isAdmin, blockUpload);
router.put('/block-user/:userId', auth, isAdmin, blockUser);

module.exports = router;
