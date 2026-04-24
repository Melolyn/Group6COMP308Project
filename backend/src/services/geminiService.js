const { GoogleGenerativeAI } = require("@google/generative-ai");
const Issue = require("../models/Issue");

const apiKey = process.env.GOOGLE_API_KEY;

let model = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

function formatIssuesForPrompt(issues) {
  if (!issues.length) return "No recent issues available.";

  return issues
    .map((issue, index) => {
      return `
Issue ${index + 1}
Title: ${issue.title || "N/A"}
Category: ${issue.category || "N/A"}
Status: ${issue.status || "N/A"}
Location: ${issue.location || "N/A"}
Priority: ${issue.priority || "N/A"}
Summary: ${issue.aiSummary || "N/A"}
Reported At: ${
        issue.createdAt
          ? new Date(issue.createdAt).toLocaleDateString("en-CA")
          : "N/A"
      }
      `.trim();
    })
    .join("\n\n");
}

async function generateIssueInsights(issueInput) {
  if (!model) {
    return {
      aiSummary: `Accessibility issue reported: ${issueInput.title}. Located at ${issueInput.location}.`,
      aiCategory: issueInput.category,
      aiPriorityReason: "AI service unavailable, using fallback insight.",
    };
  }

  const prompt = `
You are an AI assistant for a municipal accessibility reporting system.

Analyze this issue report and return JSON only.

Title: ${issueInput.title}
Description: ${issueInput.description}
Category: ${issueInput.category}
Location: ${issueInput.location}
Priority: ${issueInput.priority}

Return JSON in this exact format:
{
  "aiSummary": "2-3 sentence clear and helpful summary",
  "aiCategory": "best matching category",
  "aiPriorityReason": "short reason why this priority makes sense"
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
      aiPriorityReason: "AI request failed, using fallback insight.",
    };
  }
}

async function chatWithCivicBot(userPrompt) {
  const normalizedPrompt = userPrompt.trim().toLowerCase();

  if (["hi", "hello", "hey"].includes(normalizedPrompt)) {
    return "Hello! How can I help you today?";
  }

  if (normalizedPrompt.includes("how are you")) {
    return "I’m doing well, thanks for asking. How can I help you today?";
  }

  if (!model) {
    return "I can help with accessibility issues, reporting guidance, and general advice. AI service is currently unavailable.";
  }

  const issues = await Issue.find().sort({ createdAt: -1 }).limit(20);
  const issueContext = formatIssuesForPrompt(issues);

  const chatbotPrompt = `
You are CivicBot, a friendly and helpful assistant for a Canadian civic accessibility system.

Your role:
- help users report and understand accessibility issues
- answer questions based on available issue data
- provide practical advice and guidance

Style rules:
- friendly, natural, and professional
- concise but helpful
- advise and guide, do not warn unnecessarily
- avoid robotic phrases like "as an AI"
- keep answers short unless more detail is needed

If data is missing, say so honestly.

Issue data:
${issueContext}

User:
${userPrompt}

Reply:
`;

  try {
    const result = await model.generateContent(chatbotPrompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini chatbot error:", error.message);
    return "I can still help with reporting issues, tracking updates, and general accessibility guidance. What would you like to know?";
  }
}

module.exports = {
  generateIssueInsights,
  chatWithCivicBot,
};