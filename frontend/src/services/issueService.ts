import { mockIssues } from "../data/mockIssues";
import type { Issue } from "../types/issue";

export const issueService = {
  async getAllIssues(): Promise<Issue[]> {
    return Promise.resolve(mockIssues);
  },

  async getIssueById(id: string): Promise<Issue | undefined> {
    return Promise.resolve(mockIssues.find((issue) => issue.id === id));
  },

  async createIssue(issue: Omit<Issue, "id" | "createdAt" | "updatedAt">): Promise<Issue> {
    const newIssue: Issue = {
      ...issue,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    console.log("Mock created issue", newIssue);
    return Promise.resolve(newIssue);
  },
};