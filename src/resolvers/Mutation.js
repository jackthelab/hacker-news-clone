const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { appSecret, getUserId } = require('../utils');

// new post
async function post(parent, args, context) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      description: args.description,
      url: args.url,
      postedBy: { connect: { id: userId } }
    }
  })
  context.pubsub.publish("NEW_LINK", newLink)
  
  return newLink;
}

// updating a link
async function updateLink(parent, args, { prisma }) {
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
  const updateLink = await prisma.link.update({
    where: {
      id: parseInt(args.id)
    },
    data: updatedData
  });

  //return the updated link
  return updateLink;
}

// deleting a link
async function deleteLink(parent, { id }) {
  const deleteLink = await prisma.link.delete({
    where: {
      id: parseInt(id)
    }
  })
}

// signup resolver -- need to install bcrypt library
async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)

  const user = await context.prisma.user.create({
    data: {
      ...args,
      password
    }
  })

  const token = jwt.sign({ userId: user.id }, appSecret)

  return {
    token,
    user
  }

}

// login resolver
async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email
    }
  })

  if(!user) {
    throw new Error("No such user found")
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if(!valid) {
    throw new Error("Invalid password")
  }

  const token = jwt.sign({ userId: user.id }, appSecret)

  return {
    token,
    user 
  }
}

module.exports = {
  post,
  updateLink,
  deleteLink,
  signup,
  login
}