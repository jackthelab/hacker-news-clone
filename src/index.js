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

let idCount = links.length

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackerclone News`,
    feed: () => links,
    link: (parent, { id }) => {
      return links.find( (link) => link.id === id )
    }
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
    },
    updateLink: (parent, args) => {
      // find the desired link based on id passed in args
      const selectedLink = links.find( (link) => link.id == args.id );

      // make desired changes to the link
      if(args.url) {
        selectedLink.url = args.url;
      }
      if(args.description) {
        selectedLink.description = args.description;
      }

      //return the updated link
      return selectedLink;
    },
    deleteLink: (parent, { id }) => {
      // find index of desired link based on id passed in args, abstracted to { id } here
      const selectedLinkIndex = links.findIndex( (link) => link.id === id );

      const startLength = links.length;

      // delete link at above index from links list.
      let removedLink = links[selectedLinkIndex]
      links.splice(selectedLinkIndex, 1);

      // return deleted Link
      if(links.length + 1 === startLength) {
        // return `Successfully deleted ${ id }`;
        return removedLink;
      } else {
        return 'Failed to remove link'
      }
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

// GraphQLServer allows us to reference external files with 'fs' for typeDefs, as below, instead of forcing us to have string variable in the same file
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