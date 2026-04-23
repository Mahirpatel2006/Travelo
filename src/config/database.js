const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = true;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Only log queries in development
    mongoose.set('debug', process.env.NODE_ENV === 'development');
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`);
    // DO NOT use process.exit(1) in serverless environments like Vercel
    // Throw the error so the request handler can catch it or Vercel can report it properly
    throw err;
  }
};

module.exports = connectDB;