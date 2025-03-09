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

export const PATCH = async (request: NextRequest) => {
  try {
    const { event } = await request.json();

    const updatedEvent = await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        ...event,
        id: undefined,
      },
    });
    return NextResponse.json(
      {
        code: "SUCCESS",
        message: updatedEvent.eventName,
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Check if id is null
  if (!id) {
    return NextResponse.json(
      {
        code: "BAD_REQUEST",
        message: "Event ID is required.",
      },
      { status: 400 }
    );
  }

  try {
    const deletedEvent = await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Event deleted successfully",
        data: deletedEvent,
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

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("id");

  try {
    if (eventId) {
      const fetchedEvent = await prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!fetchedEvent) {
        return NextResponse.json(
          { code: "NOT_FOUND", message: "No event found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { code: "SUCCESS", data: fetchedEvent },
        { status: 200 }
      );
    } else {
      const fetchedEvents = await prisma.event.findMany();
      return NextResponse.json(
        { code: "SUCCESS", data: fetchedEvents },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { code: "ERROR", message: "An error occurred while fetching events" },
      { status: 500 }
    );
  }
};
