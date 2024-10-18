// TO RUN: npx ts-node scripts/seed.tsgit

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      EventName: "Bread Meeting",
      Description: "Jumbo Code Meeting 1",
      MaxPeople: "14",
    },
    {
      firstName: "Roses Meeting",
      lastName: "Jumbo Code Meeting 2",
      MaxPeople: "25",
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      // <---- change to event
      data: event,
    });
  }

  console.log("Events created successfully!");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
