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

    return NextResponse.json({
      code: "SUCCESS",
      message: `User created with email: ${savedUser.email}`,
      data: savedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
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

    return NextResponse.json({
      code: "SUCCESS",
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
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

      return NextResponse.json({
        code: "SUCCESS",
        data: users,
      });
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({
        code: "ERROR",
        message: error,
      });
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

    return NextResponse.json({
      code: "SUCCESS",
      data: { user, volunteerDetails },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
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

    // id: undefined for data because we cannot modify the id
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        //TO DO: REMOVE hard coded role:
        role: "ADMIN",
        id: undefined,
      },
    });
    console.log("here", updatedUser);
    const updatedVD = await prisma.volunteerDetails.update({
      where: {
        id: volunteerDetails.id,
      },
      data: {
        ...volunteerDetails,
        //TO DO: REMOVE hard address:
        address: "johnny's house",
        id: undefined,
      },
    });

    return NextResponse.json({
      code: "SUCCESS",
      message: `User update with email: ${updatedUser.email}`,
      data: { user: updatedUser, volunteerDetails: updatedVD },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};
