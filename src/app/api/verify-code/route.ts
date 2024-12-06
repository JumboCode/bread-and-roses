import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { email, code } = await request.json();
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({
        code: "ERROR",
        message: "Email not found",
      });
    }

    const codeDetails = await prisma.code.findUnique({
      where: { userId: user.id },
    });

    if (!codeDetails) {
      return NextResponse.json({
        code: "ERROR",
        message: "Code Details not found",
      });
    }

    if (
      codeDetails.codeString !== code ||
      codeDetails.expire < new Date(Date.now())
    ) {
      return NextResponse.json({
        code: "ERROR",
        message: "Code is not valid or code is expired",
      });
    }

    return NextResponse.json({
      code: "SUCCESS",
      message: "Code is valid",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};
