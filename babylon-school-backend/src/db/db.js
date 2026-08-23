const mongoose = require('mongoose');

async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.warn('MONGO_URI not set — skipping MongoDB connection (dev mode)');
            return;
        }

        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;