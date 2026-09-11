the.mood_core — Handmade Shop
A responsive frontend starter for a handmade/custom online store.
Included
Home / brand landing page
Product collection with category filters
Product cards and cart
LocalStorage cart persistence
Custom-order request form
Responsive mobile design
About/brand section
Run
Open index.html in a browser.
To turn this into a real store
Connect:
Backend/database for products, customers and orders
Payment gateway such as Razorpay/Stripe
Image upload storage
Admin dashboard
Authentication
Shipping provider and order tracking
Email/WhatsApp order notifications
The current checkout is intentionally a demo and does not process real payments.
Razorpay + Admin
This version adds a Node/Express backend, Razorpay Standard Checkout, server-created Razorpay Orders, server-side payment-signature verification, a simple admin order viewer, and a JSON file for local demo order storage.
Setup
Install Node.js.
In this folder run npm install.
Copy .env.example to .env.
Put your Razorpay Test Mode Key ID and Key Secret in .env.
Set a strong ADMIN_KEY.
Run npm start.
Open http://localhost:3000.
Admin: http://localhost:3000/admin.
Do not put the Razorpay Key Secret in frontend JavaScript. Keep it in .env on the server.
For production, replace orders.json with a real database, add proper admin authentication/authorization, validate prices from the server/database rather than trusting browser cart prices, and configure Razorpay webhooks/capture before fulfilling orders.
