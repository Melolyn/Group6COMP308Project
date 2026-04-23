import { gql } from "@apollo/client";

export const ASSIGN_ISSUE_MUTATION = gql`
  mutation AssignIssue($id: ID!, $assignedTo: String!) {
    assignIssue(id: $id, assignedTo: $assignedTo) {
      id
      title
      status
      assignedTo
      priority
    }
  }
`;