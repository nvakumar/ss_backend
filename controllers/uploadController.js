const Upload = require('../models/Upload');

exports.uploadFile = async (req, res) => {
  try {
    const { type, title, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const newUpload = new Upload({
      user: req.user.id,
      type,
      url: file.path,
      title,
      description,
    });

    await newUpload.save();
    res.status(201).json({ message: 'Uploaded successfully', upload: newUpload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

exports.getPublicUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ isPrivate: false }).populate('user', 'name role');
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load uploads' });
  }
};

exports.getMyUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load your uploads' });
  }
};

exports.toggleVisibility = async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload || upload.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    upload.isPrivate = !upload.isPrivate;
    await upload.save();
    res.json({ message: 'Visibility updated', isPrivate: upload.isPrivate });
  } catch (err) {
    res.status(500).json({ message: 'Toggle failed' });
  }
};
