# Project Task Manager

This file tracks the status of all actionable items identified in the `Travelo_Production_Audit.md`.

## 🟠 Architecture & File Structure [✅ COMPLETED]
- [x] Adopt proper MVC folder structure (`/src`, `/public`, `/views`).
- [x] Refactor bloated `index.js` (God file) into modular routes and controllers.
- [x] Convert mixed HTML/HBS to a unified Handlebars layout system (`views/layouts/main.hbs`).
- [x] Create `.gitignore` to protect environment variables and avoid committing OS artifacts.
- [x] Organize static assets (`css`, `js`, `images/destinations`, `images/hotels`, `images/packages`, etc.).
- [x] Delete junk files (eps files, empty text files, temp scripts).

## 🔴 Security
- [x] Migrate all hardcoded secrets to `.env` (Google OAuth, Razorpay, DB URI).
- [x] Implement password hashing using `bcrypt`.
- [x] Implement robust user authentication (Login/Logout flow).
- [x] Add `express-validator` to all forms.
- [x] Add security middlewares (`helmet`, `express-rate-limit`).
- [x] Implement CSRF protection.
- [x] Implement server-side Razorpay signature verification.

## 🟡 Backend Logic [✅ COMPLETED]
- [x] Connect DB gracefully (`src/config/database.js`).
- [x] Implement robust Session store using `connect-mongo`.
- [x] Centralize error handling middleware (`src/middlewares/errorHandler.js`).
- [x] Fix Express router definitions.
- [x] Graceful shutdown handling (`index.js`).
- [x] Fix logic leak: stop sending raw Mongo errors to client.
- [x] Implement logging framework (`morgan`, `winston`).
- [x] Clean up unused npm packages.

## 🔵 Database & Models
- [x] Add timestamps to all schemas.
- [x] Enforce data types and formats (Emails, Phone numbers as String).
- [x] Refactor schemas for semantic naming (`User`, `Booking`, `Review`, `Package`).
- [x] Establish relationships (e.g., `Booking` and `Review` tied to `User`).
- [x] Add missing fields (e.g., `rating` in reviews, `razorpayOrderId` in bookings).

## 🟣 Frontend & HTML [✅ COMPLETED]
- [x] Remove all inline CSS and move to external `/css/main.css` (or module specific CSS).
- [x] Fix broken absolute paths on local files.
- [x] Fix navbar markup (remove multiple `<body>` tags).
- [x] Use flexbox/grid instead of hardcoded pixel positioning.
- [x] Replace input `type="text"` with `type="email"`.
- [x] Compress large images (e.g., 3.4 MB JPEGs) and convert to modern formats (WebP).
- [x] Add `alt` tags to images.
- [x] Remove hardcoded dummy data and connect to DB data (Dynamic destination and review pages).

## 🟢 New Features Needed
- [ ] Admin panel (dashboard for bookings, users, reviews, packages).
- [ ] Email notifications (booking confirmations, welcome).
- [ ] Dynamic pricing engine based on package inputs.

## ✅ UI Polish (Session 3 — 2026-04-22)
- [x] Fixed global `html { font-size: 62.5% }` causing tiny text on `/contact`, `/destinations/..`, `/booking/hotel/..`, `/reviews`.
- [x] Removed global `text-transform: capitalize` from `*` selector — was capitalizing all text on modern pages.
- [x] Added `html { font-size: 100% !important }` override to `destination.css`, `contact.hbs`, `hotelcontact.hbs`, `reviews.hbs`.
- [x] Upgraded all font sizes on modern pages to use proper `px`/`rem` at 100% base.
- [x] Fixed invisible content-block borders in `destination.css` (was `rgba(255,255,255,.05)` on white bg).
- [x] Added payment success modal to `/contact` (trip booking) with animated icon, transaction ID, destination, and amount.
- [x] Added payment success modal to `/booking/hotel/..` with same premium design.
- [x] Payment button now shows loading state (spinner) while processing.
- [x] Razorpay `modal.ondismiss` handler added to re-enable button if user cancels payment.
- [x] Converted `reviews.hbs` style block fully to light theme.
- [x] Fixed navbar scaling issue on modern pages by adding explicit navbar size resets.
- [x] Scoped modern root font-size (100%) to specific templates (`destination.hbs`, `contact.hbs`, etc.) to prevent home page from being oversized.
- [x] Fixed Review form to instantly display submitted reviews (auto-approve) and persist across page loads.
- [x] Restored third-party Botpress chatbot integration globally to `main.hbs`.
- [x] Modernized the 404 Error page to match the premium light theme.
- [x] Fixed broken `/form` link on the home page and added a redirect to `/auth`.
- [x] Resolved "Too many requests" error by moving rate limiter after static assets and increasing limit to 500.
- [x] Added subtle travel-pattern background to footer and enabled auto-scroll for home page reviews.
- [x] Globally integrated Botpress Chatbot and Auth0 scripts in `main.hbs` for cross-page availability.
- [x] Fixed chatbot visibility by removing broken `./script.js` and updated footer contact details (email: mahirpatel1426@gmail.com).
- [x] Populated footer links (Quick Links, Resources, Legal) and implemented a refined light-themed footer with a prominent dark travel pattern background.
- [x] Removed log files (combined.log, error.log) and disabled file-based logging in the Winston configuration.
- [x] Cleaned up server-side and client-side console log/error statements, replacing them with proper logger calls where appropriate.
