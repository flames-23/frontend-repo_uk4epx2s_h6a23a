import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth, requireRoles } from "../middleware";

const router = Router();

const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  contact: String,
  openingHours: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  images: [String],
  isActive: { type: Boolean, default: true },
  stalls: { type: Number, default: 1 },
}, { timestamps: true });
BranchSchema.index({ location: "2dsphere" });
const Branch = mongoose.models.Branch || mongoose.model("Branch", BranchSchema);

// Create branch (OWNER)
router.post("/", requireAuth, requireRoles(["OWNER"]), async (req, res) => {
  try {
    const doc = await Branch.create(req.body);
    res.json(doc);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// List branches (public)
router.get("/", async (_req, res) => {
  const list = await Branch.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(list);
});

// Nearest branch by coords
router.get("/nearest", async (req, res) => {
  const { lat, lng } = req.query as any;
  if (!lat || !lng) return res.status(400).json({ message: "lat & lng required" });
  const nearest = await Branch.findOne({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: 50000,
      },
    },
  });
  res.json(nearest);
});

// Update branch (OWNER)
router.put("/:id", requireAuth, requireRoles(["OWNER"]), async (req, res) => {
  try {
    const doc = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doc);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

// Toggle availability
router.post("/:id/toggle", requireAuth, requireRoles(["OWNER"]), async (req, res) => {
  const b = await Branch.findById(req.params.id);
  if (!b) return res.status(404).json({ message: "Not found" });
  b.isActive = !b.isActive;
  await b.save();
  res.json(b);
});

export default router;
