const feed = (parent, args, context, info) => {
  return context.prisma.link.findMany();
}

const link = (parent, { id }, context, info) => {
  return context.prisma.link.findUnique({
    where: {
      id: parseInt(id)
    }
  })
}

const user = (parent, { id }, { prisma }) => {
  return context.prisma.link.findUnique({
    where: {
      id: parseInt(id)
    }
  })
}

const users = (parent, args, context, info) => {
  return context.prisma.user.findMany();
}

module.exports = {
  feed,
  link,
  user,
  users
}