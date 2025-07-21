const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['video', 'photo', 'story'], required: true },
  url: { type: String, required: true },
  title: String,
  description: String,
  isPrivate: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }, // ✅ included properly
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Upload', uploadSchema);
