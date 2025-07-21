const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  upload: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

likeSchema.index({ upload: 1, user: 1 }, { unique: true }); // Prevent duplicate likes

module.exports = mongoose.model('Like', likeSchema);
