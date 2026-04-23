import { mockIssues } from "../data/mockIssues";
import type {
  DistributionPoint,
  Issue,
  IssueAnalyticsData,
  IssueCategory,
  IssueStatus,
  IssueTrendPoint,
} from "../types/issue";

function delay(ms = 450) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function countByStatus(issues: Issue[]): DistributionPoint[] {
  const statuses: IssueStatus[] = ["Open", "In Progress", "Resolved", "Backlog"];
  return statuses.map((status) => ({
    name: status,
    count: issues.filter((issue) => issue.status === status).length,
  }));
}

function countByCategory(issues: Issue[]): DistributionPoint[] {
  const categoryMap = new Map<IssueCategory, number>();
  issues.forEach((issue) => {
    categoryMap.set(issue.category, (categoryMap.get(issue.category) ?? 0) + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function buildIssueTrend(issues: Issue[]): IssueTrendPoint[] {
  const dateMap = new Map<string, IssueTrendPoint>();
  const sortedIssues = [...issues].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  sortedIssues.forEach((issue) => {
    const current = dateMap.get(issue.createdAt) ?? {
      date: issue.createdAt,
      reported: 0,
      resolved: 0,
      open: 0,
      backlog: 0,
    };

    current.reported += 1;
    if (issue.status === "Resolved") {
      current.resolved += 1;
    }
    if (issue.status === "Open" || issue.status === "In Progress" || issue.status === "In Review") {
      current.open += 1;
    }
    if (issue.status === "Backlog") {
      current.backlog += 1;
    }
    dateMap.set(issue.createdAt, current);
  });

  let runningOpen = 0;
  let runningBacklog = 0;

  return Array.from(dateMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((point) => {
      runningOpen += point.open;
      runningBacklog += point.backlog;
      return {
        ...point,
        open: runningOpen,
        backlog: runningBacklog,
      };
    });
}

export const analyticsService = {
  async getAnalyticsData(): Promise<IssueAnalyticsData> {
    await delay();
    return Promise.resolve({
      statusDistribution: countByStatus(mockIssues),
      categoryDistribution: countByCategory(mockIssues),
      trend: buildIssueTrend(mockIssues),
    });
  },
};
