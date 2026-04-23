const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the full error server-side
  logger.error(err.message, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  let statusCode = err.statusCode || 500;
  let message = 'Something went wrong';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  // CSRF token error
  if (err.code === 'EBADCSRFTOKEN') {
    statusCode = 403;
    message = 'Session expired. Please refresh and try again.';
  }

  // In development, show the actual error message
  if (process.env.NODE_ENV !== 'production' && err.message) {
    message = err.message;
  }

  // Determine response format
  if (req.accepts('html') && !req.xhr) {
    // Browser request — render error page
    return res.status(statusCode).render('pages/404', {
      title: `Error ${statusCode} | Travelo`,
      errorMessage: message,
      statusCode,
    });
  }

  // API / AJAX request — return JSON
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
