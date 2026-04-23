require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
let MongoStore = require('connect-mongo');
if (MongoStore.default) MongoStore = MongoStore.default;
const path = require('path');
const connectDB = require('./src/config/database');
const errorHandler = require('./src/middlewares/errorHandler');
const logger = require('./src/utils/logger');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const pageRoutes = require('./src/routes/pageRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security Headers ──
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com", "https://cdn.botpress.cloud", "https://mediafiles.botpress.cloud", "https://cdn.auth0.com", "https://files.bpcontent.cloud"],
      "frame-src": ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com", "https://cdn.botpress.cloud"],
      "connect-src": ["'self'", "https://lumberjack-cx.razorpay.com", "https://api.razorpay.com", "https://*.botpress.cloud", "https://*.auth0.com", "https://files.bpcontent.cloud"],
      "img-src": ["'self'", "data:", "https://*"],
    },
  },
}));

app.use(compression());

// ── CORS ──
const corsOptions = {
  origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : true),
  credentials: true,
};
app.use(cors(corsOptions));

// ── Logging ──
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ── Serverless DB Connection Middleware ──
// MUST run before routes. In serverless (Vercel), connectDB is called per-request.
// In local dev, the DB is connected once at startup (see bottom of this file).
if (require.main !== module) {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      logger.error('DB connection failed in serverless middleware:', err);
      next(err);
    }
  });
}

// ── Body Parsers & Static Files ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET || 'fallback_secret_do_not_use_in_prod'));
app.use(express.static(path.join(__dirname, 'public')));

// ── Session ──
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_do_not_use_in_prod',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.DB_URI }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
}));

// ── CSRF Protection ──
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// ── Global Template Variables (user & CSRF token) ──
app.use(async (req, res, next) => {
  try {
    if (req.session?.userId) {
      const User = require('./src/models/User');
      req.user = await User.findById(req.session.userId).lean();
    }
    res.locals.user = req.user || null;
    res.locals.csrfToken = req.csrfToken();
    next();
  } catch (err) {
    next(err);
  }
});

// ── Handlebars View Engine ──
app.engine('.hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    addOne: (value) => parseInt(value) + 1,
    nameInitial: (name) => (name && name.length > 0) ? name.charAt(0).toUpperCase() : '?',
    times: (n, options) => {
      let result = '';
      for (let i = 0; i < (parseInt(n) || 0); i++) result += options.fn(i);
      return result;
    },
    or: (...args) => args.slice(0, -1).find(Boolean),
  },
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ── Routes ──
app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/booking', bookingRoutes);
app.use('/reviews', reviewRoutes);
app.get('/form', (req, res) => res.redirect('/auth'));

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found | Travelo' });
});

// ── Global Error Handler ──
app.use(errorHandler);

// ── Export for Vercel (serverless) ──
module.exports = app;

// ── Local Server Startup ──
let server;
if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();
      server = app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
    } catch (err) {
      logger.error('Failed to start server:', err);
      process.exit(1);
    }
  };
  startServer();
}

// ── Graceful Shutdown ──
process.on('SIGTERM', () => {
  logger.info('SIGTERM received: closing HTTP server');
  if (server) {
    server.close(() => { logger.info('HTTP server closed'); process.exit(0); });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  logger.info('SIGINT received: closing HTTP server');
  if (server) {
    server.close(() => { logger.info('HTTP server closed'); process.exit(0); });
  } else {
    process.exit(0);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
