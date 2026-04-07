const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Url", UrlSchema);
