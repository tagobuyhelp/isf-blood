import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true, // Build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
    try {
        const rawUri = process.env.MONGODB_URI;
        const fallbackDevUri = 'mongodb://127.0.0.1:27017/isf-blood';
        const uri = rawUri && /^mongodb(\+srv)?:\/\/.+/i.test(rawUri)
            ? rawUri
            : (process.env.NODE_ENV === 'development' ? fallbackDevUri : rawUri);

        if (!uri || !/^mongodb(\+srv)?:\/\/.+/i.test(uri)) {
            console.error('Invalid or missing MONGODB_URI. Set a valid connection string (e.g., mongodb://127.0.0.1:27017/isf-blood or mongodb+srv://user:pass@cluster.example.mongodb.net/dbname)');
            process.exit(1);
        }

        const conn = await mongoose.connect(uri, options);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // If Node process ends, close the MongoDB connection
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        console.error('Check that your MONGODB_URI is correct and reachable.');
        process.exit(1);
    }
};

export default connectDB;