// TO RUN: npx ts-node scripts/seed.tsgit

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      Users: "Amelia",
      EventName: "Bread Meeting",
      TimeDate: "10/18/24",
      Description: "Jumbo Code Meeting 1",
      MaxPeople: "14",
    },
    {
      Users: "Tomas",
      EventName: "Roses Meeting",
      TimeDate: "10/24/24",
      Description: "Jumbo Code Meeting 2",
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
