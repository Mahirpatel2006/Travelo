// src/controllers/bookingController.js
const crypto = require('crypto');
const Booking = require('../models/Booking');
const HotelBooking = require('../models/HotelBooking');
const razorpay = require('../config/razorpay');

const getBookingPage = (req, res) => {
  const { destination } = req.params;
  res.render('pages/bookings/contact', {
    title: `Book ${destination} | Travelo`,
    destination,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    csrfToken: req.csrfToken ? req.csrfToken() : '',
  });
};

const getHotelBookingPage = (req, res) => {
  const { destination } = req.params;
  res.render('pages/bookings/hotelcontact', {
    title: `Book Hotels in ${destination} | Travelo`,
    destination,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    csrfToken: req.csrfToken ? req.csrfToken() : '',
  });
};

const createOrder = async (req, res, next) => {
  try {
    const { amount, destination } = req.body;
    if (!amount || !destination) {
      return res.status(400).json({ error: 'Amount and destination are required' });
    }
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

const verifyAndSaveBooking = async (req, res, next) => {
  try {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      destination, guestCount, arrivalDate, departureDate, email, phone, totalAmount,
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Use Passport user or session fallback
    const userId = req.user?._id || req.session?.userId || null;

    const booking = await Booking.create({
      userId,
      destination, guestCount, arrivalDate, departureDate, email, phone, totalAmount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'confirmed',
    });

    res.status(201).json({ success: true, bookingId: booking._id });
  } catch (err) {
    next(err);
  }
};

const verifyAndSaveHotelBooking = async (req, res, next) => {
  try {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      destination, hname, hpnumber, hadate, hlday, hconemail, hconnumber, totalAmount,
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    const userId = req.user?._id || req.session?.userId || null;

    const booking = await HotelBooking.create({
      userId,
      hotelName: destination || 'Hotel',
      hname, hpnumber, hadate, hlday, hconemail, hconnumber,
      totalAmount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'confirmed',
    });

    res.status(201).json({ success: true, bookingId: booking._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBookingPage, getHotelBookingPage, createOrder, verifyAndSaveBooking, verifyAndSaveHotelBooking };
