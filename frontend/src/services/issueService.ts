<<<<<<< Rohit-Budha
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { gql } from "@apollo/client";
import { apolloClient } from "./apolloClient";
import type { Issue } from "../types/issue";
=======
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
>>>>>>> main

const GET_ALL_ISSUES = gql`
  query GetAllIssues {
    issues {
      id
      title
      description
      category
      status
      location
      priority
      assignedTo
      upvotes
      supportedByCurrentUser
      imageUrl
      aiSummary
      createdAt
      updatedAt
      reportedBy {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const GET_MY_ISSUES = gql`
  query GetMyIssues {
    myIssues {
      id
      title
      description
      category
      status
      location
      priority
      assignedTo
      upvotes
      supportedByCurrentUser
      imageUrl
      aiSummary
      createdAt
      updatedAt
      reportedBy {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const GET_ISSUE_BY_ID = gql`
  query GetIssueById($id: ID!) {
    issue(id: $id) {
      id
      title
      description
      category
      status
      location
      priority
      assignedTo
      upvotes
      supportedByCurrentUser
      imageUrl
      aiSummary
      createdAt
      updatedAt
      reportedBy {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const CREATE_ISSUE = gql`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      id
      title
      description
      category
      status
      location
      priority
      assignedTo
      upvotes
      supportedByCurrentUser
      imageUrl
      aiSummary
      createdAt
      updatedAt
      reportedBy {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const UPDATE_ISSUE_STATUS = gql`
  mutation UpdateIssueStatus($id: ID!, $status: String!) {
    updateIssueStatus(id: $id, status: $status) {
      id
      title
      description
      category
      status
      location
      priority
      assignedTo
      upvotes
      supportedByCurrentUser
      imageUrl
      aiSummary
      createdAt
      updatedAt
      reportedBy {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const ASSIGN_ISSUE = gql`
  mutation AssignIssue($id: ID!, $assignedTo: String!) {
    assignIssue(id: $id, assignedTo: $assignedTo) {
      id
      title
      description
      category
      status
      location
      priority
      assignedTo
      upvotes
      supportedByCurrentUser
      imageUrl
      aiSummary
      createdAt
      updatedAt
      reportedBy {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const UPVOTE_ISSUE = gql`
  mutation UpvoteIssue($id: ID!) {
    upvoteIssue(id: $id) {
      id
      title
      description
      category
      status
      location
      priority
      assignedTo
      upvotes
      supportedByCurrentUser
      imageUrl
      aiSummary
      createdAt
      updatedAt
      reportedBy {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

type IssueApiResponse = {
  id: string;
  title: string;
  description: string;
  category: Issue["category"];
  status: Issue["status"];
  location: string;
  priority: Issue["priority"];
  assignedTo?: string;
  upvotes?: number;
  supportedByCurrentUser?: boolean;
  imageUrl?: string;
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
  reportedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "resident" | "staff" | "advocate";
  };
};

type GetAllIssuesQuery = {
  issues: IssueApiResponse[];
};

type GetMyIssuesQuery = {
  myIssues: IssueApiResponse[];
};

type GetIssueByIdQuery = {
  issue?: IssueApiResponse | null;
};

type GetIssueByIdVariables = {
  id: string;
};

type CreateIssueMutation = {
  createIssue?: IssueApiResponse | null;
};

type CreateIssueVariables = {
  input: {
    title: string;
    description: string;
    category: Issue["category"];
    location: string;
    priority: Issue["priority"];
    imageUrl: string;
  };
};

type UpdateIssueStatusMutation = {
  updateIssueStatus?: IssueApiResponse | null;
};

type UpdateIssueStatusVariables = {
  id: string;
  status: Issue["status"];
};

type AssignIssueMutation = {
  assignIssue?: IssueApiResponse | null;
};

type AssignIssueVariables = {
  id: string;
  assignedTo: string;
};

type UpvoteIssueMutation = {
  upvoteIssue?: IssueApiResponse | null;
};

type UpvoteIssueVariables = {
  id: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

function handleApolloResultError(error: unknown, fallback: string): never {
  if (error instanceof Error) {
    throw new Error(error.message || fallback);
  }
  throw new Error(fallback);
}

const mapIssue = (issue: IssueApiResponse): Issue => ({
  id: issue.id,
  title: issue.title,
  description: issue.description,
  category: issue.category,
  status: issue.status,
  location: issue.location,
  priority: issue.priority,
  assignedTo: issue.assignedTo,
  upvotes: issue.upvotes,
  supportedByCurrentUser: issue.supportedByCurrentUser,
  imageUrl: issue.imageUrl,
  aiSummary: issue.aiSummary,
  reportedBy: issue.reportedBy?.id,
  createdAt: issue.createdAt,
  updatedAt: issue.updatedAt,
});

export const issueService = {
  async getAllIssues(): Promise<Issue[]> {
<<<<<<< Rohit-Budha
    try {
      const result = await apolloClient.query<GetAllIssuesQuery>({
        query: GET_ALL_ISSUES,
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Get all issues GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Failed to load issues");
        }
        throw new Error(result.error.message);
      }

      return (result.data?.issues ?? []).map(mapIssue);
    } catch (error: unknown) {
      console.error("Get all issues error:", getErrorMessage(error));
      handleApolloResultError(error, "Failed to load issues");
    }
  },

  async getMyIssues(): Promise<Issue[]> {
    try {
      const result = await apolloClient.query<GetMyIssuesQuery>({
        query: GET_MY_ISSUES,
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Get my issues GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Failed to load your issues");
        }
        throw new Error(result.error.message);
      }

      return (result.data?.myIssues ?? []).map(mapIssue);
    } catch (error: unknown) {
      console.error("Get my issues error:", getErrorMessage(error));
      handleApolloResultError(error, "Failed to load your issues");
    }
=======
    await delay();
    return Promise.resolve(mockIssues);
>>>>>>> main
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
<<<<<<< Rohit-Budha
    try {
      const result = await apolloClient.query<GetIssueByIdQuery, GetIssueByIdVariables>({
        query: GET_ISSUE_BY_ID,
        variables: { id },
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Get issue by id GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Failed to load issue details");
        }
        throw new Error(result.error.message);
      }

      return result.data?.issue ? mapIssue(result.data.issue) : undefined;
    } catch (error: unknown) {
      console.error("Get issue by id error:", getErrorMessage(error));
      handleApolloResultError(error, "Failed to load issue details");
    }
  },

  async createIssue(
    issue: Omit<Issue, "id" | "createdAt" | "updatedAt">
  ): Promise<Issue> {
    try {
      const result = await apolloClient.mutate<CreateIssueMutation, CreateIssueVariables>({
        mutation: CREATE_ISSUE,
        variables: {
          input: {
            title: issue.title,
            description: issue.description,
            category: issue.category,
            location: issue.location,
            priority: issue.priority,
            imageUrl: issue.imageUrl || "",
          },
        },
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Create issue GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Failed to create issue");
        }
        throw new Error(result.error.message);
      }

      if (!result.data?.createIssue) {
        throw new Error("Failed to create issue");
      }

      return mapIssue(result.data.createIssue);
    } catch (error: unknown) {
      console.error("Create issue error:", getErrorMessage(error));
      handleApolloResultError(error, "Failed to create issue");
    }
  },

  async updateIssueStatus(id: string, status: Issue["status"]): Promise<Issue> {
    try {
      const result = await apolloClient.mutate<
        UpdateIssueStatusMutation,
        UpdateIssueStatusVariables
      >({
        mutation: UPDATE_ISSUE_STATUS,
        variables: { id, status },
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Update issue status GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Failed to update issue status");
        }
        throw new Error(result.error.message);
      }

      if (!result.data?.updateIssueStatus) {
        throw new Error("Failed to update issue status");
      }

      return mapIssue(result.data.updateIssueStatus);
    } catch (error: unknown) {
      console.error("Update issue status error:", getErrorMessage(error));
      handleApolloResultError(error, "Failed to update issue status");
    }
=======
    await delay();
    return Promise.resolve(mockIssues.find((issue) => issue.id === id));
>>>>>>> main
  },

  async assignIssue(id: string, assignedTo: string): Promise<Issue> {
    try {
      const result = await apolloClient.mutate<
        AssignIssueMutation,
        AssignIssueVariables
      >({
        mutation: ASSIGN_ISSUE,
        variables: { id, assignedTo },
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Assign issue GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Failed to assign issue");
        }
        throw new Error(result.error.message);
      }

      if (!result.data?.assignIssue) {
        throw new Error("Failed to assign issue");
      }

      return mapIssue(result.data.assignIssue);
    } catch (error: unknown) {
      console.error("Assign issue error:", getErrorMessage(error));
      handleApolloResultError(error, "Failed to assign issue");
    }
  },

  async upvoteIssue(id: string): Promise<Issue> {
    try {
      const result = await apolloClient.mutate<
        UpvoteIssueMutation,
        UpvoteIssueVariables
      >({
        mutation: UPVOTE_ISSUE,
        variables: { id },
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Upvote issue GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Failed to support issue");
        }
        throw new Error(result.error.message);
      }

      if (!result.data?.upvoteIssue) {
        throw new Error("Failed to support issue");
      }

      return mapIssue(result.data.upvoteIssue);
    } catch (error: unknown) {
      console.error("Upvote issue error:", getErrorMessage(error));
      handleApolloResultError(error, "Failed to support issue");
    }
  },
};