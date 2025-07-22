const Upload = require('../models/Upload');

exports.uploadFile = async (req, res) => {
  try {
    const { type, title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create new upload entry
    const newUpload = new Upload({
      user: req.user?.id || req.user?._id, // Fallback for decoded JWT user
      type,
      url: file.path, // Cloudinary or local path
      title,
      description,
    });

    await newUpload.save();

    res.status(201).json({
      message: 'Uploaded successfully',
      upload: newUpload
    });
  } catch (err) {
    console.error('❌ Upload Error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getPublicUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ isPrivate: false })
      .populate('user', 'name role');

    res.status(200).json(uploads);
  } catch (err) {
    console.error('❌ Public Uploads Fetch Error:', err);
    res.status(500).json({ message: 'Failed to load uploads' });
  }
};

exports.getMyUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user?.id || req.user?._id });

    res.status(200).json(uploads);
  } catch (err) {
    console.error('❌ My Uploads Fetch Error:', err);
    res.status(500).json({ message: 'Failed to load your uploads' });
  }
};

exports.toggleVisibility = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    if (upload.user.toString() !== (req.user?.id || req.user?._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    upload.isPrivate = !upload.isPrivate;
    await upload.save();

    res.status(200).json({
      message: 'Visibility updated',
      isPrivate: upload.isPrivate
    });
  } catch (err) {
    console.error('❌ Toggle Visibility Error:', err);
    res.status(500).json({ message: 'Toggle failed' });
  }
};
