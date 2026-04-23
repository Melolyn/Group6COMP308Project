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

export type IssuePriority = "Low" | "Medium" | "High";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: string;
  priority: IssuePriority;

  // 🔥 NEW FIELD (assignment)
  assignedTo?: string;

  imageUrl?: string;
  aiSummary?: string;
  reportedBy?: string;
  createdAt: string;
  updatedAt: string;
}