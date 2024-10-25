import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { user, volunteerDetails } = await request.json();

    console.log("USER IN POST: ", user);
    console.log("VOLUNTEERDET IN POST: ", volunteerDetails);

    const savedUser = await prisma.user.create({
      data: {
        ...user,
      },
    });

    await prisma.volunteerDetails.create({
      data: {
        ...volunteerDetails,
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

export const DELETE = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // Assuming the user is queried by 'id'
  try {
    const deletedUser = await prisma.user.delete({
      where: { id }, // `user` must include a unique field (e.g., { id: "some-object-id" })
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

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // Assuming the user is queried by 'id'

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
    const fetchedUser = await prisma.user.findUnique({
      where: { id },
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

    return NextResponse.json({
      code: "SUCCESS",
      data: fetchedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};
