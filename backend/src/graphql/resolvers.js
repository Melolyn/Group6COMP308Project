const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");
const Issue = require("../models/Issue");
const generateToken = require("../utils/generateToken");
const {
  generateIssueInsights,
  chatWithCivicBot,
} = require("../services/geminiService");

module.exports = {
  // Field resolver for Issue
  // Lets frontend know whether the current logged-in user already supported the issue
  Issue: {
    supportedByCurrentUser: (issue, _, { user }) => {
      if (!user || !issue.supporters) return false;

      return issue.supporters.some(
        (supporterId) => supporterId.toString() === user.id.toString()
      );
    },
  },

  Query: {
    // Return currently logged-in user
    me: async (_, __, { user }) => {
      if (!user) return null;
      return await User.findById(user.id);
    },

    // Return all issues for staff / advocate dashboards
    issues: async () => {
      return await Issue.find().populate("reportedBy").sort({ createdAt: -1 });
    },

    // Return only issues reported by the logged-in resident
    myIssues: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Issue.find({ reportedBy: user.id })
        .populate("reportedBy")
        .sort({ createdAt: -1 });
    },

    // Return one issue by id
    issue: async (_, { id }) => {
      return await Issue.findById(id).populate("reportedBy");
    },

    // Summary counts for analytics dashboard
    analyticsOverview: async () => {
      const totalIssues = await Issue.countDocuments();
      const openIssues = await Issue.countDocuments({ status: "Open" });
      const inProgressIssues = await Issue.countDocuments({
        status: { $in: ["In Review", "In Progress"] },
      });
      const resolvedIssues = await Issue.countDocuments({ status: "Resolved" });

      return {
        totalIssues,
        openIssues,
        inProgressIssues,
        resolvedIssues,
      };
    },

    // Gemini-powered civic chatbot
    chatWithCivicBot: async (_, { prompt }) => {
      return await chatWithCivicBot(prompt);
    },
  },

  Mutation: {
    // Register a new user
    register: async (_, { input }) => {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await User.create({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: hashedPassword,
        role: input.role,
      });

      return {
        token: generateToken(user),
        user,
      };
    },

    // Login existing user
    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) throw new Error("Invalid email or password");

      const isMatch = await bcrypt.compare(input.password, user.password);
      if (!isMatch) throw new Error("Invalid email or password");

      return {
        token: generateToken(user),
        user,
      };
    },

    // Resident creates a new issue
    createIssue: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const aiResult = await generateIssueInsights(input);

      const issue = await Issue.create({
        title: input.title,
        description: input.description,
        category: input.category,
        location: input.location,
        priority: input.priority,
        imageUrl: input.imageUrl || "",
        aiSummary: aiResult.aiSummary,
        aiCategory: aiResult.aiCategory,
        aiPriorityReason: aiResult.aiPriorityReason,
        reportedBy: user.id,
      });

      return await Issue.findById(issue._id).populate("reportedBy");
    },

    // Staff updates issue workflow status
    updateIssueStatus: async (_, { id, status }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      if (user.role !== "staff") {
        throw new Error("Unauthorized");
      }

      const validStatuses = ["Open", "In Review", "In Progress", "Resolved"];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status value");
      }

      const updatedIssue = await Issue.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate("reportedBy");

      if (!updatedIssue) {
        throw new Error("Issue not found");
      }

      return updatedIssue;
    },

    // Staff assigns issue to a municipal team
    assignIssue: async (_, { id, assignedTo }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      if (user.role !== "staff") {
        throw new Error("Unauthorized");
      }

      const issue = await Issue.findById(id);
      if (!issue) {
        throw new Error("Issue not found");
      }

      issue.assignedTo = assignedTo;

      // Move newly assigned issue into review automatically
      if (issue.status === "Open") {
        issue.status = "In Review";
      }

      await issue.save();

      return await Issue.findById(issue._id).populate("reportedBy");
    },

    // Community Advocate supports an issue once only
    upvoteIssue: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      if (user.role !== "advocate") {
        throw new Error("Unauthorized");
      }

      const issue = await Issue.findById(id);
      if (!issue) {
        throw new Error("Issue not found");
      }

      // Make sure supporters array exists
      if (!issue.supporters) {
        issue.supporters = [];
      }

      // Prevent duplicate support from the same advocate
      const alreadySupported = issue.supporters.some(
        (supporterId) => supporterId.toString() === user.id.toString()
      );

      if (alreadySupported) {
        throw new Error("You have already supported this issue");
      }

      // Add current user to supporters list
      issue.supporters.push(new mongoose.Types.ObjectId(user.id));

      // Keep upvotes count synced with unique supporters
      issue.upvotes = issue.supporters.length;

      await issue.save();

      return await Issue.findById(issue._id).populate("reportedBy");
    },
  },
};