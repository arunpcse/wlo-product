const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'https://*.vercel.app'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'World Line Out API is running 🚀' });
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/orders', require('./src/routes/orders'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
