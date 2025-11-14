import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth";
import branchRouter from "./routes/branch";
import menuRouter from "./routes/menu";
import orderRouter from "./routes/order";
import paymentRouter from "./routes/payment";
import uploadRouter from "./routes/upload";

import { attachSocketHandlers } from "./realtime/socket";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_ORIGIN || "*" } });
attachSocketHandlers(io);

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

// DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/agrawal_frankie";
mongoose.connect(MONGODB_URI).then(() => console.log("Mongo connected"));

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/branches", branchRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/upload", uploadRouter);

const PORT = Number(process.env.PORT || 4000);
server.listen(PORT, () => console.log(`API listening on ${PORT}`));
