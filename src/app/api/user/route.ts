import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { user, VolunteerDetails } = await request.json();

    const savedUser = await prisma.user.create({
      data: {
        ...user, // Ensure User contains properties needed to create a User
      },
    });

    await prisma.volunteerDetails.create({
      data: {
        ...VolunteerDetails,
        userId: savedUser.id, // Link to the newly created User's ID
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
