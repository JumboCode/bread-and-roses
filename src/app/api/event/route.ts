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
    const { event } = await request.json();
    const { id, ...other } = event;
    const updateEvent = await prisma.event.update({
      where: {
        id: id,
      },
      data: other,
    });

    return NextResponse.json({
      code: "SUCCESS",
      message: updateEvent.EventName,
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
  try {
    const { id } = await request.json();

    const deleteEvent = await prisma.event.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      code: "SUCCESS",
      message: deleteEvent.EventName,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      code: "ERROR",
      message: error,
    });
  }
};
