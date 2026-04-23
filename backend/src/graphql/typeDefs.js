const { gql } = require("apollo-server-express");

module.exports = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
  }

  type Issue {
  id: ID!
  title: String!
  description: String!
  category: String!
  status: String!
  location: String!
  priority: String!
  assignedTo: String
  imageUrl: String
  aiSummary: String
  aiCategory: String
  aiPriorityReason: String
  reportedBy: User
  createdAt: String
  updatedAt: String
}

  type AuthPayload {
    token: String!
    user: User!
  }

  type AnalyticsOverview {
    totalIssues: Int!
    openIssues: Int!
    inProgressIssues: Int!
    resolvedIssues: Int!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    role: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateIssueInput {
    title: String!
    description: String!
    category: String!
    location: String!
    priority: String!
    imageUrl: String
  }

  type Query {
    me: User
    issues: [Issue!]!
    myIssues: [Issue!]!
    issue(id: ID!): Issue
    analyticsOverview: AnalyticsOverview!
    chatWithCivicBot(prompt: String!): String!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    assignIssue(id: ID!, assignedTo: String!): Issue!
    createIssue(input: CreateIssueInput!): Issue!
    updateIssueStatus(id: ID!, status: String!): Issue!
  }
`;
