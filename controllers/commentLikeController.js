const Comment = require('../models/Comment');
const Like = require('../models/Like');
const createNotification = require('../utils/createNotification');

// Add a comment to an upload
exports.addComment = async (req, res) => {
  try {
    const comment = new Comment({
      upload: req.params.uploadId,
      user: req.user.id,
      text: req.body.text,
    });
    await comment.save();

    // Optional: Notify upload owner (if you pass owner ID in req.body.uploadOwnerId)
    if (req.body.uploadOwnerId && req.body.uploadOwnerId !== req.user.id) {
      await createNotification(req.body.uploadOwnerId, 'New comment on your upload', `/video/${req.params.uploadId}`);
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

// Fetch all comments for an upload
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ upload: req.params.uploadId })
      .populate('user', 'name role')
      .populate('replies.user', 'name role');
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Add reply to a comment
exports.addReply = async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.replies.push({ user: req.user.id, text });
    await comment.save();

    // Notify original commenter
    if (comment.user.toString() !== req.user.id) {
      await createNotification(comment.user, 'Someone replied to your comment', `/video/${comment.upload}`);
    }

    res.status(200).json({ message: 'Reply added', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Reply failed' });
  }
};

// Toggle like/unlike on an upload
exports.toggleLike = async (req, res) => {
  try {
    const existing = await Like.findOne({ upload: req.params.uploadId, user: req.user.id });
    if (existing) {
      await existing.deleteOne();
      return res.json({ message: 'Unliked' });
    } else {
      const like = new Like({ upload: req.params.uploadId, user: req.user.id });
      await like.save();

      // Optional: Notify upload owner (if you pass uploadOwnerId)
      if (req.body.uploadOwnerId && req.body.uploadOwnerId !== req.user.id) {
        await createNotification(req.body.uploadOwnerId, 'Someone liked your upload', `/video/${req.params.uploadId}`);
      }

      return res.status(201).json({ message: 'Liked' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to like/unlike' });
  }
};

// Get like count on an upload
exports.getLikesCount = async (req, res) => {
  try {
    const count = await Like.countDocuments({ upload: req.params.uploadId });
    res.json({ likes: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to get likes' });
  }
};
