const winston = require('winston');
const path = require('path');

// Determine if we should use file logging
// Vercel and most serverless environments have a read-only filesystem
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
const useFileLogging = process.env.NODE_ENV !== 'production' && !isServerless;

const transports = [
  new winston.transports.Console({
    format: process.env.NODE_ENV === 'development'
      ? winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, stack }) => {
            return `${timestamp} ${level}: ${stack || message}`;
          })
        )
      : winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        )
  })
];

if (useFileLogging) {
  transports.push(
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'travelo' },
  transports
});

module.exports = logger;
