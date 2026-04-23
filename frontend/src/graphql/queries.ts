import { gql } from "@apollo/client";

export const GET_ISSUES = gql`
  query GetIssues {
    issues {
      id
      title
      description
      category
      status
      priority
      location
      assignedTo
      createdAt
      updatedAt
    }
  }
`;

export const GET_ISSUE_STATS = gql`
  query GetIssueStats {
    issueStats {
      totalIssues
      openIssues
      inProgress
      resolved
      highPriority
      backlog
    }
  }
`;

export const GET_ISSUES_BY_CATEGORY = gql`
  query GetIssuesByCategory {
    issuesByCategory {
      category
      count
    }
  }
`;

export const GET_ISSUES_BY_STATUS = gql`
  query GetIssuesByStatus {
    issuesByStatus {
      status
      count
    }
  }
`;

export const GET_ISSUE_TRENDS = gql`
  query GetIssueTrends {
    issueTrends {
      date
      reported
      resolved
      backlog
    }
  }
`;
