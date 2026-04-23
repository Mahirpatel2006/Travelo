// src/routes/authRoutes.js
const express = require('express');

const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middlewares/authMiddleware');

// Validation Middleware
const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('cpassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/auth/auth', { 
        title: 'Sign In | Travelo', 
        error: errors.array()[0].msg 
      });
    }
    next();
  }
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/auth/auth', { 
        title: 'Sign In | Travelo', 
        error: errors.array()[0].msg 
      });
    }
    next();
  }
];

router.get('/', isGuest, authController.loadAuthPage);
router.post('/register', isGuest, validateRegistration, authController.registerLocal);
router.post('/login', isGuest, validateLogin, authController.loginLocal);



router.get('/logout', authController.logout);

module.exports = router;
