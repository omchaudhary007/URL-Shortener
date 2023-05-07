import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true, index: true },
  createdAt: { type: Date, default: Date.now, expires: 2592000 },
});

export default mongoose.model("Url", urlSchema);
