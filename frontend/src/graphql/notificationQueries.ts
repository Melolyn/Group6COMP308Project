import { gql } from "@apollo/client";

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    myNotifications {
      id
      message
      type
      isRead
      createdAt
      issue {
        id
        title
        status
      }
    }
  }
`;