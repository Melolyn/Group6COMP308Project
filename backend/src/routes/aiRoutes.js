const express = require("express");
const router = express.Router();
const { generateIssueInsight } = require("../services/aiInsightService");

router.post("/insight", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required" });
    }

    const answer = await generateIssueInsight(question.trim());

    res.json({ answer });
  } catch (error) {
    console.error("AI insight error:", error);
    res.status(500).json({
      error: "Failed to generate AI insight",
    });
  }
});

module.exports = router;