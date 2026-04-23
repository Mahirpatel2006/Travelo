// src/controllers/pageController.js
// Serves all static-style pages (home, about, destinations)

const Package = require('../models/Package');
const Booking = require('../models/Booking');
const HotelBooking = require('../models/HotelBooking');
const User = require('../models/User');

const getHome = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true }).lean();
    res.render('pages/home', { title: 'Travelo | Discover Thrilling Adventures', packages });
  } catch (err) {
    next(err);
  }
};

const getAbout = (req, res) => {
  res.render('pages/about', { title: 'About Us | Travelo' });
};

// Single destination page handler — uses slug param
const getDestination = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const pkg = await Package.findOne({ slug, isActive: true }).lean();
    if (!pkg) return res.status(404).render('pages/404', { title: '404 | Travelo' });
    res.render('pages/destinations/destination', { title: `${pkg.name} | Travelo`, pkg });
  } catch (err) {
    next(err);
  }
};

const getAffordableHotels = (req, res) => {
  res.render('pages/hotels/affordable-hotel', { title: 'Affordable Hotels | Travelo' });
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.session?.userId;
    if (!userId) return res.redirect('/auth');

    const user = await User.findById(userId).lean();
    const now = new Date();

    // Fetch trip bookings
    const tripBookingsRaw = await Booking.find({ userId }).sort({ createdAt: -1 }).lean();
    const tripBookings = tripBookingsRaw.map(b => ({
      ...b,
      type: 'trip',
      isExpired: b.departureDate && new Date(b.departureDate) < now,
      formattedArrival: b.arrivalDate ? new Date(b.arrivalDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
      formattedDeparture: b.departureDate ? new Date(b.departureDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    }));

    // Fetch hotel bookings
    const hotelBookingsRaw = await HotelBooking.find({ userId }).sort({ createdAt: -1 }).lean();
    const hotelBookings = hotelBookingsRaw.map(b => ({
      ...b,
      type: 'hotel',
      isExpired: b.hlday && new Date(b.hlday) < now,
      formattedCheckin: b.hadate ? new Date(b.hadate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
      formattedCheckout: b.hlday ? new Date(b.hlday).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
    }));

    res.render('pages/profile', {
      title: 'My Profile | Travelo',
      user,
      tripBookings,
      hotelBookings,
      hasTripBookings: tripBookings.length > 0,
      hasHotelBookings: hotelBookings.length > 0,
    });
  } catch (err) {
    next(err);
  }
};

const getHotelContact = (req, res) => {
  const destination = req.query.destination || 'Your Destination';
  res.render('pages/bookings/hotelcontact', {
    title: `Book Hotels in ${destination} | Travelo`,
    destination,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    csrfToken: req.csrfToken ? req.csrfToken() : '',
  });
};

module.exports = { getHome, getAbout, getDestination, getAffordableHotels, getProfile, getHotelContact };

