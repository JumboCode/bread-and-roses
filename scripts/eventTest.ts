// TO RUN: npx ts-node scripts/eventTest.ts

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const events = [
    {
      EventName: "Bread Meeting",
      TimeDate: "2022-01-20T12:01:30.543Z",
      Description: "Jumbo Code Meeting 1",
      MaxPeople: 14,
    },
    {
      EventName: "Roses Meeting",
      TimeDate: "2022-01-20T12:01:30.543Z",
      Description: "Jumbo Code Meeting 2",
      MaxPeople: 25,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
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
