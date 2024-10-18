import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { User, VolunteerDetails } = await request.json();

    const savedUser = await prisma.user.create({
      data: {
        User,
        volunteerDetails: {
          create: {
            VolunteerDetails,
          },
        },
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
