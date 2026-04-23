// src/middlewares/authMiddleware.js

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  // Store intended URL so we can redirect back after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth');
};

const isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  next();
};

module.exports = { isAuthenticated, isGuest };
