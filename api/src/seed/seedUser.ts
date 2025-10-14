import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";

(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  const email = "admin@carenet.local";
  const name = "Admin";
  const passwordHash = await bcrypt.hash("Admin@1234", 12);
  const user = await User.findOneAndUpdate(
    { email },
    { email, name, passwordHash, role: "admin", isActive: true },
    { upsert: true, new: true }
  );
  console.log("Seeded admin:", user.email);
  process.exit(0);
})();
