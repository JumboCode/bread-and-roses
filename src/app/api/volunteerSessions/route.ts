import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Creates a new user with associated volunteerDetails.
 * @param {NextRequest} request - The incoming request.
 * @returns {NextResponse} - JSON response with user data or error.
 */
export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { user, volunteerDetails } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          code: "EMAIL_ALREADY_EXISTS",
          message: "User with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash the user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    const savedUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    await prisma.volunteerDetails.create({
      data: {
        ...volunteerDetails,
        userId: savedUser.id,
      },
    });

    await prisma.code.create({
      data: {
        codeString: "",
        expire: new Date(),
        userId: savedUser.id,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `User created with email: ${savedUser.email}`,
        data: savedUser,
      },
      { status: 201 }
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