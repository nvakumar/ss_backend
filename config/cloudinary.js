const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Configure cloudinary with working credentials
cloudinary.config({
  cloud_name: 'dql7ybp9n',
  api_key: '773238976147838',
  api_secret: 'OkFkH2pgPuKJbVqmTbA9DxybQbE',
});

// ✅ Define storage settings for multer using cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ss_uploads',               // ✅ Folder confirmed working
    resource_type: 'auto',              // ✅ Handles image, video, PDF etc.
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

module.exports = { cloudinary, storage };
