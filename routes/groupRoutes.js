const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createGroup, joinGroup, getAllGroups } = require('../controllers/groupController');

router.post('/create', auth, createGroup);
router.post('/join/:groupId', auth, joinGroup);
router.get('/', getAllGroups);

module.exports = router;
