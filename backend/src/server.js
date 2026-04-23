require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const getUser = require("./middleware/auth");
const aiRoutes = require("./routes/aiRoutes");

async function startServer() {
  const app = express();

  app.use(cors());

  await connectDB();

  // Only parse JSON for REST API routes
  app.use("/api/ai", express.json(), aiRoutes);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const user = getUser(req);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("GraphQL: http://localhost:4000/graphql");
    console.log("AI API: http://localhost:4000/api/ai/insight");
  });
}

startServer();