// src/routes/pageRoutes.js
const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', pageController.getHome);
router.get('/about', pageController.getAbout);
router.get('/affordable-hotels', pageController.getAffordableHotels);
router.get('/destinations/:slug', pageController.getDestination);
router.get('/profile', isAuthenticated, pageController.getProfile);

// /contact renders the general booking page (requires auth in bookingRoutes, 
// but contact is pre-auth landing — handled separately here as a public info page)
router.get('/hotelcontact', pageController.getHotelContact);

router.get('/contact', (req, res) => {
  const csrfToken = req.csrfToken ? req.csrfToken() : '';
  res.render('pages/bookings/contact', { 
    title: 'Book a Trip | Travelo', 
    destination: 'Your Destination', 
    csrfToken,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID 
  });
});

module.exports = router;

