import type { Issue } from "../types/issue";

export const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Broken curb ramp near city hall",
    description:
      "The curb ramp is cracked and difficult to use with a wheelchair or stroller.",
    category: "Broken Ramp",
    status: "Open",
    location: "50 Centre St. S., Oshawa",
    priority: "High",
    imageUrl: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&w=1200&q=80",
    aiSummary:
      "High-priority accessibility issue affecting safe sidewalk-to-road transition.",
    reportedBy: "Lynn Zein",
    createdAt: "2026-04-18",
    updatedAt: "2026-04-18",
  },
  {
    id: "2",
    title: "Crosswalk audio signal not working",
    description:
      "Audio assistance at the pedestrian crossing has stopped working for visually impaired users.",
    category: "Crosswalk Signal",
    status: "In Review",
    location: "King St. W. & Simcoe St. N.",
    priority: "High",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    aiSummary:
      "Critical crossing support issue impacting independent mobility and safety.",
    reportedBy: "Jordan Smith",
    createdAt: "2026-04-17",
    updatedAt: "2026-04-19",
  },
  {
    id: "3",
    title: "Accessible washroom sign missing",
    description:
      "The accessibility sign outside the public washroom has been removed and visitors are confused.",
    category: "Wayfinding",
    status: "Resolved",
    location: "Memorial Park",
    priority: "Medium",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    aiSummary:
      "Wayfinding issue resolved after signage replacement.",
    reportedBy: "Ava Brown",
    createdAt: "2026-04-12",
    updatedAt: "2026-04-16",
  },
  {
    id: "4",
    title: "Sidewalk blocked by construction fence",
    description:
      "The temporary fence leaves no clear accessible path for wheelchair users.",
    category: "Sidewalk Obstruction",
    status: "In Progress",
    location: "Bond St. E.",
    priority: "High",
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    aiSummary:
      "Active obstruction reducing accessible pedestrian travel width.",
    reportedBy: "Chris Taylor",
    createdAt: "2026-04-14",
    updatedAt: "2026-04-20",
  },
];