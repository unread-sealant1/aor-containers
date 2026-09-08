import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Missing MONGODB_URI in environment variables');
}

async function connectDB() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected successfully to MongoDB via Mongoose');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Initialize connection
connectDB();

export { connectDB };

export const getDb = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database not initialized. Mongoose connection not established.');
  }
  return db;
};
