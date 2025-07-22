const Upload = require('../models/Upload');

exports.uploadFile = async (req, res) => {
  try {
    console.log("📥 Upload request received");

    const { type, title, description } = req.body;
    const file = req.file;

    if (!file) {
      console.log("❌ No file received");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log("📁 File info:", file);
    console.log("📌 User:", req.user);
    console.log("📝 Title:", title, "| Type:", type, "| Description:", description);

    const newUpload = new Upload({
      user: req.user.id,
      type,
      url: file.path,
      title,
      description,
    });

    await newUpload.save();
    console.log("✅ Upload saved to DB");

    res.status(201).json({ message: 'Uploaded successfully', upload: newUpload });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
