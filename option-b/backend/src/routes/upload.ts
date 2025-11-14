import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth, requireRoles } from "../middleware";

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/image", requireAuth, requireRoles(["OWNER"]), async (req, res) => {
  try {
    const { dataUri, folder = "agrawal-frankie" } = req.body;
    const r = await cloudinary.uploader.upload(dataUri, { folder });
    res.json({ url: r.secure_url, public_id: r.public_id });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
