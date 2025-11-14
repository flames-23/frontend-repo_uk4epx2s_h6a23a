import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth, requireRoles } from "../middleware";

const router = Router();

const MenuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  veg: Boolean,
  isFamous: Boolean,
  price: Number,
  images: [String],
  videos: [String],
  categories: [String],
  customizations: [{
    name: String,
    options: [{ label: String, priceDelta: Number }]
  }],
  availability: [{ branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, available: Boolean }],
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
}, { timestamps: true });
const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);

// Create item (OWNER)
router.post("/", requireAuth, requireRoles(["OWNER"]), async (req, res) => {
  try {
    const doc = await MenuItem.create(req.body);
    res.json(doc);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// List items
router.get("/", async (_req, res) => {
  const list = await MenuItem.find().sort({ createdAt: -1 });
  res.json(list);
});

// Rate item
router.post("/:id/rate", requireAuth, async (req, res) => {
  const { score } = req.body;
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  // simplistic average update for scaffold
  const total = item.ratingAvg * item.ratingCount + Number(score || 0);
  item.ratingCount += 1;
  item.ratingAvg = total / item.ratingCount;
  await item.save();
  res.json(item);
});

export default router;
