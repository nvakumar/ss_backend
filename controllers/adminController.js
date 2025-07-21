const Report = require('../models/Report');
const Upload = require('../models/Upload');
const User = require('../models/User');

exports.getReports = async (req, res) => {
  const reports = await Report.find({}).populate('reporter upload');
  res.json(reports);
};

exports.approveStoryAccess = async (req, res) => {
  const upload = await Upload.findById(req.params.uploadId);
  if (!upload) return res.status(404).json({ message: 'Upload not found' });

  upload.storyApproved = true;
  await upload.save();
  res.json({ message: 'Story/PDF access approved' });
};

exports.blockUpload = async (req, res) => {
  const upload = await Upload.findById(req.params.uploadId);
  if (!upload) return res.status(404).json({ message: 'Upload not found' });

  upload.isBlocked = true;
  await upload.save();
  res.json({ message: 'Upload blocked' });
};

exports.blockUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isBlocked = true;
  await user.save();
  res.json({ message: 'User blocked' });
};
