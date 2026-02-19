const express = require('express');
const router = express.Router();
const { login, verify } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/verify', protect, verify);

module.exports = router;
