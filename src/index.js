const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('./utils');

// resolver files -- consider factoring this out?
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Link = require('./resolvers/Link');
const User = require('./resolvers/User');

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
  Link,
  User
}

// GraphQLServer allows us to reference external files with 'fs' for typeDefs, as below, instead of forcing us to have string variable in the same file
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf-8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId:
        req && req.headers.authorization ? getUserId(req) : null
    }
  }
})

server
  .listen()
  .then(
    ({ url }) => console.log(`Server is running on ${url}`)
  );