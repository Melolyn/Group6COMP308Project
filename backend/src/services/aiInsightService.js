const { GoogleGenerativeAI } = require("@google/generative-ai");
const Issue = require("../models/Issue");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function formatIssuesForPrompt(issues) {
  if (!issues.length) return "No issues were found in the database.";

  return issues
    .map((issue, index) => {
      return `
Issue ${index + 1}
Title: ${issue.title || "N/A"}
Category: ${issue.category || "N/A"}
Status: ${issue.status || "N/A"}
Location: ${issue.location || "N/A"}
Description: ${issue.description || "N/A"}
Reported At: ${issue.createdAt ? new Date(issue.createdAt).toLocaleString() : "N/A"}
      `.trim();
    })
    .join("\n\n");
}

async function generateIssueInsight(userQuestion) {
  const issues = await Issue.find().sort({ createdAt: -1 }).limit(50);

  const formattedIssues = formatIssuesForPrompt(issues);

  const prompt = `
You are CivicBot, an AI assistant for a Civic Accessibility project.

Use only the issue data below to answer the user.
If data is limited, say so clearly.
Do not invent facts.

User question:
${userQuestion}

Issue data:
${formattedIssues}

Return:
1. Summary
2. Main trends
3. Priority concerns
4. Recommendations
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return text;
}

module.exports = { generateIssueInsight };