import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "../../../lib/nodemail";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const { email } = await request.json();
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

    const codeString = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "6");
    const expire = new Date(Date.now() + 1000 * 60);

    await prisma.code.update({
      where: { userId: user.id },
      data: { codeString, expire },
    });

    await sendMail(email, codeString);

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Forgot password email sent",
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

export const PUT = async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();

    // Hash the user's new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Password successfully updated",
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
