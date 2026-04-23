# Travelo — Complete Production Audit

> Every single issue found across the entire codebase, organized by category.
> Tech stack: Node.js · Express · MongoDB/Mongoose · Handlebars (HBS) · Razorpay

---

## 🔴 1. CRITICAL SECURITY VULNERABILITIES

### 1.1 Passwords stored in plain text
- `models/register.js` — Password is saved exactly as typed, no hashing at all.
- `cpassword` (confirm password) is also stored in DB — this field should never be persisted.
- **Fix:** Use `bcrypt` with a pre-save hook. Remove `cpassword` field from schema entirely.

### 1.2 Hardcoded secrets in source code (6 instances)
| File | Secret exposed |
|---|---|
| `index.js:19-20` | Razorpay `key_id` and `key_secret` as fallback values |
| `passport.js:13-14` | Google OAuth `clientID` and `clientSecret` hardcoded |
| `passport.js:15` | Callback URL hardcoded to `localhost:3000` |
| `db/conn.js:5` | Full MongoDB Atlas URI with username + password |
| `contact.hbs:133` | Razorpay key in client-side JavaScript |
| `hotelcontact.hbs:199` | Same Razorpay key in client-side JavaScript |
- **Fix:** Move ALL secrets to `.env` and reference only via `process.env.*`. Use a server endpoint to pass the publishable key to the frontend.

### 1.3 `.env` file contains real credentials + no `.gitignore`
- `.env` has your real MongoDB password, Google OAuth secret, and Razorpay secret.
- There is **no `.gitignore` file** — if you push to GitHub, all secrets are exposed.
- **Fix:** Create `.gitignore` immediately with: `node_modules/`, `.env`, `tempCodeRunnerFile.js`.

### 1.4 No password hashing, no login system
- The `/form` route creates a user but there is no actual login/session flow.
- Anyone who registers is just redirected to `/index` with no session.
- **Fix:** Implement proper login with `bcrypt.compare()`, set `req.session.user`, and create auth middleware.

### 1.5 No input validation or sanitization
- All form submissions (`/form`, `/contact`, `/hotelcontact`, `/reviews`) blindly save `req.body` to DB.
- Vulnerable to NoSQL injection, XSS, and data corruption.
- **Fix:** Add `express-validator` or `joi` validation on every POST route.

### 1.6 No CSRF protection
- All forms use plain POST without any CSRF tokens.
- **Fix:** Add `csurf` or `csrf-csrf` middleware.

### 1.7 No security headers
- No `helmet` — missing Content-Security-Policy, X-Frame-Options, etc.
- **Fix:** `npm install helmet` and `app.use(helmet())`.

### 1.8 No rate limiting
- Login, register, contact, and payment routes have zero rate limiting.
- **Fix:** Add `express-rate-limit` on auth and payment endpoints.

### 1.9 Razorpay payment NOT verified
- After Razorpay payment, the `handler` callback just shows `alert('Payment Successful!')` and saves booking data — but **never verifies the payment signature**.
- An attacker can skip payment entirely and still save a booking.
- **Fix:** Verify `razorpay_signature` on the server using `crypto.createHmac()` before marking the booking as paid.

### 1.10 Hardcoded payment amount
- `index.js:106` — Payment amount is hardcoded to `50000` (₹500) for all bookings regardless of destination.
- Receipt ID is hardcoded to `"order_rcptid_11"` — every order gets the same receipt.
- **Fix:** Calculate amount dynamically based on the selected package/hotel and generate unique receipt IDs.

### 1.11 Personal info exposed in code
- `index.html:1121` — Your personal email `mahirpatel1426@gmail.com` in footer.
- `index.html:5` — A Google Sign-In `client_id` in a meta tag.
- `reviews.hbs:157` — Your email hardcoded in a dummy review card.
- `about.html:107` — Same personal email in footer.
- **Fix:** Use environment variables or a config for contact info. Remove dummy data with personal info.

---

## 🟠 2. ARCHITECTURE & FILE STRUCTURE

### 2.1 No proper folder structure
Current state is chaotic — 97 files dumped in `templates/` including HTML pages, images, CSS, JS, `.eps` files, and license files all mixed together.

**Fix — Adopt MVC structure:**
```
/Travelo
├── /config           # db.js, passport.js, razorpay.js
├── /controllers      # authController, bookingController, reviewController, pageController
├── /middlewares       # authMiddleware, errorHandler, rateLimiter, validator
├── /models           # User, Booking, Hotel, Review, Contact
├── /public           # Static assets ONLY
│   ├── /css
│   ├── /js
│   ├── /images
│   └── /videos
├── /routes           # authRoutes, bookingRoutes, reviewRoutes, pageRoutes
├── /views            # HBS templates ONLY
│   ├── /layouts      # main.hbs (base layout)
│   ├── /partials     # navbar.hbs, footer.hbs
│   └── /pages        # home.hbs, about.hbs, contact.hbs, etc.
├── /utils            # helpers, email service, etc.
├── .env
├── .gitignore
├── index.js
└── package.json
```

### 2.2 Bloated `index.js` (God file)
- `index.js` contains: DB import, Razorpay config, session config, 9 static file routes, registration logic, contact form logic, hotel booking logic, and payment processing.
- **Fix:** Extract into separate route files and controllers. Entry point should only have app setup and middleware registration.

### 2.3 Mixed rendering: HTML vs HBS
- Some pages served as raw `.html` via `res.sendFile()` (index, about, goa, manali, etc.)
- Other pages rendered as `.hbs` via `res.render()` (auth, contact, reviews, hotelcontact).
- **Fix:** Convert everything to `.hbs` templates with a shared layout.

### 2.4 Junk files in project root
- `tempCodeRunnerFile.js` — VS Code artifact, should be deleted.
- `package-5.jpg` — Duplicate image in root directory (also exists in `templates/`).
- **Fix:** Delete both files.

---

## 🟡 3. BACKEND CODE ISSUES

### 3.1 Router created wrong
- `routes/userRoute.js:2` — Uses `const router = express()` (creates a full Express app) instead of `express.Router()`.
- **Fix:** Change to `const router = express.Router()`.

### 3.2 Passport initialized on sub-router, not app
- `routes/userRoute.js:6-7` — `passport.initialize()` and `passport.session()` are added to a sub-router instead of the main Express app.
- **Fix:** Move `passport.initialize()` and `passport.session()` to `index.js` after session middleware.

### 3.3 Passport serializes entire Google profile
- `passport.js:5-6` — `serializeUser` stores the entire Google profile object in the session.
- **Fix:** Only serialize `user.id`. In `deserializeUser`, look up the user from MongoDB.

### 3.4 Google OAuth doesn't persist user to DB
- `passport.js:18-19` — The Google strategy callback returns the profile directly without creating or finding a user in the database.
- **Fix:** In the strategy callback, use `User.findOrCreate()` to persist the user.

### 3.5 Success handler leaks user data and doesn't redirect
- `controllers/userController.js:9` — `console.log(req.user)` leaks full user profile to server logs.
- `controllers/userController.js:10` — `res.send("Welcome " + req.user.email)` sends raw text instead of rendering a page.
- Line 7-8 has no `return` before `res.redirect('/failure')`, so code continues and sends response twice.
- **Fix:** Remove console.log, add `return`, redirect to a proper page.

### 3.6 Error responses leak internal details
- `index.js:74` — `res.status(400).send(error)` sends the raw Mongoose error object to the client (can expose schema info).
- **Fix:** Send generic error messages to clients, log details server-side only.

### 3.7 DB connection not awaited
- `db/conn.js` — Connection is fire-and-forget. Server starts listening before confirming DB is connected.
- **Fix:** Export an `async connectDB()` function, `await` it in `index.js` before `app.listen()`.

### 3.8 Mongoose debug mode enabled
- `db/conn.js:3` — `mongoose.set('debug', true)` logs every query to console. Not for production.
- **Fix:** Only enable in development: `mongoose.set('debug', process.env.NODE_ENV !== 'production')`.

### 3.9 Session stored in memory
- `index.js:23-27` — `express-session` defaults to `MemoryStore`. Sessions are lost on restart; leaks memory in production.
- **Fix:** Use `connect-mongo` to store sessions in MongoDB.

### 3.10 Session secret is weak
- `.env:1` — `SESSION_SECRET=SECRET` — trivially guessable.
- **Fix:** Generate a strong random string (32+ characters).

### 3.11 No logout functionality
- There is no `/logout` route anywhere in the codebase.
- **Fix:** Add a route that calls `req.logout()`, destroys the session, and redirects.

### 3.12 No auth middleware
- No route is protected. Anyone can access any page without being logged in.
- **Fix:** Create an `isAuthenticated` middleware and apply it to protected routes.

### 3.13 Review route has duplicate destructuring
- `routes/revRoute.js:16-18` — Destructures `req.body` into variables on line 18, then ignores them and uses `req.body.*` directly on lines 21-25.
- `routes/revRoute.js:17` — `console.log(data)` leaks submitted data to logs.
- **Fix:** Use the destructured variables or remove the destructuring. Remove console.log.

### 3.14 No logging framework
- Using `console.log` and `console.error` everywhere.
- **Fix:** Use `morgan` for HTTP request logging and `winston` for application logging.

### 3.15 No error handling middleware
- No global error handler. Unhandled errors crash the server.
- **Fix:** Add `app.use((err, req, res, next) => { ... })` at the end of middleware chain.

### 3.16 No 404 handler
- Visiting any undefined route results in Express's default HTML error page.
- **Fix:** Add a catch-all `app.use((req, res) => { res.status(404).render('404') })`.

### 3.17 No compression
- Responses are not gzip compressed.
- **Fix:** Add `compression` middleware.

### 3.18 No CORS configuration
- If you ever add a separate frontend or mobile app, API calls will be blocked.
- **Fix:** Configure `cors` middleware with allowed origins.

### 3.19 Broken start script
- `package.json:6` — `"start": "node index.js\`"` has a stray backtick that will cause the script to fail.
- **Fix:** Change to `"start": "node index.js"`.

### 3.20 Unused dependencies
- `package.json` installs packages that are never used:
  - `@auth0/auth0-spa-js` — not used anywhere in server code
  - `ejs` — installed but HBS is used as the template engine
  - `multer` — installed but no file upload functionality exists
  - `passport-google-oauth20` — duplicate of `passport-google-oauth2` (both installed)
- **Fix:** Remove unused packages. Pick one passport-google strategy.

### 3.21 No graceful shutdown
- Server doesn't handle `SIGTERM`/`SIGINT` to close DB connections and in-flight requests cleanly.
- **Fix:** Add process signal handlers.

---

## 🔵 4. DATABASE & MODELS

### 4.1 No timestamps on any schema
- None of the 4 models (`register`, `contact`, `hotels`, `reviews`) have `timestamps: true`.
- **Fix:** Add `{ timestamps: true }` as the second argument to every `new mongoose.Schema(...)`.

### 4.2 Phone numbers stored as `Number`
- `contact.js`, `hotels.js`, `reviews.js` all store phone/contact numbers as `Number`.
- This strips leading zeros (e.g., `0912...` becomes `912...`) and breaks international formats.
- **Fix:** Use `type: String` with regex validation for phone numbers.

### 4.3 Poor schema naming
- `linSchema`, `conSchema`, `hotelSchema` — cryptic, non-descriptive names.
- Field names like `hname`, `hpnumber`, `hadate`, `hlday`, `hconemail`, `hconnumber` are unreadable.
- **Fix:** Use clear names: `name`, `guestCount`, `arrivalDate`, `departureDate`, `email`, `phone`.

### 4.4 No email validation in schemas
- Email fields accept any string — no regex pattern matching.
- **Fix:** Add `match: [/^\S+@\S+\.\S+$/, 'Invalid email']` to email fields.

### 4.5 No password length enforcement
- `register.js` — Password can be 1 character long.
- **Fix:** Add `minlength: [8, 'Password must be at least 8 characters']`.

### 4.6 No indexes beyond `_id`
- No indexes on frequently queried fields like `email` (for user lookup) or `createdAt` (for sorting reviews).
- **Fix:** Add appropriate indexes: `email: { type: String, unique: true, index: true }`.

### 4.7 No relationship between models
- Reviews have no `userId` field — you can't tell who wrote a review.
- Bookings (contact/hotel) have no `userId` field — bookings aren't tied to users.
- **Fix:** Add `userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }` to relevant schemas.

### 4.8 Review model missing rating field
- Reviews are just text — no star rating (1-5).
- **Fix:** Add `rating: { type: Number, min: 1, max: 5, required: true }`.

### 4.9 No Booking/Order model
- There's no model to track bookings with payment status, Razorpay order IDs, or confirmation details.
- **Fix:** Create a `Booking` model with: `userId`, `destination`, `checkIn`, `checkOut`, `guests`, `totalAmount`, `razorpayOrderId`, `razorpayPaymentId`, `status` (pending/confirmed/cancelled).

### 4.10 No package/destination model
- All trip packages (Manali ₹26,000, Goa ₹23,000, etc.) are hardcoded in HTML.
- **Fix:** Create a `Package` model and store destinations in the database. Render dynamically.

---

## 🟣 5. FRONTEND & HTML ISSUES

### 5.1 Massive inline CSS
- `index.html` — 650 lines of CSS inside `<style>` tags (lines 17-662), which is a **copy of `style.css`**. The CSS is loaded twice.
- `auth.hbs` — 377 lines of inline CSS.
- `reviews.hbs` — 133 lines of inline CSS.
- `contact.hbs` — 66 lines of inline CSS.
- `hotelcontact.hbs` — 86 lines of inline CSS.
- `about.html` — 35 lines of inline CSS.
- **Fix:** Extract all CSS to external `.css` files in `/public/css/`.

### 5.2 Hardcoded absolute local file paths
- `auth.hbs:8` — `href="C:\Users\patel\Desktop\login page\views\auth.css"`
- `contact.hbs:7` — Same path
- `hotelcontact.hbs:7` — Same path
- These point to a file on a specific Windows machine. They will **never work** on any other computer or server.
- **Fix:** Use relative paths like `/css/auth.css`.

### 5.3 Navbar partial has broken HTML structure
- `partials/navbar.hbs` — Contains `<!DOCTYPE html>`, `<html>`, `<head>`, and **two `<body>` tags** inside a partial.
- A partial should only contain the component HTML fragment, not a full document.
- **Fix:** Strip everything except the `<header>...</header>` content.

### 5.4 No HBS layout system
- Every `.hbs` file manually declares `<!DOCTYPE html>`, `<head>`, `<body>`.
- **Fix:** Create a `main.hbs` layout with `{{{body}}}` placeholder. Use `express-handlebars` for layout support.

### 5.5 All page titles are "Document"
- `index.html:8`, `auth.hbs:7`, `contact.hbs:6`, `hotelcontact.hbs:6`, `reviews.hbs:6`, `about.html:6` — Every page has `<title>Document</title>`.
- **Fix:** Set meaningful, SEO-friendly titles per page (e.g., "Book Your Dream Trip | Travelo").

### 5.6 No meta descriptions or SEO tags
- Zero `<meta name="description">` tags on any page.
- No Open Graph tags for social sharing.
- No favicon.
- **Fix:** Add proper SEO meta tags to every page.

### 5.7 Navbar links are broken
- `partials/navbar.hbs:21-25` — Links point to `index.html` (a static file) instead of Express routes like `/about`, `/#services`, `/#packages`.
- `about.html:56-60` — Same issue.
- **Fix:** Update all links to use proper routes.

### 5.8 Inconsistent brand name
- `index.html` navbar says "TRAVELO".
- `about.html:51` navbar says "travel" (lowercase, different name).
- **Fix:** Use consistent branding everywhere.

### 5.9 Font Awesome loaded but not always available
- `partials/navbar.hbs` uses Font Awesome classes (`fas fa-bars`, `fas fa-times`) but doesn't load the Font Awesome CDN.
- Only `index.html` loads it. Other pages using the navbar partial won't show icons.
- **Fix:** Load Font Awesome in the base layout.

### 5.10 Duplicate Razorpay script load
- `contact.hbs:8` AND `contact.hbs:80` — Razorpay checkout script loaded twice.
- **Fix:** Load it only once.

### 5.11 Broken CSS syntax
- `contact.hbs:35` — `width: 80%;`` — Has a stray backtick after the semicolon.
- `auth.hbs:475` — Inline style attribute has a mismatched `}` brace.

### 5.12 Hotel booking form has wrong element references
- `hotelcontact.hbs:209` — References `document.getElementById("booking-form")` but the form has no `id` attribute.
- `hotelcontact.hbs:229-231` — References `input[name='name']`, `input[name='conemail']`, `input[name='connumber']` but the actual field names are `hname`, `hconemail`, `hconnumber`. **Prefill will silently fail.**
- **Fix:** Match the JS selectors to the actual form field names.

### 5.13 Hardcoded pixel positions — not responsive
- `about.html:12` — `left: 283px`
- `about.html:19` — `left: 364px`
- `about.html:26` — `left: 120px`
- `hotelcontact.hbs:87-88` — `width: 1000px` on input fields
- `hotelcontact.hbs:171` — Submit button `left: 700px`
- `index.html:1070-1071` — "See all reviews" button `left: 700px; bottom: 70px`
- `auth.hbs:469-475` — Text positioned with `right: 163px`, `right: 41px`
- **All of these break on mobile and different screen sizes.**
- **Fix:** Use flexbox/grid layouts with relative units (%, rem, vw).

### 5.14 `<br>` tags used for spacing
- `reviews.hbs:138-147` — Ten consecutive `<br>` tags used instead of CSS margin/padding.
- **Fix:** Use CSS `margin-top` or `padding-top`.

### 5.15 Email input uses `type="text"` instead of `type="email"`
- `contact.hbs:105` — Email field is `type="text"`, bypassing browser email validation.
- `hotelcontact.hbs:165` — Same issue.
- `reviews.hbs:224` — Same issue.
- **Fix:** Change to `type="email"`.

### 5.16 No client-side form validation
- None of the forms have `required` attributes (except the auth form).
- No min/max length on fields.
- **Fix:** Add `required`, `minlength`, `maxlength`, `pattern` attributes to all form inputs.

### 5.17 Hardcoded dummy data
- `reviews.hbs:156-166` — A hardcoded review card with your personal email and Lorem ipsum text is permanently displayed before real reviews.
- `index.html:1008-1050` — All review slider names are "john lary" — clearly placeholder data.
- `index.html:1127-1146` — Footer links all say "popular destinations" or "travel guide" repeated.
- **Fix:** Remove dummy data. Populate from the database.

### 5.18 Commented-out code everywhere
- `index.html` — ~100 lines of commented-out code (Google Sign-In, Auth0, Botpress, extra packages).
- `auth.hbs` — Commented-out Apple/Twitter social login buttons.
- `about.html` — Commented-out sections.
- **Fix:** Delete all commented-out code. Use version control (Git) to preserve history.

### 5.19 Auth0 SDK loaded but unused
- `index.html:1202` — Loads `auth0-spa-js.production.js` in the browser for no reason.
- **Fix:** Remove it.

### 5.20 Botpress chatbot scripts loaded
- `index.html:1209-1210` — Botpress webchat scripts are loaded but there's no chatbot integration.
- **Fix:** Remove until properly implemented.

### 5.21 Bootstrap loaded but barely used
- `index.html:6` — Bootstrap CSS loaded but the entire page uses custom CSS. Only `alert-primary` class referenced in commented-out code.
- **Fix:** Remove Bootstrap unless you plan to use it.

### 5.22 Video auto-plays without controls
- `index.html:716` — Background video `autoplay muted loop` — acceptable, but no `playsinline` attribute for iOS and missing `preload="metadata"` for performance.
- The video file `home.mp4` (2.8 MB) has no lazy loading.
- **Fix:** Add `playsinline`, `preload="metadata"`. Consider using a compressed/optimized video.

### 5.23 Images have no `alt` text
- Nearly every `<img>` tag has `alt=""` — empty alt text everywhere.
- **Fix:** Add descriptive alt text for accessibility and SEO.

### 5.24 Images not optimized
- `manali 1.jpg` — 3.4 MB, `manali 2.jpg` — 2.9 MB, `manali 3.jpg` — 2.6 MB.
- `Graident Ai Robot.jpg` — 1.8 MB, `Graident Ai Robot.eps` — 13.4 MB.
- **Fix:** Compress images, convert to WebP, lazy-load below-fold images.

### 5.25 `.eps` files in the project
- `195.eps` (448 KB) and `Graident Ai Robot.eps` (13.4 MB) — These are print/vector files, not usable on the web.
- **Fix:** Delete them. Keep only web-optimized formats.

### 5.26 Filenames with spaces
- `Gangtok 1.avif`, `darjeeling 1.avif`, `manali 1.jpg`, `kalimpong 1.avif`, `siliguri 1.avif`, etc.
- Spaces in filenames cause URL encoding issues.
- **Fix:** Rename with hyphens: `gangtok-1.avif`, `darjeeling-1.avif`.

### 5.27 Typos in content
- `index.html:773` — "AI cahtbot" → "AI Chatbot"
- `index.html:780` — Curly closing quote `"` in heading: `Affordable, Well-Planned Trips Instantly"`
- `index.html:809,824,839,854,869,884` — "explor" → "Explore"
- `index.html:850` — "varansi" → "Varanasi"
- `auth.hbs:405` — "conform Password" → "Confirm Password"

---

## 🟢 6. MISSING FEATURES FOR PRODUCTION

### 6.1 User account system
- [ ] User registration with email verification
- [ ] Login / Logout flow
- [ ] Password reset (forgot password)
- [ ] User profile page
- [ ] Booking history for logged-in users

### 6.2 Admin panel
- [ ] Dashboard to view all bookings, users, reviews
- [ ] Ability to add/edit/delete travel packages
- [ ] Manage hotel listings
- [ ] Moderate reviews

### 6.3 Booking system
- [ ] Dynamic pricing based on destination, dates, guests
- [ ] Booking confirmation emails
- [ ] Booking cancellation and refund flow
- [ ] Booking status tracking (pending → confirmed → completed)
- [ ] Calendar-based availability checking

### 6.4 Payment system
- [ ] Payment signature verification (server-side)
- [ ] Payment receipt generation
- [ ] Refund handling
- [ ] Multiple payment methods
- [ ] Payment history

### 6.5 Reviews system
- [ ] Reviews tied to authenticated users only
- [ ] Star ratings (1-5)
- [ ] Review moderation (approval before publishing)
- [ ] Prevent duplicate reviews
- [ ] Reviews linked to specific destinations

### 6.6 Email notifications
- [ ] Booking confirmation email
- [ ] Payment receipt email
- [ ] Welcome email on registration
- [ ] Password reset email

### 6.7 DevOps & deployment
- [ ] `.gitignore` file
- [ ] `README.md` with setup instructions
- [ ] Environment-specific configs (development/staging/production)
- [ ] Docker configuration
- [ ] CI/CD pipeline
- [ ] Health check endpoint (`/api/health`)
- [ ] Proper logging (file-based, not just console)

### 6.8 Legal & compliance
- [ ] Privacy Policy page
- [ ] Terms & Conditions page (actual content, not placeholder links)
- [ ] Cookie consent banner
- [ ] GDPR compliance for EU users

### 6.9 Performance
- [ ] Image CDN or cloud storage (Cloudinary/S3)
- [ ] HTTP caching headers
- [ ] Database query optimization
- [ ] Response compression (`compression` middleware)
- [ ] Minified CSS/JS for production

### 6.10 Accessibility
- [ ] Proper alt text on all images
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation support
- [ ] Color contrast compliance (WCAG AA)
- [ ] Screen reader testing

---

## Summary: Issue Count

| Category | Count |
|---|---|
| 🔴 Critical Security | 11 |
| 🟠 Architecture | 4 |
| 🟡 Backend Code | 21 |
| 🔵 Database & Models | 10 |
| 🟣 Frontend & HTML | 27 |
| 🟢 Missing Features | 10 categories |
| **Total individual issues** | **73+** |
