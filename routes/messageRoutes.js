const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');

router.post('/:groupId', auth, sendMessage);
router.get('/:groupId', auth, getMessages);

module.exports = router;
