import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/* TODO: Need to fix */
export const GET = async (request: NextRequest) => {
  try {
    const { id } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    return NextResponse.json({
      code: "SUCCESS",
      message: user,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { user } = await request.json();

    const savedUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    return NextResponse.json({
      code: "SUCCESS",
      message: savedUser.email,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};
