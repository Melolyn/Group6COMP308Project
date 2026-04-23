import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { gql } from "@apollo/client";
import { apolloClient } from "./apolloClient";
import type { LoginFormData, RegisterFormData, User } from "../types/user";

type AuthPayload = {
  token: string;
  user: User;
};

type LoginMutationData = {
  login: AuthPayload;
};

type RegisterMutationData = {
  register: AuthPayload;
};

type LoginMutationVariables = {
  input: {
    email: string;
    password: string;
  };
};

type RegisterMutationVariables = {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: RegisterFormData["role"];
  };
};

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export const authService = {
  async login(data: LoginFormData): Promise<User> {
    try {
      const result = await apolloClient.mutate<
        LoginMutationData,
        LoginMutationVariables
      >({
        mutation: LOGIN_MUTATION,
        variables: {
          input: {
            email: data.email.trim().toLowerCase(),
            password: data.password,
          },
        },
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Login GraphQL errors:", result.error.errors);
          throw new Error(result.error.errors[0]?.message || "Login failed");
        }
        throw new Error(result.error.message);
      }

      const payload = result.data?.login;
      if (!payload?.token || !payload.user) {
        throw new Error("Login failed");
      }

      localStorage.setItem("civicai_token", payload.token);
      localStorage.setItem("civicai_user", JSON.stringify(payload.user));

      return payload.user;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error("Login error:", message);
      throw new Error(message);
    }
  },

  async register(data: RegisterFormData): Promise<User> {
    try {
      const input = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        role: data.role,
      };

      console.log("Register attempt:", {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        role: input.role,
      });

      const result = await apolloClient.mutate<
        RegisterMutationData,
        RegisterMutationVariables
      >({
        mutation: REGISTER_MUTATION,
        variables: { input },
        errorPolicy: "all",
      });

      if (result.error) {
        if (CombinedGraphQLErrors.is(result.error)) {
          console.error("Register GraphQL errors:", result.error.errors);
          throw new Error(
            result.error.errors[0]?.message || "Registration failed"
          );
        }
        throw new Error(result.error.message);
      }

      const payload = result.data?.register;
      if (!payload?.token || !payload.user) {
        throw new Error("Registration failed");
      }

      localStorage.setItem("civicai_token", payload.token);
      localStorage.setItem("civicai_user", JSON.stringify(payload.user));

      return payload.user;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error("Register error:", message);
      throw new Error(message);
    }
  },

  logout() {
    localStorage.removeItem("civicai_token");
    localStorage.removeItem("civicai_user");
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem("civicai_user");
    return raw ? (JSON.parse(raw) as User) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("civicai_token");
  },
};