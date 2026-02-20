const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// POST /api/upload — admin only, single image
router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
