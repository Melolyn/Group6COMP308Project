const { GoogleGenerativeAI } = require("@google/generative-ai");
const Issue = require("../models/Issue");

const apiKey = process.env.GOOGLE_API_KEY;

let model = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

async function generateIssueInsights(issueInput) {
  if (!model) {
    return {
      aiSummary: `Accessibility issue reported: ${issueInput.title}. Located at ${issueInput.location}.`,
      aiCategory: issueInput.category,
      aiPriorityReason: "Gemini API key not configured, using fallback summary.",
    };
  }

  const prompt = `
You are an AI assistant for a Canadian municipal accessibility issue tracker.

Analyze this issue report and return JSON only.

Issue Title: ${issueInput.title}
Description: ${issueInput.description}
Category: ${issueInput.category}
Location: ${issueInput.location}
Priority: ${issueInput.priority}

Return JSON in this exact format:
{
  "aiSummary": "2-3 sentence concise public-service summary",
  "aiCategory": "best matching category",
  "aiPriorityReason": "short explanation for why this priority makes sense"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      aiSummary:
        parsed.aiSummary ||
        `Accessibility issue reported: ${issueInput.title}. Located at ${issueInput.location}.`,
      aiCategory: parsed.aiCategory || issueInput.category,
      aiPriorityReason:
        parsed.aiPriorityReason || "Priority determined from issue details.",
    };
  } catch (error) {
    console.error("Gemini issue insight error:", error.message);

    return {
      aiSummary: `Accessibility issue reported: ${issueInput.title}. Located at ${issueInput.location}.`,
      aiCategory: issueInput.category,
      aiPriorityReason: "Gemini request failed, using fallback summary.",
    };
  }
}

async function chatWithCivicBot(prompt) {
  const recentIssues = await Issue.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select("title category status location priority aiSummary createdAt");

  const issueContext = recentIssues.length
    ? recentIssues
        .map(
          (issue, index) =>
            `${index + 1}. Title: ${issue.title} | Category: ${issue.category} | Status: ${issue.status} | Location: ${issue.location} | Priority: ${issue.priority} | Summary: ${issue.aiSummary || "N/A"}`
        )
        .join("\n")
    : "No recent issues available.";

  if (!model) {
    return `CivicBot fallback response: I can help with issue status, trends, and accessibility reports. Current recent issue context: ${issueContext}`;
  }

  const chatbotPrompt = `
You are CivicBot, an AI assistant for a Canadian municipality accessibility issue tracker.

Your job:
- Answer questions about local accessibility issues
- Summarize open/resolved trends
- Be concise, practical, and helpful
- If the user asks about trends, base it on the recent issue data below
- If the user asks something unrelated, politely steer back to civic accessibility reporting, municipal issue tracking, or public service insights

Recent issue data:
${issueContext}

User question:
${prompt}

Answer in a clear, helpful, municipal-service style.
`;

  try {
    const result = await model.generateContent(chatbotPrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini chatbot error:", error.message);
    return "I’m having trouble generating a response right now. Please try again.";
  }
}

module.exports = {
  generateIssueInsights,
  chatWithCivicBot,
};