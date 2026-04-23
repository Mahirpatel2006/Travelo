// src/controllers/authController.js

const User = require('../models/User');

const loadAuthPage = (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/'); // Already logged in
  }
  res.render('pages/auth/auth', { title: 'Sign In | Travelo' });
};

const registerLocal = async (req, res, next) => {
  try {
    const { name, email, password, cpassword } = req.body;
    
    if (password !== cpassword) {
      return res.status(400).render('pages/auth/auth', { title: 'Sign In | Travelo', error: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).render('pages/auth/auth', { title: 'Sign In | Travelo', error: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    req.session.userId = user._id; // Log user in
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    next(err);
  }
};

const loginLocal = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
       return res.status(401).render('pages/auth/auth', { title: 'Sign In | Travelo', error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
       return res.status(401).render('pages/auth/auth', { title: 'Sign In | Travelo', error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    next(err);
  }
};



const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
};

module.exports = { loadAuthPage, registerLocal, loginLocal, logout };