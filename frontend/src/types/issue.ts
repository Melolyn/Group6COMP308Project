// Issue status (workflow)
export type IssueStatus =
  | "Open"
  | "In Review"
  | "In Progress"
  | "Resolved";

// Priority levels
export type IssuePriority = "Low" | "Medium" | "High";

// Accessibility-focused categories (your project focus)
export type IssueCategory =
  | "Sidewalk Obstruction"
  | "Broken Ramp"
  | "Crosswalk Signal"
  | "Transit Access"
  | "Building Entrance"
  | "Wayfinding"
  | "Washroom Access"
  | "Other";

// Main Issue interface
export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: string;
  priority: IssuePriority;

  // Municipal staff assignment
  assignedTo?: string;

  // 🔥 Community advocate feature
  upvotes?: number;
  supportedByCurrentUser?: boolean;

  imageUrl?: string;
  aiSummary?: string;

  reportedBy?: string;

  createdAt: string;
  updatedAt: string;
}