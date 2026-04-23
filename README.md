# ✈️ Travelo - Premium Travel Booking Experience

![Travelo Banner](public/images/banner.png)

Travelo is a production-grade, full-stack travel booking application designed to provide users with a seamless and visually stunning experience for exploring and booking their next adventure. Built with security, scalability, and performance in mind.

## 🚀 Key Features

- **🔐 Secure Authentication**: Multi-factor authentication support via Passport.js (Google OAuth2) and robust session management.
- **🗺️ Interactive Exploration**: Browse luxury destinations with dynamic reviews and high-quality imagery.
- **💳 Integrated Payments**: Seamless checkout experience powered by **Razorpay**.
- **🛡️ Production Security**: Implemented with Helmet, CSP, Rate Limiting, and CSURF protection.
- **⚡ Performance Optimized**: Gzip compression, asset minification, and efficient MongoDB indexing.
- **💬 AI Chatbot**: Integrated Botpress chatbot for real-time customer support.
- **📱 Fully Responsive**: A mobile-first design that looks premium on all devices.

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Templating**: [Handlebars (HBS)](https://handlebarsjs.com/)
- **Styling**: Vanilla CSS (Modern CSS3 with Flexbox/Grid)
- **Security**: Helmet, CSURF, Express-Rate-Limit, Express-Validator
- **Logging**: Winston & Morgan

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Mahirpatel2006/Travelo.git
cd Travelo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### 4. Run the application
**Development Mode:**
```bash
npm run dev
```
**Production Mode:**
```bash
npm start
```

## 📂 Project Structure

```text
├── public/          # Static assets (CSS, JS, Images)
├── src/
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routes
│   ├── middleware/  # Custom security & logic middleware
│   └── config/      # Database & Auth configurations
├── views/
│   ├── layouts/     # Handlebars base layouts
│   ├── partials/    # Reusable UI components
│   └── *.hbs        # Page templates
├── index.js         # Entry point
└── .gitignore       # Production-grade ignore rules
```

## 📜 License

This project is licensed under the ISC License.

---
Developed with ❤️ by [Mahir Patel](https://github.com/Mahirpatel2006)
