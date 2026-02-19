const jwt = require('jsonwebtoken');

// POST /api/auth/login
const login = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid password' });
    }
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, message: 'Login successful' });
};

// GET /api/auth/verify
const verify = (req, res) => {
    res.json({ success: true, message: 'Token is valid', admin: req.admin });
};

module.exports = { login, verify };
