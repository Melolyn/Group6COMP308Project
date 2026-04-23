import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
// @ts-ignore: CSS side-effect imports are resolved by the bundler at runtime.
import "./index.css";
import App from "./App";
import { apolloClient } from "./services/apolloClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </StrictMode>
);