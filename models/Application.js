const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  castingCall: { type: mongoose.Schema.Types.ObjectId, ref: 'CastingCall' },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  portfolioLink: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
