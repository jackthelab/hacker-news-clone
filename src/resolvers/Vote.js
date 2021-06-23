const link = (parent, args, { prisma }) => {
  return prisma.vote.findUnique({
    where: {
      id: parent.id
    }
  }).link()
}

const user = (parent, args, { prisma }) => {
  return prisma.vote.findUnique({
    where: {
      id: parent.id
    }
  }).user()
}

module.exports = {
  link,
  user
}