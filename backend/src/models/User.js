const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["resident", "staff", "advocate"],
      default: "resident",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);