const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // Issue title (short description)
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Full description of the issue
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Accessibility category (AI + user selected)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Workflow status (used by Municipal Staff)
    status: {
      type: String,
      enum: ["Open", "In Review", "In Progress", "Resolved"],
      default: "Open",
    },

    // Location (can later be extended to geo-coordinates)
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // Priority level (manual or AI-assisted)
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // ✅ Team-based assignment (Municipal Staff feature)
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

    // 🆕 Community Advocate Feature
    // Tracks how many users support this issue
    upvotes: {
      type: Number,
      default: 0,
    },

    // Stores which users have already supported this issue
    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Optional image uploaded by resident
    imageUrl: {
      type: String,
      default: "",
    },

    // AI-generated summary (Gemini)
    aiSummary: {
      type: String,
      default: "",
    },

    // AI-suggested category
    aiCategory: {
      type: String,
      default: "",
    },

    // AI reasoning for priority
    aiPriorityReason: {
      type: String,
      default: "",
    },

    // Reference to the user who reported the issue
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);