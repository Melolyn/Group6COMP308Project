const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Open", "In Review", "In Progress", "Resolved"],
      default: "Open",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // Controlled assignment (important for staff dashboard)
    assignedTo: {
      type: String,
      enum: [
        "Unassigned",
        "Accessibility Team",
        "Transit Operations",
        "Public Works",
        "Traffic Signals",
      ],
      default: "Unassigned",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    aiSummary: {
      type: String,
      default: "",
    },

    aiCategory: {
      type: String,
      default: "",
    },

    aiPriorityReason: {
      type: String,
      default: "",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);