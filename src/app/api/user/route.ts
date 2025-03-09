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

/**
 * Deletes a user and its associated volunteerDetails.
 * @param {NextRequest} request - The incoming request with user ID.
 * @returns {NextResponse} - JSON response indicating success or error.
 */
export const DELETE = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Check if id is null
  if (!id) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "User ID is required.",
      },
      { status: 400 }
    );
  }

  try {
    await prisma.code.delete({
      where: { userId: id },
    });

    await prisma.volunteerDetails.delete({
      where: { userId: id },
    });

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "User deleted successfully",
        data: deletedUser,
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

/**
 * Fetches a user with associated volunteerDetails.
 * @param {NextRequest} request - The incoming request with user ID.
 * @returns {NextResponse} - JSON response with user and volunteerDetails or error.
 */
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id: string | undefined = searchParams.get("id") || undefined;
  const email: string | undefined = searchParams.get("email") || undefined;
  const role: string | undefined = searchParams.get("role") || undefined;

  if (!id && !email && !role) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "User ID is required.",
      },
      { status: 400 }
    );
  }

  if (role) {
    try {
      const users = await prisma.user.findMany({
        where: { role: role === "ADMIN" ? "ADMIN" : "VOLUNTEER" },
        include: { volunteerDetails: role === "VOLUNTEER" },
      });

      if (!users || users.length === 0) {
        return NextResponse.json(
          {
            code: "NOT_FOUND",
            message: "No users found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          code: "SUCCESS",
          data: users,
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
        { status: 404 }
      );
    }
  }

  try {
    const fetchedUser = await prisma.user.findUnique({
      where: id ? { id } : { email },
      include: { volunteerDetails: true },
    });

    if (!fetchedUser) {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Do not include volunteerDetails in user we return
    const { volunteerDetails, ...user } = fetchedUser;

    return NextResponse.json(
      {
        code: "SUCCESS",
        data: { user, volunteerDetails },
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

/**
 * Updates a user and associated volunteerDetails.
 * @param {NextRequest} request - The incoming request with user and volunteerDetails data.
 * @returns {NextResponse} - JSON response with updated data or error.
 */

export const PATCH = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */
    const { user, volunteerDetails } = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        id: undefined, // needed to prevent prisma update error: overwriting "id"
      },
    });

    let updatedVD = undefined;

    if (volunteerDetails) {
      updatedVD = await prisma.volunteerDetails.update({
        where: {
          id: volunteerDetails.id,
        },
        data: {
          ...volunteerDetails,
          id: undefined,
        },
      });
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `User update with email: ${updatedUser.email}`,
        data: updatedVD
          ? { user: updatedUser, volunteerDetails: updatedVD }
          : { user: updatedUser },
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
