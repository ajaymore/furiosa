import { ApolloServer, gql } from "apollo-server-micro";
import { schema } from "../../schema";

// const typeDefs = gql`
//   type Query {
//     users: [User!]!
//   }
//   type User {
//     name: String
//   }
// `;

// const resolvers = {
//   Query: {
//     users(parent, args, context) {
//       return [{ name: "Nextjs" }];
//     }
//   }
// };

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  tracing: true,
  context: async ({ req }) => {
    return {
      prisma: req.prisma,
      user: req.user,
      transporter: req.transporter
    };
  },
  playground: {
    settings: {
      "request.credentials": "same-origin"
    }
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({ path: "/api/graphql" });
