const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const router = express.Router();

const validateReview = [
  body('revname').notEmpty().withMessage('Name is required'),
  body('revplace').notEmpty().withMessage('Destination is required'),
  body('revemail').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('revnumber').optional({ checkFalsy: true }).matches(/^[0-9]{10,15}$/).withMessage('Valid phone is required'),
  body('rating').optional().isNumeric().withMessage('Rating must be a number'),
  body('review').isLength({ min: 10 }).withMessage('Review must be at least 10 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Review.find({ isApproved: true }).sort({ createdAt: -1 }).lean()
        .then(reviews => {
          res.status(400).render('pages/reviews', { 
            title: 'Reviews | Travelo',
            reviews: reviews,
            error: errors.array()[0].msg 
          });
        })
        .catch(err => next(err));
    }
    next();
  }
];



router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).lean();
    res.render("pages/reviews", { title: 'Reviews | Travelo', reviews });
  } catch (err) {
    next(err);
  }
});

router.post("/", validateReview, async (req, res, next) => {
  try {
    const { revname, revplace, revemail, revnumber, review, rating } = req.body;

    await Review.create({
      userId: req.session?.userId || null,
      name: revname,
      destination: revplace,
      email: revemail,
      phone: revnumber,
      rating: rating || 5, // Default to 5 if not provided in form yet
      review: review,
      isApproved: true // Auto-approve so it shows immediately as user requested
    });

    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).lean();

    res.render("pages/reviews", { 
        title: 'Reviews | Travelo', 
        reviews: reviews,
        success: 'Thank you! Your review has been submitted and is now live.' 
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;