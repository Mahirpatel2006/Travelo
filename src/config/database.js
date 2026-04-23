const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    // Only log queries in development
    mongoose.set('debug', process.env.NODE_ENV === 'development');
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`);
    process.exit(1); // Exit process on DB failure
  }
};

module.exports = connectDB;