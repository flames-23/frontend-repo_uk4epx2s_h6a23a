import { Router } from "express";
import Stripe from "stripe";
import { requireAuth } from "../middleware";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });

router.post("/create-intent", requireAuth, async (req, res) => {
  try {
    const { amount, currency = "inr", customer_email } = req.body;
    if (!amount) return res.status(400).json({ message: "amount required" });
    const intent = await stripe.paymentIntents.create({ amount, currency, receipt_email: customer_email, automatic_payment_methods: { enabled: true } });
    res.json({ clientSecret: intent.client_secret });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
