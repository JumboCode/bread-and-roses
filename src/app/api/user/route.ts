import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { user } = await request.json();

    const savedUser = await prisma.user.create({
      data: user,
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
