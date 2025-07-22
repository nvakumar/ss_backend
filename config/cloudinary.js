


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dql7ybp9n',
  api_key: '773238976147838',
  api_secret: 'OkFkH2pgPuKJbVqmTbA9DxybQbE',
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'stage_scout_uploads',
    resource_type: 'auto', // handles mp4, pdf, image automatically
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

module.exports = { cloudinary, storage };
