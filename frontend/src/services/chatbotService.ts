import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { gql } from "@apollo/client";
import { apolloClient } from "./apolloClient";

const CHAT_WITH_CIVIC_BOT = gql`
  query ChatWithCivicBot($prompt: String!) {
    chatWithCivicBot(prompt: $prompt)
  }
`;

type ChatWithCivicBotQuery = {
  chatWithCivicBot: string;
};

type ChatWithCivicBotVariables = {
  prompt: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export const chatbotService = {
  async sendMessage(prompt: string): Promise<string> {
    try {
      const result = await apolloClient.query<
        ChatWithCivicBotQuery,
        ChatWithCivicBotVariables
      >({
        query: CHAT_WITH_CIVIC_BOT,
        variables: { prompt },
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          throw new Error(
            result.error.errors[0]?.message || "Failed to get chatbot response"
          );
        }
        throw new Error(result.error.message);
      }

      return result.data?.chatWithCivicBot || "No response from CivicBot.";
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error));
    }
  },
};