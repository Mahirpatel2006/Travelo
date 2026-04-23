// src/routes/bookingRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const validateBooking = [
  body('destination').notEmpty().withMessage('Destination is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().matches(/^[0-9]{10,15}$/).withMessage('Valid phone is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  }
];

// All booking routes require authentication
router.use(isAuthenticated);

router.get('/:destination', bookingController.getBookingPage);
router.get('/hotel/:destination', bookingController.getHotelBookingPage);

router.post('/create-order', validateBooking, bookingController.createOrder);
router.post('/verify-save', validateBooking, bookingController.verifyAndSaveBooking);
router.post('/hotel-verify-save', bookingController.verifyAndSaveHotelBooking);

module.exports = router;
