const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload
const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'wlo-products', resource_type: 'image' },
        (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ success: false, message: 'Image upload failed' });
            }
            res.json({ success: true, url: result.secure_url, public_id: result.public_id });
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = { uploadImage };
