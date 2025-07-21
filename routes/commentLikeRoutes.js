const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  addComment,
  getComments,
  toggleLike,
  getLikesCount,
} = require('../controllers/commentLikeController');

router.post('/:uploadId/comments', auth, addComment);
router.get('/:uploadId/comments', getComments);

router.post('/:uploadId/like', auth, toggleLike);
router.get('/:uploadId/likes', getLikesCount);

module.exports = router;
