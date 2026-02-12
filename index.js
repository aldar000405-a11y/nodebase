const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");

const app = express();

// ❗ Stripe يحتاج raw body للتحقق من التوقيع
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("✅ Event received:", event.type);

    res.json({ received: true });
  }
);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
