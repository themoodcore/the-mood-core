# the.mood_core — Handmade Shop

A responsive frontend starter for a handmade/custom online store.

## Included
- Home / brand landing page
- Product collection with category filters
- Product cards and cart
- LocalStorage cart persistence
- Custom-order request form
- Responsive mobile design
- About/brand section

## Run
Open `index.html` in a browser.

## To turn this into a real store
Connect:
1. Backend/database for products, customers and orders
2. Payment gateway such as Razorpay/Stripe
3. Image upload storage
4. Admin dashboard
5. Authentication
6. Shipping provider and order tracking
7. Email/WhatsApp order notifications

The current checkout is intentionally a demo and does not process real payments.


## Razorpay + Admin

This version adds a Node/Express backend, Razorpay Standard Checkout, server-created Razorpay Orders, server-side payment-signature verification, a simple admin order viewer, and a JSON file for local demo order storage.

### Setup

1. Install Node.js.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your Razorpay **Test Mode** Key ID and Key Secret in `.env`.
5. Set a strong `ADMIN_KEY`.
6. Run `npm start`.
7. Open `http://localhost:3000`.
8. Admin: `http://localhost:3000/admin`.

Do not put the Razorpay Key Secret in frontend JavaScript. Keep it in `.env` on the server.

For production, replace `orders.json` with a real database, add proper admin authentication/authorization, validate prices from the server/database rather than trusting browser cart prices, and configure Razorpay webhooks/capture before fulfilling orders.
