const mongoose = require('mongoose');

const castingCallSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  role: { type: String, required: true }, // e.g., Actor, Editor
  location: { type: String },
  requiredSkills: [String],
  language: String,
  deadline: Date,
  isApproved: { type: Boolean, default: false },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CastingCall', castingCallSchema);
