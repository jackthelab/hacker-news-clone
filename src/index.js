const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackerclone News`,
    feed: async (parent, args, { prisma }) => {
      return await prisma.link.findMany();
    },
    link: async (parent, { id }, { prisma }) => {
      // abstracted out prisma from context or else would have written context.prisma.link.findUnique()
      // need to use parseInt here because prisma is looking for int but the query is sending as a string
      const link = await prisma.link.findUnique({
        where: {
          id: parseInt(id)
        }
      })

      return link;
    }
  },
  Mutation: {
    post: async (parent, args, context) => {
      const newLink = await context.prisma.link.create({
        data: {
          description: args.description,
          url: args.url
        }
      })
      return newLink;
    },
    updateLink: async (parent, args, { prisma }) => {
      // updated data object
      let updatedData;

      if(args.url && args.description) {
        updatedData = {
          url: args.url,
          description: args.description
        }
      } else if(args.url) {
        updatedData = {
          url: args.url
        }
      } else if(args.description) {
        updatedData = {
          description: args.description
        }
      }

      // find the desired link based on id passed in args
      const updateLink = prisma.link.update({
        where: {
          id: parseInt(args.id)
        },
        data: updatedData
      });

      //return the updated link
      return updateLink;
    },
    deleteLink: async (parent, { id }) => {
      const deleteLink = await prisma.link.delete({
        where: {
          id: parseInt(id)
        }
      })
    },
  // The entire Link resolver can be commented out since the only implementations we're using are trivial here
  // Link: {
  //   // id: (parent) => parent.id,
  //   // description: (parent) => parent.description,
  //   // url: (parent) => parent.url
  //   // or can remove these trivial resolvers as I've done by commenting out here and it will still work
  //   // the above resolvers still happen under the hood but don't need to type them
  // }
  }
}

// GraphQLServer allows us to reference external files with 'fs' for typeDefs, as below, instead of forcing us to have string variable in the same file
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf-8'
  ),
  resolvers,
  context: {
    prisma
  }
})

server
  .listen()
  .then(
    ({ url }) => console.log(`Server is running on ${url}`)
  );