import mongoose from "mongoose";
import { config } from "dotenv";
config();

(async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/agrawal_frankie";
  await mongoose.connect(uri);

  const Branch = mongoose.model("Branch", new mongoose.Schema({
    name: String,
    address: String,
    contact: String,
    openingHours: String,
    location: { type: { type: String, default: "Point" }, coordinates: [Number] },
    images: [String],
    stalls: Number,
  }));

  const MenuItem = mongoose.model("MenuItem", new mongoose.Schema({
    name: String, description: String, veg: Boolean, price: Number, images: [String], categories: [String], isFamous: Boolean
  }));

  const User = mongoose.model("User", new mongoose.Schema({
    name: String, email: { type: String, unique: true }, password: String, role: { type: String, default: 'OWNER' }
  }));

  await Promise.all([
    Branch.deleteMany({}),
    MenuItem.deleteMany({}),
  ]);

  const branches = await Branch.insertMany([
    { name: "Agrawal Frankie - MG Road", address: "MG Road, Pune", contact: "+91 9876543210", openingHours: "10:00-22:00", location: { type: "Point", coordinates: [73.8567, 18.5204] }, images: [], stalls: 3 },
    { name: "Agrawal Frankie - Andheri", address: "Andheri West, Mumbai", contact: "+91 9123456780", openingHours: "10:00-23:00", location: { type: "Point", coordinates: [72.8355, 19.1232] }, images: [], stalls: 4 }
  ]);

  await MenuItem.insertMany([
    { name: "Paneer Frankie", description: "Soft paneer tikka wrapped in fresh roti", veg: true, price: 149, images: [], categories: ["Frankie"], isFamous: true },
    { name: "Veg Schezwan Frankie", description: "Spicy schezwan veggies", veg: true, price: 129, images: [], categories: ["Frankie"] }
  ]);

  await User.updateOne({ email: 'owner@example.com' }, { $setOnInsert: { name: 'Owner', email: 'owner@example.com', password: '$2b$10$k9sF0dJ8Q7y9h8rJqGg8NuQz1rOe4x7C6tWZ6s0aGxN9v4xgW4T8m', role: 'OWNER' } }, { upsert: true });

  console.log("Seed complete:", { branches: branches.length });
  await mongoose.disconnect();
})();
