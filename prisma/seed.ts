import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const newUser: Prisma.UserCreateInput = {
  name: "clabu",
};

async function main() {
  console.log("Start seeding...");
  const user = await prisma.user.create({ data: newUser });
  console.log(`Created user with id: ${user.id}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });
