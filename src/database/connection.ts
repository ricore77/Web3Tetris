import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/log';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/abstracttetris';
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`MongoDB connection error: ${error.message}`);
        } else {
            logger.error('MongoDB connection error: An unknown error occurred');
        }
        process.exit(1);
    }

    // Graceful shutdown
    mongoose.connection.on('disconnected', () => {
        logger.info('⚠️ MongoDB connection disconnected');
    });

    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('⚠️ MongoDB connection closed due to application termination');
        process.exit(0);
    });
};
