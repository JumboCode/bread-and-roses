import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    /* @TODO: Add auth */

    const { event } = await request.json();

    const savedEvent = await prisma.event.create({
      data: event,
    });

    return NextResponse.json({
      code: "SUCCESS",
      message: savedEvent.EventName,
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
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};
