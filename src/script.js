const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function createLink(newDescription, newUrl) {
  prisma.link.create({
    data: {
      description: newDescription,
      url: newUrl
    }
  })
}

async function main() {
  const newLink = await createLink("Fullstack tutorial for GraphQL", "www.howtographql.com");
  const allLinks = await prisma.link.findMany();
  console.log(allLinks);
}

main()
  .catch( e => {
    throw e;
  })
  .finally( async () => {
    await prisma.$disconnect()
  })