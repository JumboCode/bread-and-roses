import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserByEmailServer(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}
