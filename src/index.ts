import "reflect-metadata";
import { User } from "./entity/User";
import { AppDataSource } from "./data-source";
import { ResolverMap } from "./types/ResolverTypes";
import { createServer } from "@graphql-yoga/node";
import { Profile } from "./entity/Profile";
import { RelationCountAttribute } from "typeorm/query-builder/relation-count/RelationCountAttribute";

const typeDefs = /* GraphQL */ `
  type User {
    id: Int!
    firstName: String!
    profile: Profile
  }

  type Profile {
    favoriteColor: String!
  }

  type Query {
    hello: String
    user(id: Int!): User!
    users: [User!]!
  }

  input ProfileInput {
    favoriteColor: String!
  }

  type Mutation {
    createUser(firstName: String!, profile: ProfileInput): User!
    updateUser(id: Int!, firstName: String): Boolean
    deleteUser(id: Int!): Boolean
  }
`;
const resolvers: ResolverMap = {
  Query: {
    hello: () => "Hello from Yoga!",
    user: (_, { id }) =>
      User.findOne({ where: { id }, relations: { profile: true } }),
    users: () => User.find({ relations: { profile: true } }),
  },
  Mutation: {
    createUser: async (_, args) => {
      const profile = Profile.create({ ...args.profile });
      await profile.save();

      const user = User.create({
        firstName: args.firstName,
        // profileId: profile.id,
      });

      user.profile = profile;

      await user.save();

      console.log(user);

      return user;
    },
    updateUser: async (_, { id, ...args }) => {
      try {
        await User.update(id, args);
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },
    deleteUser: async (_, { id, ...args }) => {
      try {
        await User.remove(id);
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },
  },
};

const server = createServer({
  schema: {
    typeDefs,
    resolvers,
  },
});

AppDataSource.initialize().then(() => {
  server.start();
});
