export type IssueStatus = "Open" | "In Review" | "In Progress" | "Resolved" | "Backlog";
export type IssuePriority = "Low" | "Medium" | "High";

export type IssueCategory =
  | "Pothole"
  | "Broken Streetlight"
  | "Flooding"
  | "Sidewalk Accessibility"
  | "Safety Hazard"
  | "Garbage Collection"
  | "Traffic Signal"
  | "Park Maintenance"
  | "Noise Complaint"
  | "Other";

<<<<<<< Rohit-Budha
export type IssuePriority = "Low" | "Medium" | "High";
=======
// Alias kept for backward compatibility in citizen-facing forms.
export type AccessibilityCategory = IssueCategory;

export interface IssueFilters {
  status: "All" | IssueStatus;
  category: "All" | IssueCategory;
  priority: "All" | IssuePriority;
  search: string;
}

export interface IssueStats {
  totalIssues: number;
  openIssues: number;
  inProgress: number;
  resolved: number;
  highPriority: number;
  backlog: number;
}

export interface DistributionPoint {
  name: string;
  count: number;
}

export interface IssueTrendPoint {
  date: string;
  reported: number;
  resolved: number;
  open: number;
  backlog: number;
}

export interface IssueAnalyticsData {
  statusDistribution: DistributionPoint[];
  categoryDistribution: DistributionPoint[];
  trend: IssueTrendPoint[];
}
>>>>>>> main

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: string;
  priority: IssuePriority;
<<<<<<< Rohit-Budha

  // 🔥 NEW FIELD (assignment)
  assignedTo?: string;

=======
  assignedTo?: string;
  keywords?: string[];
>>>>>>> main
  imageUrl?: string;
  aiSummary?: string;

  reportedBy?: string;

  createdAt: string;
  updatedAt: string;
}