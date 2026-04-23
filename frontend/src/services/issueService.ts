import { mockIssues } from "../data/mockIssues";
import type { Issue, IssueStats } from "../types/issue";

function delay(ms = 450) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function calculateIssueStats(issues: Issue[]): IssueStats {
  return {
    totalIssues: issues.length,
    openIssues: issues.filter((issue) => issue.status === "Open").length,
    inProgress: issues.filter((issue) => issue.status === "In Progress").length,
    resolved: issues.filter((issue) => issue.status === "Resolved").length,
    highPriority: issues.filter((issue) => issue.priority === "High").length,
    backlog: issues.filter((issue) => issue.status === "Backlog").length,
  };
}

export const issueService = {
  async getAllIssues(): Promise<Issue[]> {
    await delay();
    return Promise.resolve(mockIssues);
  },

  async getStaffIssues(): Promise<Issue[]> {
    await delay();
    return Promise.resolve(mockIssues);
  },

  async getIssueStats(): Promise<IssueStats> {
    await delay();
    return Promise.resolve(calculateIssueStats(mockIssues));
  },

  async getIssueById(id: string): Promise<Issue | undefined> {
    await delay();
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