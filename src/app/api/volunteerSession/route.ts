import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * Creates a new user with associated volunteerDetails.
 * @param {NextRequest} request - The incoming request.
 * @returns {NextResponse} - JSON response with user data or error.
 */
export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { volunteerSession } = await request.json();

    await prisma.volunteerSession.create({
      data: {
        ...volunteerSession,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: `volunteerSession created for user ${volunteerSession.userId} successfully`,
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