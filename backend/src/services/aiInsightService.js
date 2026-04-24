const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GOOGLE_API_KEY;

let model = null;

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// 🔧 Safe JSON parser (prevents crashes)
function safeParseJSON(text) {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

async function generateIssueInsights(issueInput) {
  // ✅ Fallback if AI not available
  if (!model) {
    return {
      aiSummary: `Accessibility issue reported: ${issueInput.title}. Located at ${issueInput.location}.`,
      aiCategory: issueInput.category,
      aiPriorityReason: "AI service unavailable, using fallback.",
    };
  }

  const prompt = `
You are an AI assistant for a Canadian municipal accessibility reporting system.

Analyze the issue and return JSON ONLY.

Title: ${issueInput.title}
Description: ${issueInput.description}
Category: ${issueInput.category}
Location: ${issueInput.location}
Priority: ${issueInput.priority}

Rules:
- Keep summary clear and helpful
- Do not include extra text outside JSON
- Keep reasoning short and practical

Return strictly:
{
  "aiSummary": "2-3 sentence clear and helpful summary",
  "aiCategory": "best matching category",
  "aiPriorityReason": "short reason for priority"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = safeParseJSON(text);

    // ✅ If parsing fails → fallback safely
    if (!parsed) {
      throw new Error("Invalid JSON from AI");
    }

    return {
      aiSummary:
        parsed.aiSummary ||
        `Accessibility issue reported: ${issueInput.title}. Located at ${issueInput.location}.`,
      aiCategory: parsed.aiCategory || issueInput.category,
      aiPriorityReason:
        parsed.aiPriorityReason || "Priority based on issue details.",
    };
  } catch (error) {
    console.error("Gemini insight error:", error.message);

    // ✅ Always return safe fallback (never break app)
    return {
      aiSummary: `Accessibility issue reported: ${issueInput.title}. Located at ${issueInput.location}.`,
      aiCategory: issueInput.category,
      aiPriorityReason: "AI processing failed, using fallback.",
    };
  }
}

module.exports = { generateIssueInsights };