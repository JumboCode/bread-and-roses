import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { user, volunteerDetails } = await request.json();
    console.log()

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
    console.log(savedUser);
    console.log()

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

  console.log(id);

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
      include: { volunteerDetails: true },
    });

    // const fetchedVD = await prisma.volunteerDetails.findUnique({
    //   where: { id }
    // })
    const fetchedVD = fetchedUser?.volunteerDetails;

    if (!fetchedUser || !fetchedVD) {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    console.log("IN GET: ", fetchedUser);
    const { volunteerDetails, ...user } = fetchedUser;

    console.log(user);

    return NextResponse.json({
      code: "SUCCESS",
      data: { user, fetchedVD },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { user, volunteerDetails } = await request.json();

    console.log("USER IN PUT: ", user);
    console.log("VOLUNTEERDET IN PUT: ", volunteerDetails);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...user,
        id: undefined,
      },
    });

    const updatedVD = await prisma.volunteerDetails.update({
      where: {
        id: volunteerDetails.id,
      },
      data: {
        ...volunteerDetails,
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
