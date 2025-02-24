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

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: savedEvent.eventName,
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

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: updateEvent.eventName,
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

export const DELETE = async (request: NextRequest) => {
  try {
    const { id } = await request.json();

    const deleteEvent = await prisma.event.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: deleteEvent.eventName,
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

// NOTE: This is for fetching all events
export const GET = async () => {
  // currently implemented for fetching all events
  // need to add filtering
  try {
    const fetchedEvents = await prisma.event.findMany(); // Use findMany to fetch all events

    if (!fetchedEvents || fetchedEvents.length === 0) {
      return NextResponse.json(
        {
          code: "NOT_FOUND",
          message: "No events found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        data: fetchedEvents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      {
        code: "ERROR",
        message: "An error occurred while fetching events",
      },
      { status: 500 }
    );
  }
};
