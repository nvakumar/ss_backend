const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      'Actor',
      'Director',
      'Editor',
      'Writer',
      'Musician',
      'Producer',
      'Photographer',
      'Cinematographer'
    ],
  },
  city: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  language: {
    type: String,
  },
  isBlocked: { // ✅ Correctly placed here
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
