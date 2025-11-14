import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth, requireRoles } from "../middleware";
import { emitOrderUpdate } from "../realtime/socket";

const router = Router();

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    quantity: Number,
    customizations: Object,
    price: Number,
  }],
  total: Number,
  status: { type: String, enum: ["PLACED", "ACCEPTED", "COOKING", "READY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"], default: "PLACED" },
  delivery: {
    type: { type: String, enum: ["PICKUP", "DELIVERY"], default: "DELIVERY" },
    address: String,
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  driverLocation: { lat: Number, lng: Number },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

router.post("/", requireAuth, async (req, res) => {
  const order = await Order.create(req.body);
  emitOrderUpdate(order._id.toString(), { type: "ORDER_PLACED", payload: order });
  res.json(order);
});

router.get("/:id", requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  res.json(order);
});

router.post("/:id/status", requireAuth, requireRoles(["OWNER", "DELIVERY"]), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  order.status = req.body.status || order.status;
  await order.save();
  emitOrderUpdate(order._id.toString(), { type: "STATUS", payload: { status: order.status } });
  res.json(order);
});

router.post("/:id/location", requireAuth, requireRoles(["DELIVERY"]), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  order.driverLocation = { lat: req.body.lat, lng: req.body.lng };
  await order.save();
  emitOrderUpdate(order._id.toString(), { type: "LOCATION", payload: order.driverLocation });
  res.json({ ok: true });
});

export default router;
