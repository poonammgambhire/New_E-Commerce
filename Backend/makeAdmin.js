import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URL);

const result = await userModel.findOneAndUpdate(
  { email: "admin@gmail.com" }, // ✅ तुमचा email टाका
  { role: "admin" },
  { new: true }
);

console.log("Updated Role:", result.role);
await mongoose.disconnect();