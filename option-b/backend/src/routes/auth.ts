import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = Router();

// Inline simple User model to keep file self-contained for scaffolding
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["USER", "OWNER", "DELIVERY"], default: "USER" },
  favouriteBranch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }
}, { timestamps: true });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: role || "USER" });

    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ sub: user._id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
