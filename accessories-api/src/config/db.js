const mongoose = require('mongoose');

const connectDB = async () => {
    // Render often sets MONGODB_URI; we support both names
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        console.error('❌ No MongoDB connection string found in environment variables.');
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
