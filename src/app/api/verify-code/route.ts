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
      return NextResponse.json(
        {
          code: "ERROR",
          message: "Email not found",
        },
        { status: 404 }
      );
    }

    const codeDetails = await prisma.code.findUnique({
      where: { userId: user.id },
    });

    if (!codeDetails) {
      return NextResponse.json(
        {
          code: "ERROR",
          message: "Code Details not found",
        },
        { status: 404 }
      );
    }

    if (
      codeDetails.codeString !== code ||
      codeDetails.expire < new Date(Date.now())
    ) {
      return NextResponse.json(
        {
          code: "ERROR",
          message: "Code is not valid or code is expired",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Code is valid",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: error,
      },
      { status: 500 }
    );
  }
};
