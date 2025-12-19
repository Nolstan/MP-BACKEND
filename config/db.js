require('dotenv').config();
const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI;

const connectDB = async () => {
    // Optimized connection string (shards + replicaSet) to bypass DNS SRV issues
    const directUri = connectionString.replace('mongodb+srv://', 'mongodb://')
        .replace('cluster0.txfjbis.mongodb.net', 'ac-uxdnu7l-shard-00-00.txfjbis.mongodb.net:27017,ac-uxdnu7l-shard-00-01.txfjbis.mongodb.net:27017,ac-uxdnu7l-shard-00-02.txfjbis.mongodb.net:27017')
        + (connectionString.includes('?') ? '&' : '?') + 'replicaSet=atlas-fqizwi-shard-0&authSource=admin&tls=true';

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(directUri, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.error('If this persists, please check your network or if your IP is whitelisted in MongoDB Atlas.');
    }
};

module.exports = connectDB;