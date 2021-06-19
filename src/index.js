const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

// dummy data
let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
  },
  {
    id: 'link-1',
    url: 'www.howtographql.com/graphql-js',
    description: 'A deeper dive specifically for GraphQL in JavaScript'
  }
]

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackerclone News`,
    feed: () => links
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link)
      return link
    }
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

// GraphQLServer allows us to reference for typeDefs, as below, instead of forcing us to have string variable in the same file
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf-8'
  ),
  resolvers
})

server
  .listen()
  .then(
    ({ url }) => console.log(`Server is running on ${url}`)
  );