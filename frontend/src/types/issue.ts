export type IssueStatus = "Open" | "In Review" | "In Progress" | "Resolved";

export type AccessibilityCategory =
  | "Sidewalk Obstruction"
  | "Broken Ramp"
  | "Crosswalk Signal"
  | "Transit Access"
  | "Building Entrance"
  | "Wayfinding"
  | "Washroom Access"
  | "Other";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: AccessibilityCategory;
  status: IssueStatus;
  location: string;
  priority: "Low" | "Medium" | "High";
  imageUrl?: string;
  aiSummary?: string;
  reportedBy?: string;
  createdAt: string;
  updatedAt: string;
}