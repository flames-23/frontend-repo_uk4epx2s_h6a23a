import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import authRouter from "./routes/auth";
import branchRouter from "./routes/branch";
import menuRouter from "./routes/menu";
import orderRouter from "./routes/order";
import paymentRouter from "./routes/payment";
import uploadRouter from "./routes/upload";

export const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

// DB connection helper
export async function connectDB(uri?: string) {
  const MONGODB_URI = uri || process.env.MONGODB_URI || "mongodb://localhost:27017/agrawal_frankie";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/branches", branchRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/upload", uploadRouter);
